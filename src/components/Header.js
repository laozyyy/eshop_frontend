import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartIcon } from './CartIcon';
import { useUser } from '../contexts/UserContext';
import './Header.css'; // 如果需要样式

function Header() {
  const { user } = useUser();
  const location = useLocation();

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-exchange-alt"></i>
          校园二手市场
        </Link>
        <div className="nav-menu">
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'nav-item-active' : ''}`}
            style={{ fontWeight: 600 }}
          >
            首页
          </Link>
          <Link
            to="/categories"
            className={`nav-item ${location.pathname === '/categories' ? 'nav-item-active' : ''}`}
            style={{ fontWeight: 600 }}
          >
            分类
          </Link>
          <Link
            to="/activities"
            className={`nav-item nav-item-primary ${location.pathname === '/activities' ? 'nav-item-active' : ''}`}
            style={{ fontWeight: 600 }}
          >
            活动
          </Link>
          {localStorage.getItem('uid') && (
            <Link
            to="/chat"
            className={`nav-item ${location.pathname === '/chat' ? 'nav-item-active' : ''}`}
            style={{ fontWeight: 600 }}
          >
            消息
          </Link>
          )}
          <div className="nav-item">
            <CartIcon />
          </div>
          {localStorage.getItem('uid') ? (
            <Link to="/profile">
              <img src={user?.avatar} alt="用户头像" className="user-avatar" />
            </Link>
          ) : (
            <Link
              to="/login"
              className={`nav-item ${location.pathname === '/login' ? 'nav-item-active' : ''}`}
            >
              登录/注册
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;