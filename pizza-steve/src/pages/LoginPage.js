import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate after successful login
import '../styles/LoginPage.css';
import logo from '../assets/pngwing.com.png';
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null); // To handle login errors
  const navigate = useNavigate(); // To redirect after login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error message

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Login failed');
        return;
      }

      // On success, store the user data in localStorage or context
      localStorage.setItem('userId', result.userId); // Store user ID in localStorage
      localStorage.setItem('userName', result.firstname); // Store user name or other details

      // Navigate to the home page after successful login
      navigate('/homepage'); // Replace '/homepage' with your actual homepage route

    } catch (error) {
      console.error('Error logging in:', error);
      setError('Server error, please try again later.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="/">
          <img src={logo} alt="Pizza Steve Logo" className="navbar-img" />
            Pizza Steve
          </a>
        </div>
        <ul className="navbar-links">
          <li><a href="/register">Register</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

      {/* Login Form */}
      <div className="login-container">
        <div className="form-section">
          <div className="logo">Login</div>
          <form onSubmit={handleSubmit} className="login-form">
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
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">Login</button>
          </form>
          <div className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
