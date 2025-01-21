import React from 'react';
import { useCart } from '../contexts/CartContext';
import '../styles/Cart.css';
import { Link } from 'react-router-dom';

export function Cart({ isFloating = true }) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((sum, item) => 
    sum + item.price * item.quantity, 0
  );

  if (isFloating && cartItems.length === 0) {
    return null;
  }

  const cartContent = (
    <>
      <h2>购物车</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>购物车还是空的</p>
          <Link to="/" className="back-to-shop">
            去逛逛
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>价格: ¥{item.price}</p>
                <div className="cart-item-controls">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  />
                  <button onClick={() => removeFromCart(item.id)}>
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>总计: ¥{total.toFixed(2)}</h3>
            <button>结算</button>
          </div>
        </>
      )}
    </>
  );

  return isFloating ? (
    <div className="cart floating">
      {cartContent}
    </div>
  ) : (
    <div className="cart">
      {cartContent}
    </div>
  );
} 