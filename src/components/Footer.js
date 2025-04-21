// 以下是一个简单的 React 组件模板
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于我们</h3>
            <p>校园二手交易平台致力于为大学生提供便捷、安全的二手物品交易服务。</p>
          </div>
          {/* <div className="footer-section">
            <h3>联系方式</h3>
            <p>邮箱：contact@example.com</p>
            <p>电话：123-456-7890</p>
          </div> */}
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
  );
};

export default Footer;
