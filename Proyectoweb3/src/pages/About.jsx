import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const About = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '40px 20px', maxWidth: '800px', margin: '80px auto 0', textAlign: 'center' }}>
        <h1 style={{ color: '#00CED1' }}>Sobre Ignister</h1>
        <p style={{ color: '#D3D3D3', marginTop: '20px' }}>Somos una tienda especializada en productos tecnológicos de última generación.</p>
      </main>
      <Footer />
    </>
  );
};

export default About;