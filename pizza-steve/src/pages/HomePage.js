import React from 'react';
import '../styles/HomePage.css'; // Make sure this file has the updated CSS
import logo from '../assets/pngwing.com.png';

// Import images for option boxes
import newOrderImage from '../assets/shutterstock_594962792_94b9c79e519a4889a49d455415711911.jpeg'; // Replace with your actual path
import favoriteImage from '../assets/shutterstock_594962792_94b9c79e519a4889a49d455415711911.jpeg'; // Replace with your actual path
import surpriseMeImage from '../assets/shutterstock_594962792_94b9c79e519a4889a49d455415711911.jpeg'; // Replace with your actual path

function HomePage() {
  return (
    <div className="homepage home-page-background">  {/* Added class here */}
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
        <h2>Quick Options</h2>
      </header>

      <div className="quick-options">
        <div className="option">
          <img src={newOrderImage} alt="New Order" />
          <h3>New Order</h3>
          <p>Go to a new order page to build a pizza from scratch.</p>
          <button onClick={() => window.location.href = '/new-order'}>New Order</button>
        </div>

        <div className="option">
          <img src={favoriteImage} alt="Reorder My Fave" />
          <h3>Re-order My Fave</h3>
          <p>Let the user save their favorite pizza to their account.</p>
          <button onClick={() => window.location.href = '/reorder'}>Re-order My Fave</button>
        </div>

        <div className="option">
          <img src={surpriseMeImage} alt="Surprise Me" />
          <h3>Surprise Me</h3>
          <p>Build a random pizza.</p>
          <button onClick={() => window.location.href = '/surprise'}>Surprise Me</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
