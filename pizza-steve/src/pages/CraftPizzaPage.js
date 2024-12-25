import React, { useState } from 'react';
import '../styles/CraftPizzaPage.css'; // Specific styles for this page
import logo from '../assets/pngwing.com.png'; // Your logo
import '../styles/HomePage.css'; // Ensure navbar styles remain consistent

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

  const handleAddToOrder = () => {
    const pizzaDetails = {
      method,
      size,
      crust,
      quantity,
      toppings,
    };
    console.log('Pizza added to order:', pizzaDetails);
    alert('Pizza added to order!');
  };

  return (
    <div className="craft-pizza-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="/">
            <img src={logo} alt="Pizza Steve Logo" className="navbar-img" />
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
      <h2 className="form-title">Customize Your Pizza</h2> {/* Added this line */}
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
              <div key={index} className="topping-item">
                <input
                  type="checkbox"
                  id={`topping-${index}`}
                  checked={toppings.includes(topping)}
                  onChange={() => handleToppingChange(topping)}
                />
                <label htmlFor={`topping-${index}`}>{topping}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="button" className="add-to-order-btn" onClick={handleAddToOrder}>
          Add to Order
        </button>
      </form>
    </div>
  );
}

export default CraftPizzaPage;
