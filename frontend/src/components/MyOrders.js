import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('orders/my/');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        alert('Failed to load your orders.');
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter((order) =>
      order.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((order) => (statusFilter ? order.status === statusFilter : true))
    .sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return (
      <div className="container mt-5">
        <h2>My Orders</h2>
  
        {/* Search & Filter Controls */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Sort by Date</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
        {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.title}</td>
                <td>{order.pickup_address}</td>
                <td>{order.drop_address}</td>
                <td>
                  {order.status === 'pending' ? (
                    <span className="badge bg-warning text-dark">Pending</span>
                  ) : (
                    <span className="badge bg-success">Delivered</span>
                  )}
                </td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
