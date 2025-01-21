import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    newPassword: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: 输入学号, 2: 输入验证码和新密码

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendCode = async () => {
    if (!formData.name) {
      setError('请输入学号');
      return;
    }

    try {
      const response = await fetch('http://117.72.72.114:9000/api/v1/user/forgot-password/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name
        })
      });

      if (response.ok) {
        setStep(2);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '发送验证码失败');
      }
    } catch (err) {
      console.error('Send code error:', err);
      setError('网络错误，请稍后重试');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      const response = await fetch('http://117.72.72.114:9000/api/v1/user/forgot-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          newPassword: formData.newPassword,
          verificationCode: formData.verificationCode
        })
      });

      if (response.ok) {
        // 重置成功，返回登录页
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '重置密码失败');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('网络错误，请稍后重试');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="logo">
          <i className="fas fa-exchange-alt"></i>
          <h2>重置密码</h2>
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
              disabled={step === 2}
            />
          </div>

          {step === 1 ? (
            <button type="button" className="submit-btn" onClick={handleSendCode}>
              发送验证码
            </button>
          ) : (
            <>
              <div className="form-group">
                <i className="fas fa-key input-icon"></i>
                <input
                  type="text"
                  name="verificationCode"
                  className="form-input"
                  placeholder="请输入验证码"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  name="newPassword"
                  className="form-input"
                  placeholder="请输入新密码"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="请确认新密码"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="submit-btn">
                重置密码
              </button>
            </>
          )}
        </form>

        <div className="form-footer">
          <button onClick={() => navigate('/login')} className="back-btn">
            返回登录
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 