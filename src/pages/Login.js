import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useUser } from '../contexts/UserContext';


function Login() {
  const baseUrl = 'http://117.72.72.114:9000';
  const navigate = useNavigate();
  const { userAvatar, updateAvatar } = useUser(); // 将 useUser 调用移到组件顶层
  const [isLoginMode, setIsLoginMode] = useState(true);
  // 在组件顶部新增状态
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const jcapRef = useRef(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 新增验证码初始化逻辑
  useEffect(() => {
    const initCaptcha = () => {
      const option = {
        sessionId: '',
        appId: 1835522847, // 从京东云控制台获取实际ID
        onSuccess: (ret) => {
          if (ret.code === 0) {
            setVerifyToken(ret.vt);
            setCaptchaVerified(true);
          }
        },
        onFailure: (ret) => {
          console.error('验证码错误:', ret.msg);
          setCaptchaVerified(false);
        }
      };
  
      if (window.captchaLoadJS) {
        window.captchaLoadJS(option, (obj) => {
          jcapRef.current = obj;
        });
      }
    };
  
    if (!window.Jcap) {
      const script = document.createElement('script');
      script.src = "https://captcha-api-global.jdcloud.com/home/requireCaptcha.js";
      script.onload = initCaptcha;
      document.body.appendChild(script);
    } else {
      initCaptcha();
    }
  }, []);
  
  // 修改注册表单字段
  const [formData, setFormData] = useState({
    name: '',
    phone: '', // 新增手机号字段
    password: '',
    confirmPassword: '',
    verificationCode: '' // 新增验证码字段
  });
  
  // 修改注册提交逻辑
  const handleRegister = async () => {
    if (!captchaVerified) {
      setError('请先完成验证码校验');
      return;
    }
    
    try {
      const response = await fetch(`${baseUrl}/api/v1/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          verifyToken
        })
      });
      // ...保持原有处理逻辑
    } catch (err) {
      // ...错误处理
    }
  };
  
  // 在注册表单中新增字段
  {!isLoginMode && (
    <>
      <div className="form-group">
        <i className="fas fa-mobile-alt input-icon"></i>
        <input
          type="tel"
          name="phone"
          className="form-input"
          placeholder="请输入手机号"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <i className="fas fa-sms input-icon"></i>
        <input
          type="text"
          name="verificationCode"
          className="form-input"
          placeholder="请输入短信验证码"
          value={formData.verificationCode}
          onChange={handleInputChange}
        />
        <button 
          type="button" 
          className="captcha-btn"
          onClick={() => jcapRef.current?.create()}
        >
          获取验证码
        </button>
      </div>
    </>
  )}
  

  // Modify all API calls to use baseUrl (example in handleSubmit)
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
        const data = await response.json();
        if (response.ok) {
          // 检查 info 字段是否为 "success"
          if (data.info === 'success') {
            localStorage.setItem('userToken', data.uid);
            updateAvatar(); 
            navigate('/');
          } else {
            setError('登录失败，请检查用户名和密码');
          }
        } else {
          setError(data.message || '登录失败，请检查用户名和密码');
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
        {!isLoginMode && (
            <></>)}
          <div className="form-group">
            <i className="fas fa-user input-icon"></i>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="请输入用户名"
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
            <>
            <div className="form-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="手机号码"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="验证码"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {/* 新增获取验证码按钮 */}
              <button 
                type="button" 
                className="captcha-btn"
                onClick={() => jcapRef.current?.create()}
              >
                获取验证码
              </button>
            </div>
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
            </div></>
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