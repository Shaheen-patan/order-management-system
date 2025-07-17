
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import InventoryDashboard from './inventoryDashboard';

const AdminDashboard = () => {
  const [showInventory, setShowInventory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryStaff, setDeliveryStaff] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryStaff();
  }, []);

  const fetchDeliveryStaff = async () => {
    try {
      const res = await axiosInstance.get('users/delivery/');
      setDeliveryStaff(res.data);
    } catch (err) {
      console.error("Error fetching delivery staff:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('orders/all/');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAssignDelivery = async (orderId, userId) => {
    try {
      await axiosInstance.patch(`orders/assign/${orderId}/`, {
        assigned_to: userId
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to assign delivery:', error);
      alert('Failed to assign delivery staff.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`orders/${orderId}/`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status.');
    }
  };

  const filteredOrders = orders.filter((order) =>
    statusFilter ? order.status === statusFilter : true
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📦 Admin Dashboard</h2>

      <div className="mb-4 d-flex justify-content-end">
        <button
          className="btn btn-dark"
          onClick={() => setShowInventory(!showInventory)}
        >
          {showInventory ? '🔙 Back to Orders' : '📦 View Inventory'}
        </button>
      </div>

      {showInventory ? (
        <InventoryDashboard />
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-muted">No orders found.</p>
          ) : (
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
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
                      <span
                        className={`badge ${
                          order.status === 'pending'
                            ? 'bg-warning text-dark'
                            : 'bg-success'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.assigned_to || 'Not Assigned'}</td>
                    <td>
                      {order.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2 mb-2"
                            onClick={() =>
                              handleStatusChange(order.id, 'delivered')
                            }
                          >
                            Mark Delivered
                          </button>

                          <select
                            className="form-select form-select-sm d-inline w-auto"
                            onChange={(e) =>
                              handleAssignDelivery(order.id, e.target.value)
                            }
                            defaultValue=""
                          >
                            <option value="">Assign Delivery</option>
                            {deliveryStaff.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.username}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

