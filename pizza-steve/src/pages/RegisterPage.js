import React, { useState } from 'react';
import '../styles/RegisterPage.css';
import logo from '../assets/pngwing.com.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    adress: '', // Changed from 'address' to 'adress'
    city: '',
    state: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const tunisianStates = [
    'Ariana', 'Beja', 'Ben Arous', 'Bizerte', 'Gabes', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kebili', 'Kef', 'Mahdia', 'Manouba', 'Medenine',
    'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    // Check if fields are filled
    if (!formData.firstname) validationErrors.firstname = "First name is required";
    if (!formData.lastname) validationErrors.lastname = "Last name is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.adress) validationErrors.adress = "Address is required"; // validation for 'adress'
    if (!formData.city) validationErrors.city = "City is required";
    if (!formData.state) validationErrors.state = "State is required";
    if (!formData.password) validationErrors.password = "Password is required";
    if (!formData.confirmPassword) validationErrors.confirmPassword = "Confirm password is required";
    if (formData.password !== formData.confirmPassword) {
      validationErrors.passwordMismatch = "Passwords do not match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage('Registration successful!');
        console.log('User registered:', result);
        // Optionally, redirect to login page after success
        // window.location.href = '/login';
      } else {
        const errorData = await response.json();
        console.error('Error registering user:', errorData);
        setErrors({ server: 'Registration failed, please try again.' });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setErrors({ server: 'Registration failed, please try again.' });
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="/">
            <img src={logo} alt="Pizza Steve Logo" className="navbar-img" />
            Pizza Steve
          </a>
        </div>
        <ul className="navbar-links">
          <li>
            <a href="/register">Register</a>
          </li>
          <li>
            <a href="/">Login</a>
          </li>
        </ul>
      </nav>

      <div className="signup-container">
        <div className="form-section">
          <div className="logo">Register</div>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
              />
              {errors.firstname && <span className="error">{errors.firstname}</span>}
              
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
              />
              {errors.lastname && <span className="error">{errors.lastname}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="adress"
                placeholder="Address"
                value={formData.adress}
                onChange={handleChange}
              />
              {errors.adress && <span className="error">{errors.adress}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && <span className="error">{errors.city}</span>}

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="" disabled>Select State</option>
                {tunisianStates.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <span className="error">{errors.state}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              {errors.passwordMismatch && <span className="error">{errors.passwordMismatch}</span>}
            </div>

            <button type="submit" className="signup-button">Sign Up</button>
            {errors.server && <div className="error">{errors.server}</div>}
          </form>

          {successMessage && <div className="success">{successMessage}</div>}

          <div className="login-link">
            Already have an account? <a href="/">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
