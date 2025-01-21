import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import CartPage from './pages/CartPage';
import UserProfile from './pages/UserProfile';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
