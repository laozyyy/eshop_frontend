import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import CartPage from './pages/CartPage';
import UserProfile from './pages/UserProfile';
import { CartProvider } from './contexts/CartContext';
import './App.css';
import ProductDetail from './pages/ProductDetail';
import SearchResultsPage from './pages/SearchResultsPage';
import Activities from './pages/Activities';
import Checkout from './pages/Checkout';
import ChatPage from './pages/Chat';

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
          <Route path="/product/:sku" element={<ProductDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/search-result" element={<SearchResultsPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
