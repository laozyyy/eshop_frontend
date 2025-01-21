import React from 'react';
import { Link } from 'react-router-dom';
import { CartIcon } from './CartIcon';
import { useUser } from '../contexts/UserContext';
import './Header.css'; // 如果需要样式

function Header() {
  const { userAvatar } = useUser();

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          <i className="fas fa-exchange-alt"></i>
          校园二手市场
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-item">首页</Link>
          <Link to="/categories" className="nav-item">分类</Link>
          <Link to="/publish" className="nav-item">发布</Link>
          <Link to="/messages" className="nav-item">消息</Link>
          <div className="nav-item">
            <CartIcon />
          </div>
          {userAvatar ? (
            <Link to="/profile">
              <img src={userAvatar} alt="用户头像" className="user-avatar" />
            </Link>
          ) : (
            <Link to="/login" className="nav-item">登录/注册</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header; 