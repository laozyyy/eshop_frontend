import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const [userData, setUserData] = useState(null); // 新增用户数据状态
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const uid = localStorage.getItem('uid');
            if (!uid) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://117.72.72.114:9000/api/v1/user/get/${uid}`);
                const { code, info, user } = await response.json();
                
                if (info === "success") {
                    setUserData(user);
                } else {
                    setError('获取用户信息失败: ' + info);
                }
            } catch (err) {
                setError('网络请求异常: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("您确定要登出吗？");
        if (confirmLogout) {
            localStorage.removeItem('userToken'); 
            localStorage.removeItem('uid'); 
            localStorage.removeItem('cart'); 
            navigate('/');
            window.location.reload(); 
        }
    };

    // 新增角色类型转换
    const getRoleName = (role) => {
        const roles = {
            '-1': '买家',
            '2': '卖家',
            '3': '管理员'
        };
        return roles[role] || '未知角色';
    };

    return (
        <div>
            <Header />
            <div className="user-profile-container">
                <div className="user-profile-content">
                    <h1 className="user-profile-title">用户个人信息</h1>
                    
                    {loading ? (
                        <div className="loading">加载中...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <div className="user-info">
                            <h2>用户名: {userData.name}</h2>
                            <p>电子邮箱: {userData.email || '未设置'}</p>
                            <p>手机号码: {userData.phone || '未设置'}</p>
                        </div>
                    )}
                    
                    <button className="logout-button" onClick={handleLogout}>登出</button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;