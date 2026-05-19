import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const CustomOrder = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Solicitud enviada, te contactaremos pronto');
  };

  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '40px 20px', maxWidth: '600px', margin: '80px auto 0' }}>
        <h1 style={{ color: '#00CED1' }}>Solicitar Cotización</h1>
        <form onSubmit={handleSubmit} style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px', marginTop: '24px' }}>
          <input type="text" placeholder="Producto deseado" required style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <textarea placeholder="Descripción detallada" rows="4" required style={{ width: '100%', padding: '12px', marginBottom: '12px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <input type="number" placeholder="Presupuesto máximo" style={{ width: '100%', padding: '12px', marginBottom: '24px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white' }} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Enviar Solicitud</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default CustomOrder;