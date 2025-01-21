import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../components/Cart';
import Header from '../components/Header';
import '../styles/CartPage.css';

export function CartPage() {
  const navigate = useNavigate();

  return (
    <div className="cart-page-container">
      <Header />
      <main className="cart-page">
        <div className="cart-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> 返回
          </button>
          <h1>我的购物车</h1>
        </div>
        <div className="cart-page-content">
          <Cart isFloating={false} />
        </div>
      </main>
    </div>
  );
}

export default CartPage; 