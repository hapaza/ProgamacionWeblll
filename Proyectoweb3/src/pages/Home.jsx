import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/ui/Card/ProductCard';
import Carousel from '../components/ui/Carousel/Carousel';

const Home = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Simular carga de datos (conectar con API real)
    setPopularProducts([
      { id: 1, nombre: 'UltraBook Pro', precio: 1299.99, imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', popularidad: 95 },
      { id: 2, nombre: 'Auriculares Pro', precio: 89.99, imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', popularidad: 92 },
      { id: 3, nombre: 'Smartphone Max', precio: 899.99, imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', popularidad: 98 },
    ]);
    setFeaturedProducts([
      { id: 4, nombre: 'Teclado Mecánico', precio: 129.99, imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3' },
      { id: 5, nombre: 'Mouse Gaming', precio: 49.99, imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7' },
    ]);
  }, []);

  const carouselImages = popularProducts.map(p => p.imagen);

  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '20px' }}>
        {/* Carrusel */}
        <Carousel images={carouselImages} />

        {/* Productos más populares */}
        <section style={{ maxWidth: '1200px', margin: '60px auto' }}>
          <h2 style={{ color: '#00CED1', marginBottom: '32px' }}>🔥 Más Populares</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Categorías destacadas */}
        <section style={{ maxWidth: '1200px', margin: '60px auto' }}>
          <h2 style={{ color: '#00CED1', marginBottom: '32px' }}>📦 Lo más destacado</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;