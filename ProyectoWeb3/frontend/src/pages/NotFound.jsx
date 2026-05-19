import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ color: '#00CED1', fontSize: '80px' }}>404</h1>
      <p style={{ color: '#D3D3D3', fontSize: '20px' }}>Página no encontrada</p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>Volver al inicio</Link>
    </div>
  );
};

export default NotFound;