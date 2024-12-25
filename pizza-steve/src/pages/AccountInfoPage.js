import React, { useState, useEffect } from 'react';
import '../styles/AccountInfoPage.css';
import logo from '../assets/pngwing.com.png';
const AccountInfoPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    adress: '',
    city: '',
    state: '',
    password: '',
  });

  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId'); // Retrieve from localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setFormData({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          adress: data.adress,
          city: data.city,
          state: data.state,
          password: data.password || '', // Optional
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}/orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchUserOrders();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const result = await response.json();
      console.log('User updated:', result);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="account-info-container">
      <nav className="navbar">
        <div className="navbar-logo">
        <a href="/">
          <img src={logo} alt="Pizza Steve Logo" className="navbar-img" />
            Pizza Steve
            </a>
        </div>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/orders">Order ({orders.length})</a></li>
          <li><a href="/account">Account</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>

      <div className="account-info-content">
        <div className="account-info-section">
          <h2>Account Info</h2>
          <form onSubmit={handleSubmit} className="account-info-form">
            <div className="form-group">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="adress"
                placeholder="Adress"
                value={formData.adress}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="update-button">Update</button>
          </form>
        </div>

        <div className="past-orders-section">
          <h2>Past Orders</h2>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="order">
                <span>{order.date}</span>
                <span>{order.details}</span>
                <span>{order.price}</span>
                <input type="checkbox" checked={order.favorite} readOnly />
              </div>
            ))
          ) : (
            <p>No past orders</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfoPage;
