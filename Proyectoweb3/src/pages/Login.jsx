import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error('Completa el CAPTCHA');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password, captchaToken);
      console.log('🔐 Login exitoso:', result);
      console.log('👤 Rol recibido:', result.user?.rol);
      
      toast.success(`Bienvenido ${result.user?.rol === 'admin' ? 'Administrador' : 'a Ignister'}`);
      
      // LIMPIAR LOS CAMPOS del formulario
      setEmail('');
      setPassword('');
      setCaptchaToken(null);
      
      // Redirigir según el rol
      if (result.user?.rol === 'admin') {
        console.log('🚀 Redirigiendo a /admin');
        navigate('/admin');
      } else {
        console.log('🚀 Redirigiendo a /');
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      const errorMsg = error.response?.data?.error || 'Error al iniciar sesión';
      toast.error(errorMsg);
      // NO limpiar los campos en error para que el usuario pueda corregir
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    try {
      await guestLogin();
      toast.success('Modo invitado activado');
      navigate('/');
    } catch (error) {
      toast.error('Error al ingresar como invitado');
    }
  };

  // Función para limpiar manualmente los campos
  const handleClearFields = () => {
    setEmail('');
    setPassword('');
    setCaptchaToken(null);
    toast.info('Campos limpiados');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0A0A0A', 
      padding: '20px' 
    }}>
      <div style={{ 
        background: '#1A1A1A', 
        padding: '40px', 
        borderRadius: '16px', 
        width: '100%', 
        maxWidth: '450px', 
        border: '1px solid #2F4F4F' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: '#00CED1', 
            borderRadius: '15px', 
            margin: '0 auto 16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '30px' 
          }}>
            I
          </div>
          <h1 style={{ color: 'white' }}>Ignister</h1>
          <p style={{ color: '#D3D3D3' }}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginBottom: '16px', 
              background: '#2F4F4F', 
              border: 'none', 
              borderRadius: '8px', 
              color: 'white',
              fontSize: '16px'
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginBottom: '16px', 
              background: '#2F4F4F', 
              border: 'none', 
              borderRadius: '8px', 
              color: 'white',
              fontSize: '16px'
            }}
          />

          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              marginBottom: '12px',
              padding: '12px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

          <button 
            type="button" 
            onClick={handleGuest} 
            className="btn btn-outline" 
            style={{ 
              width: '100%', 
              marginBottom: '12px',
              padding: '12px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            📖 Modo Solo Lectura (Invitado)
          </button>

          <button 
            type="button" 
            onClick={handleClearFields}
            style={{ 
              width: '100%', 
              marginBottom: '16px',
              padding: '12px',
              fontSize: '14px',
              background: 'transparent',
              border: '1px solid #D3D3D3',
              borderRadius: '8px',
              color: '#D3D3D3',
              cursor: 'pointer'
            }}
          >
            🧹 Limpiar campos
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ color: '#00CED1' }}>
              ¿No tienes cuenta? Regístrate
            </Link>
            <br />
            <Link to="/forgot-password" style={{ color: '#D3D3D3', fontSize: '14px' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;