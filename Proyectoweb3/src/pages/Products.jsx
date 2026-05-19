import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/ui/Card/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Productos de prueba (hasta conectar con API)
    setProducts([
      { id: 1, nombre: 'UltraBook Pro', precio: 1299.99, imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', popularidad: 95 },
      { id: 2, nombre: 'Auriculares Pro', precio: 89.99, imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', popularidad: 92 },
      { id: 3, nombre: 'Smartphone Max', precio: 899.99, imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', popularidad: 98 },
      { id: 4, nombre: 'Teclado Mecánico RGB', precio: 149.99, imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', popularidad: 88 },
      { id: 5, nombre: 'Mouse Gaming', precio: 59.99, imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7', popularidad: 85 },
      { id: 6, nombre: 'Monitor 4K', precio: 499.99, imagen: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', popularidad: 91 },
    ]);
    setLoading(false);
  }, []);

  if (loading) return <div className="loading-screen">Cargando productos...</div>;

  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '20px', maxWidth: '1200px', margin: '80px auto 0' }}>
        <h1 style={{ color: '#00CED1', marginBottom: '32px' }}>📦 Todos los Productos</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;