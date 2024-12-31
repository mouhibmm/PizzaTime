import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import logo from '../assets/pngwing.com.png';
import newOrderImage from '../assets/fUcnv476_400x400.jpg';
import favoriteImage from '../assets/b9306eff-51bf-4e63-963d-782faa0bc81b.webp';
import surpriseMeImage from '../assets/SliceOfLife.webp';

function HomePage() {
  const [favoritePizza, setFavoritePizza] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [lastOrder, setLastOrder] = useState(null); // To track the last order
  const userId = localStorage.getItem('userId');

  // Fetch cart items from localStorage when component mounts
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  useEffect(() => {
    const fetchFavoritePizza = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/favorite/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch favorite pizza');
        const data = await response.json();
        setFavoritePizza(data);
      } catch (error) {
        console.error('Error fetching favorite pizza:', error);
      }
    };

    if (userId) {
      fetchFavoritePizza();
    }
  }, [userId]);

  const handleReorderFavorite = async () => {
    if (!favoritePizza) {
      alert('No favorite pizza found!');
      return;
    }

    const pizzaDetails = {
      ...favoritePizza,
      userId,
      status: 'pending', // default status for a new order
      price: favoritePizza.price || calculatePrice(favoritePizza.size, favoritePizza.toppings.length, favoritePizza.quantity), // Ensure price is calculated if not available
    };

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pizzaDetails),
      });

      if (!response.ok) throw new Error('Failed to reorder favorite pizza');
      
      // Add the pizza to the cart
      const updatedCartItems = [...cartItems, pizzaDetails];

      // Save the updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

      // Update the cart items state
      setCartItems(updatedCartItems);

      alert('Favorite pizza added to cart successfully!');
    } catch (error) {
      console.error('Error reordering favorite pizza:', error);
      alert('Failed to reorder favorite pizza');
    }
  };

  // Function to calculate price based on pizza size, toppings count, and quantity
  const calculatePrice = (size, toppingsCount, quantity) => {
    const sizePriceMap = {
      Small: 8,
      Medium: 10,
      Large: 12,
    };

    const basePrice = sizePriceMap[size] || 8; // Default to small price if size is not found
    const toppingPrice = 2; // Assume each topping adds 2 units to the price
    const toppingsTotal = toppingsCount * toppingPrice;

    return quantity * (basePrice + toppingsTotal);
  };

  // Function to generate a random pizza order
  const generateRandomOrder = () => {
    const sizes = ['Small', 'Medium', 'Large'];
    const crusts = ['Thin', 'Thick', 'Stuffed'];
    const toppings = ['Cheese', 'Pepperoni', 'Mushrooms', 'Olives', 'Onions', 'Bacon', 'Peppers', 'Pineapple'];
    const randomToppingsCount = Math.floor(Math.random() * 4) + 1; // Random number of toppings (1-4)

    // Random size, crust, and toppings
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const crust = crusts[Math.floor(Math.random() * crusts.length)];
    const selectedToppings = [];
    for (let i = 0; i < randomToppingsCount; i++) {
      const randomTopping = toppings[Math.floor(Math.random() * toppings.length)];
      if (!selectedToppings.includes(randomTopping)) {
        selectedToppings.push(randomTopping);
      }
    }

    // Random quantity (1-3 pizzas)
    const quantity = Math.floor(Math.random() * 3) + 1;

    // Calculate price for random order
    const price = calculatePrice(size, selectedToppings.length, quantity);

    return {
      userId,
      size,
      crust,
      toppings: selectedToppings,
      quantity,
      price,
      method: 'Online', // Example method
    };
  };

  // Function to ensure the new order is different from the last one
  const handleSurpriseMe = async () => {
    let newOrder = generateRandomOrder();

    // Ensure the new order is different from the last one
    while (JSON.stringify(newOrder) === JSON.stringify(lastOrder)) {
      newOrder = generateRandomOrder(); // Regenerate if it matches the last order
    }

    // Update the last order and add the new order to the cart
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error('Failed to add random order to cart');
      
      const order = await response.json();
      const updatedCartItems = [...cartItems, order];

      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

      // Update the state
      setCartItems(updatedCartItems);
      setLastOrder(newOrder); // Update the last order state
      alert('Random pizza added to cart!');
    } catch (error) {
      console.error('Error adding random order to cart:', error);
      alert('Failed to add random order to cart');
    }
  };

  return (
    <div className="homepage home-page-background">
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="/homepage">
            <img src={logo} alt="Pizza Steve Logo" className="navbar-img" />
            Pizza Steve
          </a>
        </div>
        <div className="nav-links">
          <a href="/homepage">Home</a>
          <a href="/cart">Cart ({cartItems.length})</a>
          <a href="/account">Account</a>
          <a href="/">Logout</a>
        </div>
      </nav>

      <header>
        <h2>Quick Options</h2>
      </header>

      <div className="quick-options">
        <div className="option">
          <img src={newOrderImage} alt="New Order" />
          <h3>New Order</h3>
          <p>Go to a new order page to build a pizza from scratch.</p>
          <button onClick={() => window.location.href = '/pizzacraft'}>New Order</button>
        </div>

        <div className="option">
          <img src={favoriteImage} alt="Reorder My Fave" />
          <h3>Re-order My Fave</h3>
          <p>Let the user save their favorite pizza to their account.</p>
          <button onClick={handleReorderFavorite}>Re-order My Fave</button>
        </div>

        <div className="option">
          <img src={surpriseMeImage} alt="Surprise Me" />
          <h3>Surprise Me</h3>
          <p>Craft a random pizza.</p>
          <button onClick={handleSurpriseMe}>Surprise Me</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
