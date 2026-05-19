import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1A1A1A',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        border: '1px solid #2F4F4F'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,206,209,0.2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
        <img src={product.imagen} alt={product.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <div style={{ padding: '16px' }}>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>{product.nombre}</h3>
          <p style={{ color: '#00CED1', fontSize: '20px', fontWeight: 'bold' }}>${product.precio.toFixed(2)}</p>
          {product.popularidad && <p style={{ color: '#D3D3D3', fontSize: '14px' }}>⭐ {product.popularidad}% popular</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;