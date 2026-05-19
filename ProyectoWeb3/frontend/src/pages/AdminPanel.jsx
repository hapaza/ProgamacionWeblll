import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import api from '../core/services/api.service';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// Estilos comunes
const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '16px',
  background: '#2F4F4F',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontSize: '14px'
};

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Estados para Reportes
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  // Estados para Productos
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ 
    Nombre: '', marca: '', Precio: '', stock_total: '', UrlImagen: '', descripcion_corta: '' 
  });

  // Estados para Pedidos
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('todos');

  // Estados para Usuarios
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userFormData, setUserFormData] = useState({ 
    Nombre: '', Apellido: '', CorreoElectronico: '', Contraseña: '', rol: 'cliente' 
  });

  // Estados para Cotizaciones
  const [quotes, setQuotes] = useState([]);
  const [quoteFilter, setQuoteFilter] = useState('pendientes');
  const [quotePrices, setQuotePrices] = useState({});
  const [quoteDates, setQuoteDates] = useState({});

  // ============================================
  // FUNCIONES DE PRODUCTOS
  // ============================================
  const loadProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.IdProducto}`, formData);
        toast.success('Producto actualizado');
      } else {
        await api.post('/products', formData);
        toast.success('Producto creado');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setFormData({ Nombre: '', marca: '', Precio: '', stock_total: '', UrlImagen: '', descripcion_corta: '' });
      loadProducts();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      Nombre: product.Nombre,
      marca: product.marca,
      Precio: product.Precio,
      stock_total: product.stock_total,
      UrlImagen: product.UrlImagen || '',
      descripcion_corta: product.descripcion_corta || ''
    });
    setShowProductModal(true);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await api.delete(`/products/${id}`);
        loadProducts();
        toast.success('Producto eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  // ============================================
  // FUNCIONES DE PEDIDOS
  // ============================================
  const loadOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { estado: status });
      loadOrders();
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  // ============================================
  // FUNCIONES DE USUARIOS
  // ============================================
  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { rol: role });
      loadUsers();
      toast.success('Rol actualizado');
    } catch (error) {
      toast.error('Error al actualizar rol');
    }
  };

  const toggleUserStatus = async (id, active) => {
    try {
      await api.put(`/admin/users/${id}/status`, { esta_activo: active });
      loadUsers();
      toast.success(active ? 'Usuario activado' : 'Usuario bloqueado');
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        loadUsers();
        toast.success('Usuario eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleUserChange = (e) => setUserFormData({ ...userFormData, [e.target.name]: e.target.value });

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', userFormData);
      setShowUserModal(false);
      setUserFormData({ Nombre: '', Apellido: '', CorreoElectronico: '', Contraseña: '', rol: 'cliente' });
      loadUsers();
      toast.success('Usuario creado');
    } catch (error) {
      toast.error('Error al crear usuario');
    }
  };

  // ============================================
  // FUNCIONES DE COTIZACIONES
  // ============================================
  const loadQuotes = async () => {
    try {
      const res = await api.get('/admin/quotes');
      setQuotes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const setQuotePrice = (id, price) => setQuotePrices({ ...quotePrices, [id]: price });
  const setQuoteDate = (id, date) => setQuoteDates({ ...quoteDates, [id]: date });

  const acceptQuote = async (id) => {
    try {
      await api.post(`/admin/quotes/${id}/accept`, { 
        precio_cotizado: quotePrices[id], 
        fecha_entrega: quoteDates[id] 
      });
      loadQuotes();
      toast.success('Cotización aceptada');
    } catch (error) {
      toast.error('Error al aceptar');
    }
  };

  const rejectQuote = async (id) => {
    try {
      await api.post(`/admin/quotes/${id}/reject`);
      loadQuotes();
      toast.success('Cotización rechazada');
    } catch (error) {
      toast.error('Error al rechazar');
    }
  };

  // ============================================
  // FUNCIONES DE REPORTES
  // ============================================
  const loadReportsData = async () => {
    setLoading(true);
    try {
      const [sales, products, categories, revenue] = await Promise.all([
        api.get('/admin/reports/sales'),
        api.get('/admin/reports/top-products'),
        api.get('/admin/reports/category-stats'),
        api.get('/admin/reports/monthly-revenue')
      ]);
      setSalesData(sales.data);
      setTopProducts(products.data);
      setCategoryStats(categories.data);
      setMonthlyRevenue(revenue.data);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(22);
      doc.setTextColor(0, 206, 209);
      doc.text('IGNISTER - REPORTE DE VENTAS', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generado: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });
      
      const totalSales = salesData.reduce((sum, item) => sum + (item.total || 0), 0);
      
      doc.setFontSize(12);
      doc.setTextColor(200, 200, 200);
      doc.text(`Total de Ventas: $${totalSales.toLocaleString()}`, 14, 50);
      
      doc.autoTable({
        startY: 60,
        head: [['Mes', 'Total Ventas']],
        body: salesData.map(item => [item.mes, `$${item.total?.toLocaleString() || '0'}`]),
        theme: 'dark',
        headStyles: { fillColor: [0, 206, 209], textColor: [10, 10, 10] }
      });
      
      doc.save(`reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF generado');
    } catch (error) {
      toast.error('Error al generar PDF');
    }
  };

  // Gráficos
  const salesChartData = {
    labels: salesData.map(item => item.mes),
    datasets: [{
      label: 'Ventas ($)',
      data: salesData.map(item => item.total),
      borderColor: '#00CED1',
      backgroundColor: 'rgba(0, 206, 209, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const topProductsChartData = {
    labels: topProducts.map(p => p.nombre),
    datasets: [{
      label: 'Cantidad Vendida',
      data: topProducts.map(p => p.cantidad),
      backgroundColor: '#00CED1',
      borderRadius: 8
    }]
  };

  const categoryChartData = {
    labels: categoryStats.map(c => c.categoria),
    datasets: [{
      data: categoryStats.map(c => c.porcentaje),
      backgroundColor: ['#00CED1', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0']
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#D3D3D3' } },
      tooltip: { backgroundColor: '#1A1A1A', titleColor: '#00CED1' }
    },
    scales: {
      y: { grid: { color: '#2F4F4F' }, ticks: { color: '#D3D3D3' } },
      x: { ticks: { color: '#D3D3D3' } }
    }
  };

  // Filtros
  const filteredOrders = orders.filter(o => orderFilter === 'todos' || o.estado === orderFilter);
  const filteredQuotes = quotes.filter(q => quoteFilter === 'todas' || q.estado === quoteFilter);

  // Cargar datos según tab activa
  useEffect(() => {
    if (!user || user.rol !== 'admin') {
      navigate('/');
      return;
    }
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'quotes') loadQuotes();
    if (activeTab === 'reports') loadReportsData();
  }, [activeTab, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sesión cerrada');
  };

  const menuItems = [
    { id: 'dashboard', name: '📊 Dashboard', icon: '📊' },
    { id: 'products', name: '📦 Productos', icon: '📦' },
    { id: 'orders', name: '📋 Pedidos', icon: '📋' },
    { id: 'users', name: '👥 Usuarios', icon: '👥' },
    { id: 'reports', name: '📈 Reportes', icon: '📈' },
    { id: 'quotes', name: '💬 Cotizaciones', icon: '💬' },
  ];

  if (!user || user.rol !== 'admin') {
    return <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Verificando permisos...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      {/* Header */}
      <header style={{
        background: '#1A1A1A',
        borderBottom: '2px solid #00CED1',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: '#00CED1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: '#0A0A0A' }}>I</div>
          <h1 style={{ color: '#00CED1', fontSize: '24px', margin: 0 }}>Ignister Admin</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#D3D3D3' }}>👑 {user?.email}</span>
          <button onClick={handleLogout} style={{ background: '#E91E63', border: 'none', padding: '8px 20px', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
        </div>
      </header>

      {/* Menú lateral y contenido */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
        <aside style={{ width: '260px', background: '#1A1A1A', borderRight: '1px solid #2F4F4F', padding: '24px 0' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: activeTab === item.id ? '#2F4F4F' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '16px',
                color: activeTab === item.id ? '#00CED1' : '#D3D3D3',
                borderLeft: activeTab === item.id ? '3px solid #00CED1' : '3px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '20px' }}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </aside>

        <main style={{ flex: 1, padding: '32px', background: '#0A0A0A', overflowY: 'auto' }}>
          
          {/* ==================== DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ color: 'white', marginBottom: '24px' }}>📊 Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#1A1A1A', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                  <h3 style={{ color: 'white' }}>Productos</h3>
                  <p style={{ color: '#00CED1', fontSize: '32px', fontWeight: 'bold' }}>{products.length || 0}</p>
                </div>
                <div style={{ background: '#1A1A1A', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                  <h3 style={{ color: 'white' }}>Usuarios</h3>
                  <p style={{ color: '#00CED1', fontSize: '32px', fontWeight: 'bold' }}>{users.length || 0}</p>
                </div>
                <div style={{ background: '#1A1A1A', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
                  <h3 style={{ color: 'white' }}>Ventas Totales</h3>
                  <p style={{ color: '#00CED1', fontSize: '32px', fontWeight: 'bold' }}>${salesData.reduce((s, i) => s + (i.total || 0), 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== PRODUCTOS ==================== */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ color: '#00CED1' }}>📦 Gestión de Productos</h2>
                <button onClick={() => setShowProductModal(true)} className="btn btn-primary" style={{ padding: '10px 20px' }}>➕ Agregar Producto</button>
              </div>

              <div style={{ background: '#1A1A1A', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#2F4F4F', textAlign: 'left' }}>
                        <th style={{ padding: '12px 16px' }}>ID</th>
                        <th style={{ padding: '12px 16px' }}>Imagen</th>
                        <th style={{ padding: '12px 16px' }}>Producto</th>
                        <th style={{ padding: '12px 16px' }}>Marca</th>
                        <th style={{ padding: '12px 16px' }}>Precio</th>
                        <th style={{ padding: '12px 16px' }}>Stock</th>
                        <th style={{ padding: '12px 16px' }}>Acciones</th>
                       </tr>
                    </thead>
                    <tbody>
                      {products.map((product, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #2F4F4F' }}>
                          <td style={{ padding: '12px 16px', color: '#00CED1' }}>{product.IdProducto}</td>
                          <td style={{ padding: '12px 16px' }}><img src={product.UrlImagen || 'https://via.placeholder.com/40'} alt={product.Nombre} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /></td>
                          <td style={{ padding: '12px 16px', color: 'white' }}>{product.Nombre}</td>
                          <td style={{ padding: '12px 16px', color: '#D3D3D3' }}>{product.marca}</td>
                          <td style={{ padding: '12px 16px', color: '#00CED1', fontWeight: 'bold' }}>${parseFloat(product.Precio).toFixed(2)}</td>
                          <td style={{ padding: '12px 16px', color: product.stock_total > 10 ? '#4CAF50' : '#FF9800' }}>{product.stock_total}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <button onClick={() => editProduct(product)} style={{ background: '#2196F3', border: 'none', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', color: 'white' }}>✏️</button>
                            <button onClick={() => deleteProduct(product.IdProducto)} style={{ background: '#E91E63', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Producto */}
              {showProductModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                  <div style={{ background: '#1A1A1A', padding: '32px', borderRadius: '16px', width: '500px', maxWidth: '90%' }}>
                    <h3 style={{ color: '#00CED1', marginBottom: '24px' }}>{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
                    <form onSubmit={handleProductSubmit}>
                      <input type="text" name="Nombre" placeholder="Nombre del producto" value={formData.Nombre} onChange={handleProductChange} required style={inputStyle} />
                      <input type="text" name="marca" placeholder="Marca" value={formData.marca} onChange={handleProductChange} required style={inputStyle} />
                      <input type="number" name="Precio" placeholder="Precio" value={formData.Precio} onChange={handleProductChange} required style={inputStyle} />
                      <input type="number" name="stock_total" placeholder="Stock" value={formData.stock_total} onChange={handleProductChange} required style={inputStyle} />
                      <input type="text" name="UrlImagen" placeholder="URL de la imagen" value={formData.UrlImagen} onChange={handleProductChange} style={inputStyle} />
                      <textarea name="descripcion_corta" placeholder="Descripción corta" value={formData.descripcion_corta} onChange={handleProductChange} rows="3" style={inputStyle} />
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingProduct ? 'Actualizar' : 'Crear'}</button>
                        <button type="button" onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className="btn-outline" style={{ flex: 1 }}>Cancelar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== PEDIDOS ==================== */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ color: '#00CED1', marginBottom: '24px' }}>📋 Gestión de Pedidos</h2>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {['todos', 'pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'].map(estado => (
                  <button key={estado} onClick={() => setOrderFilter(estado)} style={{ padding: '8px 20px', background: orderFilter === estado ? '#00CED1' : '#2F4F4F', border: 'none', borderRadius: '20px', color: orderFilter === estado ? '#0A0A0A' : '#D3D3D3', cursor: 'pointer', fontWeight: 'bold' }}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.map((order) => (
                  <div key={order.id} style={{ background: '#1A1A1A', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <p><strong style={{ color: '#00CED1' }}>Pedido #{order.id}</strong></p>
                        <p style={{ color: '#D3D3D3', fontSize: '14px' }}>Cliente: {order.cliente}</p>
                        <p style={{ color: '#D3D3D3', fontSize: '14px' }}>Total: <strong style={{ color: '#00CED1' }}>${order.total}</strong></p>
                      </div>
                      <select value={order.estado} onChange={(e) => updateOrderStatus(order.id, e.target.value)} style={{ padding: '8px 16px', background: '#2F4F4F', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="confirmado">✅ Confirmado</option>
                        <option value="enviado">📦 Enviado</option>
                        <option value="entregado">🏠 Entregado</option>
                        <option value="cancelado">❌ Cancelado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              {filteredOrders.length === 0 && <div style={{ textAlign: 'center', padding: '60px', background: '#1A1A1A', borderRadius: '12px' }}><p style={{ color: '#D3D3D3' }}>No hay pedidos</p></div>}
            </div>
          )}

          {/* ==================== USUARIOS ==================== */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#00CED1' }}>👥 Gestión de Usuarios</h2>
                <button onClick={() => setShowUserModal(true)} className="btn btn-primary" style={{ padding: '10px 20px' }}>➕ Agregar Usuario</button>
              </div>
              <div style={{ background: '#1A1A1A', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#2F4F4F', textAlign: 'left' }}>
                        <th style={{ padding: '12px 16px' }}>ID</th><th style={{ padding: '12px 16px' }}>Nombre</th><th style={{ padding: '12px 16px' }}>Email</th>
                        <th style={{ padding: '12px 16px' }}>Rol</th><th style={{ padding: '12px 16px' }}>Estado</th><th style={{ padding: '12px 16px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem) => (
                        <tr key={userItem.CodCuenta} style={{ borderBottom: '1px solid #2F4F4F' }}>
                          <td style={{ padding: '12px 16px', color: '#00CED1' }}>{userItem.CodCuenta}</td>
                          <td style={{ padding: '12px 16px', color: 'white' }}>{userItem.Nombre} {userItem.Apellido}</td>
                          <td style={{ padding: '12px 16px', color: '#D3D3D3' }}>{userItem.CorreoElectronico}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <select value={userItem.rol} onChange={(e) => updateUserRole(userItem.CodCuenta, e.target.value)} style={{ background: '#2F4F4F', border: 'none', borderRadius: '4px', padding: '4px 8px', color: userItem.rol === 'admin' ? '#00CED1' : '#D3D3D3' }}>
                              <option value="cliente">Cliente</option><option value="admin">Admin</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button onClick={() => toggleUserStatus(userItem.CodCuenta, !userItem.esta_activo)} style={{ padding: '4px 12px', borderRadius: '20px', border: 'none', background: userItem.esta_activo ? '#4CAF50' : '#E91E63', color: 'white', cursor: 'pointer' }}>
                              {userItem.esta_activo ? 'Activo' : 'Bloqueado'}
                            </button>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button onClick={() => deleteUser(userItem.CodCuenta)} style={{ background: '#E91E63', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: 'white' }}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {showUserModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                  <div style={{ background: '#1A1A1A', padding: '32px', borderRadius: '16px', width: '500px', maxWidth: '90%' }}>
                    <h3 style={{ color: '#00CED1', marginBottom: '24px' }}>➕ Nuevo Usuario</h3>
                    <form onSubmit={handleUserSubmit}>
                      <input type="text" name="Nombre" placeholder="Nombre" value={userFormData.Nombre} onChange={handleUserChange} required style={inputStyle} />
                      <input type="text" name="Apellido" placeholder="Apellido" value={userFormData.Apellido} onChange={handleUserChange} required style={inputStyle} />
                      <input type="email" name="CorreoElectronico" placeholder="Email" value={userFormData.CorreoElectronico} onChange={handleUserChange} required style={inputStyle} />
                      <input type="password" name="Contraseña" placeholder="Contraseña" value={userFormData.Contraseña} onChange={handleUserChange} required style={inputStyle} />
                      <select name="rol" value={userFormData.rol} onChange={handleUserChange} style={inputStyle}>
                        <option value="cliente">Cliente</option><option value="admin">Administrador</option>
                      </select>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Crear</button>
                        <button type="button" onClick={() => setShowUserModal(false)} className="btn-outline" style={{ flex: 1 }}>Cancelar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== REPORTES ==================== */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ color: '#00CED1' }}>📈 Reportes y Estadísticas</h2>
                <button onClick={generatePDF} className="btn btn-primary" style={{ padding: '10px 20px' }}>📄 Descargar PDF</button>
              </div>
              {loading ? <div style={{ textAlign: 'center', padding: '60px', color: '#00CED1' }}>Cargando...</div> : (
                <>
                  <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                    <h3 style={{ color: 'white', marginBottom: '20px' }}>📊 Ventas por Mes</h3>
                    <div style={{ height: '350px' }}>{salesData.length > 0 ? <Line data={salesChartData} options={chartOptions} /> : <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2F4F4F', borderRadius: '8px' }}>No hay datos</div>}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px' }}>
                      <h3 style={{ color: 'white', marginBottom: '20px' }}>🏆 Productos Más Vendidos</h3>
                      <div style={{ height: '300px' }}>{topProducts.length > 0 ? <Bar data={topProductsChartData} options={chartOptions} /> : <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2F4F4F', borderRadius: '8px' }}>No hay datos</div>}</div>
                    </div>
                    <div style={{ background: '#1A1A1A', padding: '24px', borderRadius: '12px' }}>
                      <h3 style={{ color: 'white', marginBottom: '20px' }}>📁 Ventas por Categoría</h3>
                      <div style={{ height: '300px' }}>{categoryStats.length > 0 ? <Pie data={categoryChartData} options={{ responsive: true, plugins: { legend: { position: 'right', labels: { color: '#D3D3D3' } } } }} /> : <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2F4F4F', borderRadius: '8px' }}>No hay datos</div>}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==================== COTIZACIONES ==================== */}
          {activeTab === 'quotes' && (
            <div>
              <h2 style={{ color: '#00CED1', marginBottom: '24px' }}>💬 Cotizaciones Personalizadas</h2>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {['pendientes', 'aceptadas', 'rechazadas', 'todas'].map(tipo => (
                  <button key={tipo} onClick={() => setQuoteFilter(tipo)} style={{ padding: '8px 20px', background: quoteFilter === tipo ? '#00CED1' : '#2F4F4F', border: 'none', borderRadius: '20px', color: quoteFilter === tipo ? '#0A0A0A' : '#D3D3D3', cursor: 'pointer' }}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} style={{ background: '#1A1A1A', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                      <div><p><strong style={{ color: '#00CED1' }}>Solicitud #{quote.id}</strong></p><p style={{ color: '#D3D3D3' }}>Cliente: {quote.cliente}</p><p style={{ color: '#D3D3D3' }}>Email: {quote.email}</p></div>
                      <div><span style={{ padding: '4px 12px', borderRadius: '20px', background: quote.estado === 'pendiente' ? '#FF9800' : quote.estado === 'aceptada' ? '#4CAF50' : '#E91E63', color: 'white', fontSize: '12px' }}>{quote.estado}</span></div>
                    </div>
                    <div style={{ background: '#2F4F4F', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                      <p><strong>Producto:</strong> {quote.producto}</p><p><strong>Presupuesto:</strong> ${quote.presupuesto}</p>
                    </div>
                    {quote.estado === 'pendiente' && (
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input type="number" placeholder="Precio cotizado" onChange={(e) => setQuotePrice(quote.id, e.target.value)} style={{ padding: '10px', background: '#0A0A0A', border: '1px solid #00CED1', borderRadius: '8px', color: 'white', width: '200px' }} />
                        <input type="date" onChange={(e) => setQuoteDate(quote.id, e.target.value)} style={{ padding: '10px', background: '#0A0A0A', border: '1px solid #00CED1', borderRadius: '8px', color: 'white' }} />
                        <button onClick={() => acceptQuote(quote.id)} className="btn btn-primary">✅ Aceptar</button>
                        <button onClick={() => rejectQuote(quote.id)} className="btn-outline">❌ Rechazar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {filteredQuotes.length === 0 && <div style={{ textAlign: 'center', padding: '60px', background: '#1A1A1A', borderRadius: '12px' }}><p style={{ color: '#D3D3D3' }}>No hay cotizaciones</p></div>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;