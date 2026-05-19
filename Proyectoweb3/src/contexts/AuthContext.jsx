import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../core/services/api.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔐 Cargando usuario desde localStorage...');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('✅ Usuario cargado:', parsedUser);
        } else {
          console.log('⚠️ No hay usuario guardado');
        }
      } catch (err) {
        console.error('❌ Error cargando usuario:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login de usuario
  const login = async (email, password, captchaToken) => {
    setError(null);
    console.log('🔐 Intentando login:', email);
    
    try {
      const response = await api.post('/auth/login', { 
        correo: email, 
        contraseña: password, 
        captchaToken 
      });
      
      console.log('📦 Respuesta del backend:', response.data);
      
      const { token, user: userData } = response.data;
      
      // Validar que el usuario tiene rol
      if (!userData.rol) {
        console.warn('⚠️ Usuario sin rol definido, asignando "cliente"');
        userData.rol = 'cliente';
      }
      
      console.log('👤 Rol del usuario:', userData.rol);
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Configurar header de axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Actualizar estado
      setUser(userData);
      
      console.log('✅ Login exitoso - Usuario:', userData.email, 'Rol:', userData.rol);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMsg);
      throw error;
    }
  };

  // Registro de usuario
  const register = async (userData) => {
    setError(null);
    console.log('📝 Intentando registrar:', userData.correo);
    
    try {
      const response = await api.post('/auth/register', {
        nombre: userData.nombre,
        apellido: userData.apellido,
        fechaNacimiento: userData.fechaNacimiento,
        origen: userData.origen,
        correo: userData.correo,
        contraseña: userData.contraseña
      });
      
      console.log('📦 Respuesta del registro:', response.data);
      
      const { token, user: newUser } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Configurar header de axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Actualizar estado
      setUser(newUser);
      
      console.log('✅ Registro exitoso - Usuario:', newUser.email);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || 'Error al registrarse';
      setError(errorMsg);
      throw error;
    }
  };

  // Login como invitado
  const guestLogin = async () => {
    setError(null);
    console.log('👤 Intentando acceso como invitado');
    
    try {
      const response = await api.post('/auth/guest');
      console.log('📦 Respuesta invitado:', response.data);
      
      const { token } = response.data;
      const guestUser = { 
        rol: 'guest', 
        email: 'invitado@ignister.com', 
        id: null,
        isGuest: true 
      };
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(guestUser));
      
      // Configurar header de axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Actualizar estado
      setUser(guestUser);
      
      console.log('✅ Acceso invitado exitoso');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en acceso invitado:', error);
      const errorMsg = error.response?.data?.error || 'Error al acceder como invitado';
      setError(errorMsg);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiar header de axios
    delete api.defaults.headers.common['Authorization'];
    
    // Limpiar estado
    setUser(null);
    setError(null);
    
    console.log('✅ Sesión cerrada');
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user?.rol === 'admin';
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return user !== null && user.rol !== 'guest';
  };

  // Verificar si es invitado
  const isGuest = () => {
    return user?.rol === 'guest';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    guestLogin,
    logout,
    isAdmin,
    isAuthenticated,
    isGuest
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;