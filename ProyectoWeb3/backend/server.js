require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/infraestructure/database/postgres/connection');

const PORT = process.env.PORT || 5000;

// Verificar conexión a DB
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  });