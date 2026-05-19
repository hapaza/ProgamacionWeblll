import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import api from '../core/services/api.service';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [stats, setStats] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    try {
      const [productRes, statsRes, historyRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/stats/${id}`),
        api.get(`/products/price-history/${id}`)
      ]);
      setProduct(productRes.data);
      setStats(statsRes.data);
      setPriceHistory(historyRes.data);
    } catch (error) {
      console.error('Error cargando producto:', error);
      toast.error('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!user || user.rol === 'guest') {
      toast.error('Debes iniciar sesión para calificar');
      navigate('/login');
      return;
    }

    try {
      await api.post('/products/rate', {
        productId: id,
        rating,
        comment
      });
      toast.success('Calificación enviada');
      setRating(0);
      setComment('');
      loadProductData();
    } catch (error) {
      toast.error('Error al enviar calificación');
    }
  };

  const handleBuy = () => {
    if (!user || user.rol === 'guest') {
      toast.error('Debes iniciar sesión para comprar');
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { product } });
  };

  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (!product) return <div className="loading-screen">Producto no encontrado</div>;

  // Datos para el gráfico de precios
  const priceChartData = {
    labels: priceHistory.map(h => h.fecha).reverse(),
    datasets: [
      {
        label: 'Precio ($)',
        data: priceHistory.map(h => parseFloat(h.precio)).reverse(),
        borderColor: '#00CED1',
        backgroundColor: 'rgba(0, 206, 209, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Datos para el gráfico de popularidad
  const popularityChartData = {
    labels: ['Popularidad', 'Rating Promedio'],
    datasets: [
      {
        label: 'Métricas',
        data: [
          product.Popularidad || 0,
          stats?.rating_promedio ? parseFloat(stats.rating_promedio) * 20 : 0
        ],
        backgroundColor: ['#00CED1', '#4CAF50'],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#D3D3D3' } },
      title: { display: true, text: 'Evolución de Precio', color: '#00CED1' }
    },
    scales: { y: { grid: { color: '#2F4F4F' }, ticks: { color: '#D3D3D3' } } }
  };

  return (
    <>
      <Header />
      <main style={{ marginTop: '80px', padding: '40px 20px', maxWidth: '1200px', margin: '80px auto 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Imagen del producto */}
          <div>
            <img 
              src={product.UrlImagen || 'https://via.placeholder.com/500'} 
              alt={product.Nombre} 
              style={{ width: '100%', borderRadius: '12px' }} 
            />
          </div>

          {/* Información del producto */}
          <div>
            <h1 style={{ color: 'white', fontSize: '32px' }}>{product.Nombre}</h1>
            <p style={{ color: '#D3D3D3', marginTop: '8px' }}>{product.marca}</p>
            <p style={{ color: '#00CED1', fontSize: '28px', fontWeight: 'bold', margin: '16px 0' }}>
              ${parseFloat(product.Precio).toFixed(2)}
            </p>
            <p style={{ color: '#D3D3D3', marginBottom: '24px' }}>{product.descripcion_corta}</p>
            
            <div style={{ background: '#1A1A1A', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ color: 'white' }}>Especificaciones:</h3>
              <ul style={{ color: '#D3D3D3', marginTop: '12px', listStyle: 'none' }}>
                <li>📦 Origen: {product.Origen || 'No especificado'}</li>
                <li>🎨 Color: {product.Color || 'No especificado'}</li>
                <li>📊 Stock: {product.stock_total} unidades</li>
                <li>⭐ Popularidad: {product.Popularidad}%</li>
                <li>★ Calificación: {product.calificacion_promedio?.toFixed(1)}/5 ({product.total_calificaciones || 0} reseñas)</li>
              </ul>
            </div>

            <button onClick={handleBuy} className="btn btn-primary" style={{ fontSize: '18px', padding: '12px 32px', width: '100%' }}>
              🛒 Comprar Ahora
            </button>
          </div>
        </div>

        {/* SECCIÓN DE GRÁFICOS ESTADÍSTICOS (OBLIGATORIO) */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ color: '#00CED1', marginBottom: '32px', textAlign: 'center' }}>
            📊 Estadísticas del Producto
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {/* Gráfico de evolución de precio */}
            <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>📈 Evolución de Precio</h3>
              {priceHistory.length > 0 ? (
                <Line data={priceChartData} options={chartOptions} />
              ) : (
                <p style={{ color: '#D3D3D3', textAlign: 'center' }}>No hay historial de precios disponible</p>
              )}
              <p style={{ color: '#D3D3D3', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
                Últimos {priceHistory.length} cambios de precio
              </p>
            </div>

            {/* Gráfico de popularidad vs rating */}
            <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>⭐ Popularidad vs Rating</h3>
              <Bar data={popularityChartData} options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: false } },
                scales: { y: { max: 100, grid: { color: '#2F4F4F' }, ticks: { color: '#D3D3D3' } } }
              }} />
              <p style={{ color: '#D3D3D3', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
                Popularidad: {product.Popularidad}% | Rating: {(stats?.rating_promedio || 0).toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE CALIFICACIONES */}
        <div style={{ marginTop: '60px', background: '#1A1A1A', padding: '32px', borderRadius: '12px' }}>
          <h2 style={{ color: '#00CED1', marginBottom: '24px' }}>⭐ Calificar este producto</h2>
          
          <form onSubmit={handleSubmitRating} style={{ maxWidth: '500px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Tu puntuación:</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: '30px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: star <= rating ? '#FFD700' : '#2F4F4F'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '8px' }}>Tu comentario:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#2F4F4F',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                placeholder="Cuéntanos tu experiencia con este producto..."
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Enviar Calificación
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;