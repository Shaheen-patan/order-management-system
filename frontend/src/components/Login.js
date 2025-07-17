import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // ✅ correct way
 // install using: npm install jwt-decode


const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
      username: '',
      password: ''
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/token/', credentials);
          const { access, refresh } = response.data;
          // Save token to localStorage
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh); 
          const decoded = jwtDecode(response.data.access);
          localStorage.setItem("role", decoded.role);  // 👈 assuming your JWT has `role`

          alert('Login successful');
          onLogin();  // notify parent
        } catch (err) {
          console.error(err.response?.data || err.message);
          alert('Invalid username or password');
        }
    };
    
    return (
        <div className="container mt-5">
          <h2>Customer Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input type="text" name="username" className="form-control" onChange={handleChange} required />
            </div>
            <div className="form-group mt-2">
              <label>Password:</label>
              <input type="password" name="password" className="form-control" onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Login</button>
          </form>
        </div>
      );
    };
    
export default Login;