import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const location = useLocation();
  const { items = [] } = location.state || {};

  // 计算总价
  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.Price / 10) * item.quantity;
  }, 0);

  return (
    <div className="checkout-container">
      <Header />
      <main className="checkout-main">
        <div className="checkout-card"> {/* 新增卡片容器 */}
          <h2>订单结算 ({items.length}件商品)</h2>
          <div className="checkout-items">
            {items.map(item => (
              <div key={item.Sku} className="checkout-item">
                <img src={item.ShowPic} alt={item.Name} />
                <h3>{item.Name}</h3>
                <p>¥{item.Price / 10} x {item.quantity}</p>
              </div>
            ))}
          </div>
          {/* 显示总价 */}
          <div className="checkout-total">
            <h3>总价: <span>¥{totalPrice.toFixed(2)}</span></h3>
          </div>
          <button className="submit-btn">提交订单</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;