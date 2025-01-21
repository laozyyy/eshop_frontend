import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const baseUrl = 'http://117.72.72.114:9000';

    if (isLoginMode) {
      // 登录逻辑
      try {
        const response = await fetch(`${baseUrl}/api/v1/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('userToken', data.uid);
          navigate('/');
        } else {
          const errorData = await response.json();
          setError(errorData.message || '登录失败，请检查用户名和密码');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('网络错误，请稍后重试');
      }
    } else {
      // 注册逻辑
      if (formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/v1/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            password: formData.password,
          }),
        });

        if (response.ok) {
          setIsLoginMode(true);
          setError('注册成功，请登录');
          setFormData(prev => ({
            ...prev,
            confirmPassword: ''
          }));
        } else {
          const errorData = await response.json();
          setError(errorData.message || '注册失败，请稍后重试');
        }
      } catch (err) {
        console.error('Register error:', err);
        setError('网络错误，请稍后重试');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <i className="fas fa-exchange-alt"></i>
          <h2>校园二手市场</h2>
        </div>

        <div className="tabs">
          <div 
            className={`tab ${isLoginMode ? 'active' : ''}`} 
            onClick={() => setIsLoginMode(true)}
          >
            登录
          </div>
          <div 
            className={`tab ${!isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            注册
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <i className="fas fa-user input-icon"></i>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="请输入学号"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <i className="fas fa-lock input-icon"></i>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="请输入密码"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {!isLoginMode && (
            <div className="form-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isLoginMode ? '登录' : '注册'}
          </button>
        </form>

        {isLoginMode && (
          <div className="form-footer">
            <button 
              onClick={() => navigate('/forgot-password')} 
              className="forgot-password-btn"
            >
              忘记密码？
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login; 