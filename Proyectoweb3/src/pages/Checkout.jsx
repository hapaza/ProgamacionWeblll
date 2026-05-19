import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [method, setMethod] = useState('qr');
  const navigate = useNavigate();

  const handlePayment = () => {
    toast.success('¡Pago procesado con éxito! Gracias por tu compra');
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '40px 20px', maxWidth: '600px', margin: '80px auto 0' }}>
        <h1 style={{ color: '#00CED1' }}>Finalizar Compra</h1>
        <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px', marginTop: '24px' }}>
          <h3 style={{ color: 'white' }}>Método de pago</h3>
          <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: '100%', padding: '12px', margin: '16px 0', background: '#2F4F4F', color: 'white', border: 'none', borderRadius: '8px' }}>
            <option value="qr">📱 QR (Yape/Plin)</option>
            <option value="card">💳 Tarjeta</option>
            <option value="cash">💰 Efectivo contraentrega</option>
          </select>
          <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%' }}>Pagar</button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;