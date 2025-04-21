import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from './Cart';
import { useCart } from '../contexts/CartContext';
import '../styles/CartIcon.css';

export function CartIcon() {
  const { cartItems, refreshCart } = useCart();
  // 在reduce前添加空值判断
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const itemCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
  
  const handleMouseEnter = () => {
    setShowCart(true);
  };

  const handleMouseLeave = () => {
    setShowCart(false);
  };
  
  const handleCartClick = () => {
    window.location.href = '/cart'; // 强制刷新页面
  };

  return (
    <div 
      className="cart-icon-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="cart-icon"
        onClick={handleCartClick}  // 使用新的点击处理器
        title="点击查看购物车页面"
      >
        <i className="fas fa-shopping-cart"></i>
        {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
      </div>
      {showCart && <Cart isFloating={true} />}
    </div>
  );
}