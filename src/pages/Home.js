import React, { useState, useEffect } from 'react';
import './Home.css';
import { Cart } from '../components/Cart';
import Header from '../components/Header';

function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://117.72.72.114:9000/api/v1/home/category/head');
        if (response.ok) {
          const data = await response.json();
          if (data.code === '200') {
            setCategories(data.result);
          } else {
            setError(data.msg || '获取分类失败');
          }
        } else {
          setError('获取分类失败');
        }
      } catch (err) {
        console.error('Fetch categories error:', err);
        setError('网络错误，请稍后重试');
      }
    };

    fetchCategories();
  }, []);

  // 分类图标映射
  const categoryIcons = {
    '教材书籍': 'fas fa-book',
    '电子产品': 'fas fa-laptop',
    '服装饰品': 'fas fa-tshirt',
    '运动器材': 'fas fa-bicycle',
    '生活用品': 'fas fa-home',
    // 可以根据需要添加更多映射
  };

  return (
    <>
      <Header />
      <main className="main">
        <section className="hero-section">
          <h1 className="hero-title">发现校园好物，让闲置焕发价值</h1>
          <div className="search-box">
            <input type="text" className="search-input" placeholder="搜索你想要的商品..." />
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        <div className="category-list">
          {categories.map(category => (
            <div key={category.id} className="category-item">
              <i className={categoryIcons[category.name] || 'fas fa-tag'}></i>
              <span>{category.name}</span>
            </div>
          ))}
        </div>

        <div className="product-grid">
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=280&h=200" 
                 className="product-image" 
                 alt="高等数学教材" />
            <div className="product-info">
              <h3 className="product-title">高等数学第七版教材</h3>
              <div className="product-meta">
                <div className="product-price">¥25</div>
                <div className="product-seller">计算机学院 · 张同学</div>
              </div>
            </div>
          </div>
          
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=280&h=200" 
                 className="product-image" 
                 alt="蓝牙耳机" />
            <div className="product-info">
              <h3 className="product-title">小米蓝牙耳机 Pro</h3>
              <div className="product-meta">
                <div className="product-price">¥159</div>
                <div className="product-seller">信息学院 · 孙同学</div>
              </div>
            </div>
          </div>
          
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=280&h=200" 
                 className="product-image" 
                 alt="LED台灯" />
            <div className="product-info">
              <h3 className="product-title">LED护眼台灯</h3>
              <div className="product-meta">
                <div className="product-price">¥45</div>
                <div className="product-seller">机械学院 · 陈同学</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于我们</h3>
            <p>校园二手交易平台致力于为大学生提供便捷、安全的二手物品交易服务。</p>
          </div>
          <div className="footer-section">
            <h3>联系方式</h3>
            <p>邮箱：contact@example.com</p>
            <p>电话：123-456-7890</p>
          </div>
          <div className="footer-section">
            <h3>关注我们</h3>
            <div className="social-links">
              <a href="/"><i className="fab fa-weixin"></i></a>
              <a href="/"><i className="fab fa-weibo"></i></a>
              <a href="/"><i className="fab fa-qq"></i></a>
            </div>
          </div>
        </div>
      </footer>

      {/* 添加购物车组件 */}
      <Cart />
    </>
  );
}

export default Home; 