import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    origen: '',
    correo: '',
    contraseña: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registro exitoso');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', padding: '20px' }}>
      <div style={{ background: '#1A1A1A', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid #2F4F4F' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#00CED1' }}>Crear Cuenta</h1>
          <p style={{ color: '#D3D3D3' }}>Regístrate en Ignister</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required
            style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required
            style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <input type="date" name="fechaNacimiento" onChange={handleChange} required
            style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <input type="text" name="origen" placeholder="País de origen" onChange={handleChange} required
            style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <input type="email" name="correo" placeholder="Correo electrónico" onChange={handleChange} required
            style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <input type="password" name="contraseña" placeholder="Contraseña" onChange={handleChange} required
            style={{ width: '100%', padding: '12px', marginBottom: '24px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '16px', color: '#D3D3D3' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#00CED1' }}>Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;