import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#00CED1' }}>🛒 Tu Carrito</h1>
        <p style={{ color: '#D3D3D3', marginTop: '20px' }}>Aún no hay productos en tu carrito</p>
        <Link to="/products" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>Ver Productos</Link>
      </main>
      <Footer />
    </>
  );
};

export default Cart;