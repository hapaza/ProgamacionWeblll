const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../../../infraestructure/database/postgres/connection');

const SALT_ROUNDS = 10;

// Función para obtener el nombre correcto de la tabla
const getTableName = async () => {
  // Verificar qué tablas existen
  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name ILIKE '%cuenta%' 
    AND table_schema = 'public'
  `);
  
  console.log('📋 Tablas encontradas:', tables.rows.map(r => r.table_name));
  
  if (tables.rows.length === 0) {
    throw new Error('No se encuentra la tabla de usuarios');
  }
  
  // Devolver el nombre exacto de la tabla
  return tables.rows[0].table_name;
};

// Función para obtener los nombres de las columnas
const getColumnNames = async (tableName) => {
  const columns = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1
  `, [tableName]);
  
  console.log(`📋 Columnas de ${tableName}:`, columns.rows.map(c => c.column_name));
  return columns.rows.map(c => c.column_name);
};

const verifyCaptcha = async (token) => {
  return true;
};

const register = async (userData) => {
  const { nombre, apellido, fechaNacimiento, origen, correo, contraseña } = userData;
  
  console.log('📝 Intentando registrar:', correo);
  
  // Obtener nombre real de la tabla
  const tableName = await getTableName();
  const columns = await getColumnNames(tableName);
  
  // Verificar si el correo ya existe (adaptando al nombre de columna)
  let emailColumn = columns.find(c => c.toLowerCase().includes('correo') || c.toLowerCase().includes('email'));
  emailColumn = emailColumn || 'correoelectronico';
  
  const existing = await pool.query(
    `SELECT * FROM "${tableName}" WHERE "${emailColumn}" ILIKE $1`,
    [correo]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('El correo ya está registrado');
  }
  
  const hashedPassword = await bcrypt.hash(contraseña, SALT_ROUNDS);
  
  // Construir INSERT dinámicamente
  const idColumn = columns.find(c => c.toLowerCase().includes('cod') || c.toLowerCase().includes('id'));
  const nameColumn = columns.find(c => c.toLowerCase() === 'nombre');
  const lastnameColumn = columns.find(c => c.toLowerCase() === 'apellido');
  const birthColumn = columns.find(c => c.toLowerCase().includes('fecha'));
  const originColumn = columns.find(c => c.toLowerCase() === 'origen');
  const passColumn = columns.find(c => c.toLowerCase().includes('contrase') || c.toLowerCase().includes('password'));
  const roleColumn = columns.find(c => c.toLowerCase() === 'rol');
  
  const result = await pool.query(
    `INSERT INTO "${tableName}" 
     ("${nameColumn}", "${lastnameColumn}", "${birthColumn}", "${originColumn}", "${emailColumn}", "${passColumn}", "${roleColumn}")
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [nombre, apellido, fechaNacimiento, origen, correo, hashedPassword, 'cliente']
  );
  
  const newUser = result.rows[0];
  
  const token = jwt.sign(
    { userId: newUser[idColumn], email: correo, rol: 'cliente' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  console.log('✅ Usuario registrado:', correo);
  
  return {
    token,
    user: {
      id: newUser[idColumn],
      email: newUser[emailColumn],
      rol: newUser[roleColumn]
    }
  };
};

const login = async (correo, contraseña, captchaToken, req) => {
  console.log('=========================================');
  console.log('🔍 Intentando login con email:', correo);
  
  await verifyCaptcha(captchaToken);
  
  try {
    // Obtener nombre real de la tabla
    const tableName = await getTableName();
    const columns = await getColumnNames(tableName);
    
    console.log(`📋 Usando tabla: "${tableName}"`);
    
    // Encontrar nombres de columnas importantes
    const idColumn = columns.find(c => c.toLowerCase().includes('cod') || c.toLowerCase().includes('id'));
    const emailColumn = columns.find(c => c.toLowerCase().includes('correo') || c.toLowerCase().includes('email'));
    const passColumn = columns.find(c => c.toLowerCase().includes('contrase') || c.toLowerCase().includes('password'));
    const roleColumn = columns.find(c => c.toLowerCase() === 'rol');
    const nameColumn = columns.find(c => c.toLowerCase() === 'nombre');
    const activeColumn = columns.find(c => c.toLowerCase().includes('activo'));
    const attemptsColumn = columns.find(c => c.toLowerCase().includes('intento'));
    const blockedColumn = columns.find(c => c.toLowerCase().includes('bloqueado'));
    
    console.log('📋 Columnas mapeadas:', {
      idColumn, emailColumn, passColumn, roleColumn, nameColumn
    });
    
    // Buscar usuario
    const query = `
      SELECT * FROM "${tableName}" 
      WHERE "${emailColumn}" ILIKE $1
    `;
    
    console.log('📝 Query:', query);
    console.log('📝 Buscando email:', correo);
    
    const result = await pool.query(query, [correo]);
    
    console.log('📊 Filas encontradas:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      throw new Error('Credenciales incorrectas');
    }
    
    const user = result.rows[0];
    console.log('✅ Usuario encontrado:');
    console.log('   - ID:', user[idColumn]);
    console.log('   - Nombre:', user[nameColumn]);
    console.log('   - Email:', user[emailColumn]);
    console.log('   - Rol:', user[roleColumn]);
    
    // Verificar si está activo
    if (activeColumn && user[activeColumn] === false) {
      throw new Error('Cuenta desactivada');
    }
    
    // Verificar bloqueo
    if (blockedColumn && user[blockedColumn] && new Date() < new Date(user[blockedColumn])) {
      throw new Error(`Cuenta bloqueada hasta ${user[blockedColumn]}`);
    }
    
    // Comparar contraseña
    let validPassword = false;
    try {
      // Cambiar ESTO:


// Por ESTO (temporal):
validPassword = (contraseña === user.contraseña);
console.log('🔑 Comparación TEXTO PLANO:', validPassword);
      console.log('🔑 bcrypt.compare:', validPassword);
    } catch (err) {
      console.log('❌ Error bcrypt:', err.message);
      validPassword = (contraseña === user[passColumn]);
      console.log('🔑 Comparación directa:', validPassword);
    }
    
    if (!validPassword) {
      if (attemptsColumn) {
        const newAttempts = (user[attemptsColumn] || 0) + 1;
        let bloqueadoHasta = null;
        
        if (newAttempts >= 5) {
          bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000);
        }
        
        await pool.query(
          `UPDATE "${tableName}" SET "${attemptsColumn}" = $1, "${blockedColumn}" = $2 WHERE "${idColumn}" = $3`,
          [newAttempts, bloqueadoHasta, user[idColumn]]
        );
      }
      
      throw new Error(`Credenciales incorrectas`);
    }
    
    // Resetear intentos fallidos
    if (attemptsColumn) {
      await pool.query(
        `UPDATE "${tableName}" SET "${attemptsColumn}" = 0, "${blockedColumn}" = NULL WHERE "${idColumn}" = $1`,
        [user[idColumn]]
      );
    }
    
    const token = jwt.sign(
      { userId: user[idColumn], email: user[emailColumn], rol: user[roleColumn] },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login exitoso - Rol:', user[roleColumn]);
    console.log('=========================================');
    
    return { 
      token, 
      user: { 
        id: user[idColumn], 
        email: user[emailColumn], 
        rol: user[roleColumn] 
      } 
    };
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('=========================================');
    throw error;
  }
};

const guestAccess = async (req) => {
  console.log('👤 Acceso invitado');
  
  const token = jwt.sign(
    { rol: 'guest', type: 'guest' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  
  return token;
};

module.exports = { register, login, guestAccess };