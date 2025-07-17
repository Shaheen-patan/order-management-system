import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';


const OrderForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    pickup_address: '',
    drop_address: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await axiosInstance.post('orders/create/', formData);


      alert('Order placed successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Error placing order');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Place a New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Pickup Address</label>
          <textarea
            className="form-control"
            name="pickup_address"
            value={formData.pickup_address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Drop Address</label>
          <textarea
            className="form-control"
            name="drop_address"
            value={formData.drop_address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
