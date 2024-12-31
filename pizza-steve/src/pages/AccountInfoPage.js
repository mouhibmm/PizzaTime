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
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const userId = localStorage.getItem('userId'); 

  // Fetch user data and orders on component mount
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
          password: data.password || '', 
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/confirmed/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch confirmed orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching user confirmed orders:', error);
      }
    };

    if (userId) {
      fetchUserData();
      fetchUserOrders();
    }

    // Fetch cart items count
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItemsCount(storedCartItems.length); // Update the cart item count
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to update user info
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

  // Handle toggling favorite status for an order
  const toggleFavorite = async (orderId, favorite) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite: !favorite }), // Toggle favorite status
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update favorite status');
      }
  
      const updatedOrder = await response.json();
      console.log('Updated Order:', updatedOrder);
  
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    } catch (error) {
      console.error('Error updating favorite status:', error);
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
          <li><a href="/homepage">Home</a></li>
          <li><a href="/cart">Cart ({cartItemsCount})</a></li> {/* Display cart item count */}
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
                placeholder="Address"
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
                placeholder="State"
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
            orders.map((order) => (
              <div key={order._id} className="order">
                <div className="order-details">
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Method:</strong> {order.method}</p>
                  <p><strong>Size:</strong> {order.size}</p>
                  <p><strong>Crust:</strong> {order.crust}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Toppings:</strong> {order.toppings.join(', ')}</p>
                  <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
                </div>
                <button
                  className={`favorite-button ${order.favorite ? 'favorite' : ''}`}
                  onClick={() => toggleFavorite(order._id, order.favorite)}
                >
                  {order.favorite ? '★' : '☆'}
                </button>
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
