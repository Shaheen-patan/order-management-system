import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axiosInstance.get('/inventory/');  // adjust if needed
      setInventory(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📦 Inventory Dashboard</h2>
      {inventory.length === 0 ? (
        <p className="text-muted">No inventory items found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.quantity < 3 ? (
                    <span className="badge bg-danger">Low Stock</span>
                  ) : (
                    <span className="badge bg-success">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryDashboard;
