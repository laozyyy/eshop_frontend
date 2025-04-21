import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Popup  from '../components/Popup';
import ProductCard from '../components/ProductCard';
import './Activities.css';

function Activities() {
  // 复用 Popup 组件状态
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  // 新增商品数据状态
  const [lotteryProducts, setLotteryProducts] = useState([]);
  const [seckillProducts, setSeckillProducts] = useState([]);
  
  
  // 秒杀倒计时状态
  const [seckillTime, setSeckillTime] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });

  // 抽奖奖品列表（复用商品卡片样式）
  const [prizes] = useState([
    { id: 1, name: '50元优惠券', image: 'coupon.jpg' },
    { id: 2, name: '蓝牙耳机', image: 'earphone.jpg' },
    { id: 3, name: '谢谢参与', image: 'thanks.jpg' }
  ]);

  useEffect(() => {
    
    // 新增商品获取逻辑
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://117.72.72.114:9000/api/v1/main/random', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_num: 1,
            page_size: 9 // 获取9个商品，6个用于抽奖，3个用于秒杀
          })
        });
        const data = await response.json();
        if (data.data) {
          setLotteryProducts(data.data.slice(0, 4));
          console.log(data)
          setSeckillProducts(data.data.slice(5, 9));
        }
      } catch (error) {
        console.error('获取商品失败:', error);
      }
    };
  
    fetchProducts();
    // 秒杀倒计时逻辑（复用首页商品加载逻辑）
    const timer = setInterval(() => {
      setSeckillTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // 抽奖逻辑（复用商品详情页的弹窗逻辑）
  const handleLottery = () => {
    const result = prizes[Math.floor(Math.random() * prizes.length)];
    setPopupMessage(`恭喜获得：${result.name}`);
    setShowPopup(true);
  };

  // 在抽奖逻辑下方添加秒杀处理方法
  const handleSeckill = async (sku) => {
    try {
      const uid = localStorage.getItem('uid');
      const response = await fetch('http://117.72.72.114:9000/api/v1/activity/seckill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid,
          sku: sku,
          activity_id: "testsec"
        })
      });
      
      const result = await response.json();
      
      if (result.info === "success") {
        setPopupMessage(`秒杀成功！订单号：${result.order_id}`);
      } else {
        setPopupMessage('秒杀失败：' + (result.info || '未知错误'));
      }
      setShowPopup(true);
    } catch (error) {
      console.error('秒杀请求失败:', error);
      setPopupMessage('网络请求异常，请稍后重试');
      setShowPopup(true);
    }
  };
  
  // 在原有return语句前添加错误处理逻辑
  if (!localStorage.getItem('uid')) {
    return <div className="error-message">请先登录再参与活动</div>;
  }
  return (
    <div className="activities-container">
      <Header />
      <main className="main">
        

        
        
        {/* 秒杀模块 - 复用首页商品展示逻辑 */}
        <section className="seckill-section">
          <div className="seckill-header">
            <h2>限时秒杀</h2>
            {/* <div className="countdown">
              剩余时间: {seckillTime.hours}:{seckillTime.minutes}:{seckillTime.seconds}
            </div> */}
          </div>
          <div className="product-grid">
            
            {/* 复用首页的商品卡片组件 */}
            {seckillProducts.map(product => {
              // 生成一个 1 到 10 之间的随机数，可根据需求调整范围
              const randomNum = Math.floor(Math.random() * 10) + 1; 
              const adjustedMinutes = seckillTime.minutes - randomNum;
              const adjustedTime = {
                ...seckillTime,
                minutes: adjustedMinutes < 0 ? 0 : adjustedMinutes
              };
              return (
                <div key={product.goods_id} className="seckill-item">
                  <ProductCard product={product} />
                  <div className="countdown">
                    剩余时间: {adjustedTime.hours.toString().padStart(2, '0')}:{adjustedTime.minutes.toString().padStart(2, '0')}:{adjustedTime.seconds.toString().padStart(2, '0')}
                  </div>
                  <button 
                    className="seckill-btn" 
                    onClick={() => handleSeckill(product.Sku)}
                  >
                    立即抢购
                  </button>
                </div>
              );
            })}
          </div>
        </section>
        {/* 抽奖模块 - 复用商品卡片布局 */}
        <section className="seckill-section">
          <h2>幸运大转盘</h2>
          <div className="product-grid">
          {lotteryProducts.map(product => (
            <ProductCard key={product.goods_id} product={product} isLottery={true}/>
          ))}
          </div>
          <button 
            className="submit-btn" 
            onClick={handleLottery}
            style={{ marginTop: '20px' }}>
            立即抽奖
          </button>
        </section>
      </main>
      <Footer />
      <Popup 
        isVisible={showPopup}
        onClose={() => setShowPopup(false)}
        message={popupMessage}
      />
    </div>
  );
}
export default Activities;