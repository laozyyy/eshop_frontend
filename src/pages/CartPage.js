import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../components/Cart';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import '../styles/CartPage.css';

export function CartPage() {

  return (
    <div className="cart-page-container">
      <Header />
      <main className="cart-page">
        <div className="cart-page-content">
          <Cart isFloating={false} />
        </div>
      </main>
    </div>
  );
}

export default CartPage;