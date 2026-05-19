import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com', icon: '📸', color: '#E4405F' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦', color: '#1DA1F2' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: '🔗', color: '#0A66C2' },
    { name: 'TikTok', url: 'https://tiktok.com', icon: '🎵', color: '#000000' },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Ignister</h3>
          <p>Tu tienda de tecnología confiable. Importación y venta de productos digitales de última generación.</p>
        </div>

        <div className="footer-section">
          <h3>Enlaces rápidos</h3>
          <ul style={{ listStyle: 'none' }}>
            <li><a href="/products" style={{ color: '#D3D3D3', textDecoration: 'none' }}>Productos</a></li>
            <li><a href="/custom-order" style={{ color: '#D3D3D3', textDecoration: 'none' }}>Cotizar</a></li>
            <li><a href="/about" style={{ color: '#D3D3D3', textDecoration: 'none' }}>Nosotros</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Redes Sociales</h3>
          <div className="social-links">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="social-icon" style={{ background: social.color }}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h3>Métodos de pago</h3>
          <div style={{ display: 'flex', gap: '12px', fontSize: '24px' }}>
            <span>💳</span>
            <span>📱</span>
            <span>💰</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {currentYear} Ignister Tech. Todos los derechos reservados. | <a href="/privacy" style={{ color: '#00CED1' }}>Política de Privacidad</a></p>
      </div>
    </footer>
  );
};

export default Footer;