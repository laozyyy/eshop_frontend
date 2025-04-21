import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import './ProductDetail.css';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
// 在顶部导入useUser
import { useUser } from '../contexts/UserContext';
import Popup from '../components/Popup';

function ProductDetail() {
  // 新增状态声明
  const [randomSales, setRandomSales] = useState(0);
  const [randomReviews, setRandomReviews] = useState(0);
  const [product, setProduct] = useState({});
  const [error, setError] = useState('');
  // 添加弹窗状态 ↓
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  // 添加弹窗状态 ↑

  const sku = window.location.pathname.split('/').pop();
  const { user } = useUser();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        
        const response = await fetch(`http://117.72.72.114:9000/api/v1/main/get_sku/${sku}`);
        if (response.ok) {
          const data = await response.json();
          if (data.info === 'success') {
            setProduct(data.data);
            // 初始化随机数
            setRandomSales(Math.floor(Math.random() * 500) + 100);
            setRandomReviews(Math.floor(Math.random() * 2000));
            setError('');
          }
        }
      } catch (err) {
        console.error('Fetch product error:', err);
        setError('网络错误，请稍后重试');
      }
    };

    fetchProduct();
  }, [sku]);
  // 新增状态管理
  
  
  // 加入购物车处理函数
  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://117.72.72.114:9000/api/v1/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sku_id: sku, // 假设商品ID字段是GoodsId
          quantity: quantity,
          uid: localStorage.getItem('uid') // 根据上下文获取用户ID
        })
      });

      const data = await response.json();
      if (data.info === 'success') {
        setPopupMessage('商品已成功加入购物车');
        setShowPopup(true);  
        // window.location.href = '/product/' + sku;
      } else {
        alert('添加失败: ' + data.msg);
      }
    } catch (error) {
      console.error('添加购物车失败:', error);
      alert('网络错误，请稍后重试');
    }
  };

  return (
    <>
      <Header />
      {/* 在页面底部添加Popup组件 */}
      // 修改Popup组件的调用
      <Popup 
        isVisible={showPopup}
        onClose={() => {
          setShowPopup(false);
          window.location.reload();  // 直接刷新当前页面
        }}
        message={popupMessage}
      />
      <main className="main">
      <div className="product-large-card">
        {/* 左边图片容器 */}
        <div className="product-image">
          <img src={product.ShowPic || 'default-image-url'} alt="Product" />
        </div>
        {/* 右边商品信息 */}
        <div className="product-info">
          <div><span className='product-name'>{product.Name}</span></div>
          <div className="price-container">
            <span className="product-price-left"> 价格：￥</span>
            <span className="product-price"> {product.Price}</span>
          </div>
          
          {/* 新增信息行 */}
          <div className="info-row">
            <span>月销量 {randomSales}+</span>
            <span>评价 {randomReviews}</span>
            <span>购买可得{(product.Price * 0.1).toFixed(0)}积分</span>
          </div>

          {/* 规格选择 */}
          <div className="spec-selector">
            <select>
              <option>选择规格</option>
              <option>标准版</option>
              <option>豪华版</option>
            </select>
          </div>

          {/* 购买数量 */}
          <div className="quantity-selector">
            <span>数量：</span>
            <button onClick={(e) => {
              e.preventDefault();
              const input = e.target.nextElementSibling;
              if (input.value > 1) input.value = parseInt(input.value) - 1;
              setQuantity(prev => Math.max(1, prev - 1))
            }}>-</button>
            <input 
              type="number" 
              defaultValue="1" 
              min="1" 
              step="1"
              className="quantity-input"
              // onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button onClick={(e) => {
              e.preventDefault();
              const input = e.target.previousElementSibling;
              input.value = parseInt(input.value) + 1;
              setQuantity(prev => prev + 1)
            }}>+</button>
          </div>

  
          <button className="add-to-cart" onClick={handleAddToCart}>
            加入购物车
          </button>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}

export default ProductDetail;