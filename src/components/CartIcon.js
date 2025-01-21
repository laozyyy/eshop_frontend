import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from './Cart';
import { useCart } from '../contexts/CartContext';
import '../styles/CartIcon.css';

export function CartIcon() {
  const { cartItems } = useCart();
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleMouseEnter = () => {
    setShowCart(true);
  };

  const handleMouseLeave = () => {
    setShowCart(false);
  };
  
  return (
    <div 
      className="cart-icon-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="cart-icon"
        onClick={() => navigate('/cart')}
        title="点击查看购物车页面"
      >
        <i className="fas fa-shopping-cart"></i>
        {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
      </div>
      {showCart && <Cart isFloating={true} />}
    </div>
  );
} 