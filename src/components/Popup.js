import React, { useEffect } from 'react';
import './Popup.css';

function Popup({ isVisible, onClose, message, isWrong = false }) {
  useEffect(() => {
    if (isVisible) {
        // 移除以下自动关闭的定时器逻辑
        // const timer = setTimeout(onClose, 1000);
        // return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]); // 可以保留依赖数组，实际已不需要
  
  if (!isVisible) return null;

  const iconClass = isWrong ? 'fas fa-times-circle popup-icon-wrong' : 'fas fa-check-circle popup-icon';
  const popupClass = isWrong ? 'popup-container fade-in' : 'popup-container fade-in';

  return (
    <div className={popupClass}>
      <div className="popup-content">
        <i className={iconClass}></i>
        <p className="popup-message">{message}</p>
        <button className="popup-close" onClick={onClose}>
          确定
        </button>
      </div>
    </div>
  );
}

export default Popup;