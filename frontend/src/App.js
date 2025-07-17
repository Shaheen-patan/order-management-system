import React, { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import Login from './components/Login';
import MyOrders from './components/MyOrders';
import AdminDashboard from './components/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('form');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setView(role === 'admin' ? 'admin' : 'form');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setView('admin');
    } else {
      setView('form');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setView('form');
  };

  const role = localStorage.getItem('role'); // 'admin' or 'customer'

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Logistics Order Management</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* === Navigation Buttons === */}
      <div className="mb-3">
        {role === 'customer' && (
          <>
            <button
              className={`btn me-2 ${view === 'form' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setView('form')}
            >
              Place Order
            </button>
            <button
              className={`btn me-2 ${view === 'orders' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setView('orders')}
            >
              My Orders
            </button>
          </>
        )}

        {role === 'admin' && (
          <button
            className={`btn ${view === 'admin' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setView('admin')}
          >
            Admin Dashboard
          </button>
        )}
      </div>

      {/* === View Renderer === */}
      <div className="mt-4">
        {view === 'form' && role === 'customer' && <OrderForm />}
        {view === 'orders' && role === 'customer' && <MyOrders />}
        {view === 'admin' && role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}

export default App;
