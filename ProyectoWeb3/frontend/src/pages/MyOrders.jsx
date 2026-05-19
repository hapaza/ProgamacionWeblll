
import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MyOrders = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#00CED1' }}>📋 Mis Pedidos</h1>
        <p style={{ color: '#D3D3D3' }}>No tienes pedidos aún</p>
      </main>
      <Footer />
    </>
  );
};

export default MyOrders;