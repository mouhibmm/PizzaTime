import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CraftPizzaPage from './pages/CraftPizzaPage';
import AccountInfoPage from './pages/AccountInfoPage';
import CartPage from './pages/CartPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/pizzacraft" element={<CraftPizzaPage />} />
        <Route path="/account" element={<AccountInfoPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
