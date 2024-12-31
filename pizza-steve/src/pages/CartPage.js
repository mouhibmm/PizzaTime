import React, { useState, useEffect } from 'react';
import '../styles/CartPage.css';
import logo from '../assets/pngwing.com.png';

const CartPage = () => {
  const [craftedPizzas, setCraftedPizzas] = useState([]);
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  useEffect(() => {
    // Fetch cart items from localStorage if available
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCraftedPizzas(storedCartItems);
    } else {
      const fetchCraftedPizzas = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/orders/${userId}`);
          if (!response.ok) throw new Error('Failed to fetch crafted pizzas');
          const data = await response.json();
          console.log('Fetched crafted pizzas:', data); // Log for debugging
          setCraftedPizzas(data);
        } catch (error) {
          console.error('Error fetching crafted pizzas:', error);
        }
      };
      if (userId) fetchCraftedPizzas();
    }
  }, [userId]);

  // Handle the confirmation of an order
  const confirmOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to confirm the order');
      const updatedOrder = await response.json();
      setCraftedPizzas((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      
      // Update cart in localStorage
      const updatedCartItems = craftedPizzas.map((order) =>
        order._id === orderId ? updatedOrder : order
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

      console.log('Order confirmed:', updatedOrder);
    } catch (error) {
      console.error('Error confirming the order:', error);
    }
  };

  // Handle deleting an order
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete the order');
      // Remove the deleted order from the local state
      setCraftedPizzas((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      // Update cart in localStorage
      const updatedCartItems = craftedPizzas.filter((order) => order._id !== orderId);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

      console.log('Order deleted:', orderId);
    } catch (error) {
      console.error('Error deleting the order:', error);
    }
  };

  return (
    <div className="cart-page-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="/">
            <img src={logo} alt="Pizza Logo" className="navbar-img" />
            Pizza Steve
          </a>
        </div>
        <ul className="navbar-links">
          <li><a href="/homepage">Home</a></li>
          <li><a href="/cart">Cart ({craftedPizzas.length})</a></li>
          <li><a href="/account">Account</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>

      <div className="cart-content">
        <h2>Your Crafted Pizzas</h2>
        {craftedPizzas.length > 0 ? (
          craftedPizzas.map((item) => (
            <div key={item._id} className="cart-item">
              <p><strong>Size:</strong> {item.size}</p>
              <p><strong>Crust:</strong> {item.crust}</p>
              <p><strong>Toppings:</strong> {item.toppings.join(', ')}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
              <button className="confirm-button" onClick={() => confirmOrder(item._id)}>
                Confirm Order
              </button>
              <button className="delete-button" onClick={() => handleDeleteOrder(item._id)}>
                Delete Order
              </button>
            </div>
          ))
        ) : (
          <p className="no-orders-message">No crafted pizzas found.</p>
        )}
      </div>
    </div>
  );
};

export default CartPage;
