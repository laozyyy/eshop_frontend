import React from 'react';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const { userAvatar } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("您确定要登出吗？");
    if (confirmLogout) {
      localStorage.removeItem('userToken'); // 清除用户令牌
      localStorage.removeItem('userName'); // 清除用户名
      localStorage.removeItem('userEmail'); // 清除用户邮箱
      localStorage.removeItem('userAvatar'); // 清除用户头像
      window.location.reload(); // 强制刷新页面
    }
  };

  return (
    <div>
      <Header />
      <div className="user-profile-container">
        <div className="user-profile-content">
          {userAvatar && <img src={userAvatar} alt="用户头像" className="user-avatar-profile" />}
          <h1 className="user-profile-title">用户个人信息</h1>
          <div className="user-info">
            <h2>用户名: {localStorage.getItem('userName') || '未设置'}</h2>
            <p>邮箱: {localStorage.getItem('userEmail') || '未设置'}</p>
            {/* 其他用户信息可以在这里显示 */}
          </div>
          <button className="logout-button" onClick={handleLogout}>登出</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 