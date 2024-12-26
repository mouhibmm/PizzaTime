import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CraftPizzaPage.css';
import logo from '../assets/pngwing.com.png';
import '../styles/HomePage.css';

function CraftPizzaPage() {
  const [method, setMethod] = useState('CarryOut');
  const [size, setSize] = useState('Large');
  const [crust, setCrust] = useState('Thin Crust');
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState([]);

  const availableToppings = [
    'Pepperoni',
    'Mushrooms',
    'Onions',
    'Sausage',
    'Bacon',
    'Extra Cheese',
    'Black Olives',
    'Green Peppers',
  ];

  const handleToppingChange = (topping) => {
    setToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((item) => item !== topping)
        : [...prev, topping]
    );
  };

  const handleAddToOrder = async () => {
    const pizzaDetails = {
      method,
      size,
      crust,
      quantity,
      toppings,
      price: calculatePrice(size, toppings.length, quantity),
      userId: localStorage.getItem('userId'), // Get userId from localStorage
    };

    try {
      const res = await axios.post('http://localhost:3000/api/orders', pizzaDetails, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'), // Add token if needed
        },
      });
      console.log('Order saved:', res.data);
      alert('Pizza added to order!');
    } catch (err) {
      console.error('Error saving order:', err.response.data);
      alert('Failed to add pizza to order');
    }
  };

  const calculatePrice = (size, toppingsCount, quantity) => {
    let basePrice = 10;
    if (size === 'Medium') basePrice += 3;
    if (size === 'Large') basePrice += 5;
    const toppingsPrice = toppingsCount * 0.5;
    return (basePrice + toppingsPrice) * quantity;
  };

  return (
    <div className="craft-pizza-page">
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="/">
            <img src={logo} alt="Pizza Logo" className="navbar-img" />
            Pizza Steve
          </a>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/order">Order (0)</a>
          <a href="/account">Account</a>
          <a href="/logout">Logout</a>
        </div>
      </nav>
      <header>
        <h2 className="form-title">Customize Your Pizza</h2>
      </header>
      <form className="pizza-form">
        <div className="form-group">
          <label htmlFor="method">Method:</label>
          <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="CarryOut">CarryOut</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="size">Size:</label>
          <select id="size" value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="crust">Crust:</label>
          <select id="crust" value={crust} onChange={(e) => setCrust(e.target.value)}>
            <option value="Thin Crust">Thin Crust</option>
            <option value="Regular Crust">Regular Crust</option>
            <option value="Stuffed Crust">Stuffed Crust</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Toppings:</label>
          <div className="toppings-list">
            {availableToppings.map((topping, index) => (
              <div key={index} className="topping">
                <input
                  type="checkbox"
                  id={topping}
                  checked={toppings.includes(topping)}
                  onChange={() => handleToppingChange(topping)}
                />
                <label htmlFor={topping}>{topping}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <p>Total Price: ${calculatePrice(size, toppings.length, quantity)}</p>
          <button type="button" onClick={handleAddToOrder} className="submit-btn">
            Add to Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default CraftPizzaPage;
