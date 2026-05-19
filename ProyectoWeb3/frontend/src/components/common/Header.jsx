import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/products' },
    { name: 'Novedades', path: '/products?filter=new' },
    { name: 'Mis Pedidos', path: '/my-orders', protected: true },
    { name: 'Cotizar Producto', path: '/custom-order', protected: true },
    { name: 'Contacto', path: '/contact' },
  ];

  const adminItems = [
    { name: 'Panel Admin', path: '/admin' },
    { name: 'Gestionar Productos', path: '/admin/products' },
    { name: 'Reportes', path: '/admin/reports' },
  ];

  return (
    <>
      <header className="header">
        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>

        <div className="logo-container">
          <div className="logo">I</div>
          <span className="site-name">Ignister</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {user && user.rol !== 'guest' ? (
            <>
              <span style={{ fontSize: '14px' }}>{user.email}</span>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '4px 12px' }}>Salir</button>
            </>
          ) : user?.rol === 'guest' ? (
            <button onClick={() => navigate('/login')} className="btn-outline" style={{ padding: '4px 12px' }}>Iniciar Sesión</button>
          ) : null}
        </div>
      </header>

      <nav className={`menu-overlay ${menuOpen ? 'open' : ''}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'white', fontSize: 24 }}>✕</button>
        
        {menuItems.map((item) => {
          if (item.protected && (!user || user.rol === 'guest')) return null;
          return (
            <Link key={item.path} to={item.path} className="menu-item" onClick={() => setMenuOpen(false)}>
              {item.name}
            </Link>
          );
        })}

        {user?.rol === 'admin' && (
          <>
            <div style={{ height: 2, background: '#2F4F4F', margin: '16px 0' }}></div>
            {adminItems.map((item) => (
              <Link key={item.path} to={item.path} className="menu-item" onClick={() => setMenuOpen(false)}>
                🔒 {item.name}
              </Link>
            ))}
          </>
        )}
      </nav>
    </>
  );
};

export default Header;