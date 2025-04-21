import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import '../styles/Cart.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';

export function Cart({ isFloating = true }) {
  const { cartItems, updateQuantity } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  // 新增选中状态
  const [selectedItems, setSelectedItems] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteSku, setDeleteSku] = useState(null);

  // 处理复选框变化
  // 在顶部添加新的状态
  const [total, setTotal] = useState(0); // 初始化为0

  // 新增监听购物车数据的effect
  useEffect(() => {
    if (cartItems.length > 0 && cartItems[0]?.all_price) {
      setTotal(parseFloat(cartItems[0].all_price));
    }
    // 初始化时同步已选中的商品
  const initialSelected = cartItems
  .filter(item => item.selected)
  .map(item => item.Sku);
setSelectedItems(prev => [...new Set([...prev, ...initialSelected])]);
  }, [cartItems]); // 当cartItems更新时重新计算

  // 修改handleSelect方法
  const handleSelect = async (sku, checked, newQuantity) => {
    setSelectedItems(prev => {
      if (checked) {
        // 添加选中项：创建新数组包含原有项+新SKU
        return [...prev, sku];
      } else {
        // 移除取消项：过滤掉当前SKU
        return prev.filter(item => item !== sku);
      }
    });

    // 调用接口更新选中状态
    const item = cartItems.find(i => i.Sku === sku);
    if (item) {
      try {
        const response = await fetch('http://117.72.72.114:9000/api/v1/cart/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: localStorage.getItem('uid'), // 从本地存储获取用户ID
            quantity: newQuantity || item.quantity, // 优先使用传入的新数量
            selected: checked,
            sku: sku
          })
        });

        const result = await response.json();
        if (result.info === "success") {
          setTotal(parseFloat(result.price));
        }
      } catch (error) {
        console.error('价格更新失败:', error);
      }
    }
  };

  // 修改减少按钮点击逻辑
  const handleDecrease = (sku, quantity) => {
    if (quantity === 1) {
      setDeleteSku(sku);
      setPopupMessage('确定要删除该商品吗？');
      setShowDeletePopup(true);
    } else {
      updateQuantity(sku, quantity - 1);
      // updateQuantity(sku, Math.max(1, quantity - 1));

    }
  };
  // 新增删除商品方法
  const handleDeleteItem = async () => {
    try {
      const response = await fetch('http://117.72.72.114:9000/api/v1/cart/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: localStorage.getItem('uid'),
          skus: [deleteSku]
        })
      });

      const result = await response.json();
      if (result.info === "success") {
        updateQuantity(deleteSku, 0); // 通过设置数量为0触发移除
        setSelectedItems(prev => prev.filter(sku => sku !== deleteSku));
      }
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      setShowDeletePopup(false);
    }
  };

  // 结算跳转逻辑
  const navigate = useNavigate();
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      // alert('请至少选择一件商品');
      setPopupMessage('请至少选择一件商品');
      setShowPopup(true);
      return;
    }
    navigate('/checkout', {
      state: {
        items: cartItems.filter(item => selectedItems.includes(item.Sku))
      }
    });
  };

  // 添加加载状态判断
  if (cartItems === null) {
    return <div className="loading">加载中...</div>;
  }


  // 渲染商品项的规格信息
  const renderSpecInfo = (spec) => {
    try {
      const specObj = JSON.parse(spec);
      return Object.entries(specObj).map(([key, value]) => (
        <span key={key} className="spec-item">{key}: {value}</span>
      ));
    } catch {
      return <span>{spec}</span>;
    }
  };
  const handleFirstCheckout = (e, isSelected) => {
    const sku = e.target.dataset.sku;
    // 当初始化选中状态与当前状态不一致时触发更新
    if (isSelected !== e.target.checked) {
      handleSelect(sku, e.target.checked);
    }
  };
  if (isFloating && cartItems.length === 0) {
    return null;
  }

  const cartContent = (
    <>
      <h2>购物车</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>购物车还是空的</p>
          <Link to="/" className="back-to-shop">
            去逛逛
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.Sku} className="cart-item">
              <input
                type="checkbox"
                checked={item.selected}
                data-sku={item.Sku}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  // 同步本地状态
                  item.selected = isChecked;
                  // 更新选中列表
                  handleSelect(item.Sku, isChecked, item.quantity);
                  // setSelectedItems(prev =>
                  //   isChecked
                  //     ? [...prev, item.Sku]
                  //     : prev.filter(sku => sku !== item.Sku)
                  // );
                }}
                className="cart-checkbox"
                style={{ transform: 'scale(0.8)' }}
              />
              <img src={item.ShowPic} alt={item.Name} />
              <div className="cart-item-info">
                <h3>{item.Name}</h3>
                <div className="price-quantity">
                  <p>价格: ¥{item.Price}</p>
                  <div className="cart-quantity-controls">
                    <button
                      className="cart-quantity-btn"
                      onClick={() => {
                        const newQuantity = Math.max(1, item.quantity - 1);
                        handleDecrease(item.Sku, item.quantity);
                        if (selectedItems.includes(item.Sku)) {
                          handleSelect(item.Sku, true, newQuantity);
                        }
                      }}
                    >-</button>

                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      className="cart-quantity-input"
                      // 修改输入框
                      onChange={(e) => {
                        const newQty = Math.max(1, parseInt(e.target.value) || 1);
                        updateQuantity(item.Sku, newQty);
                        if (selectedItems.includes(item.Sku)) {
                          handleSelect(item.Sku, true, newQty);
                        }
                      }}
                    />

                    <button
                      className="cart-quantity-btn"
                      onClick={() => {
                        const newQuantity = item.quantity + 1;
                        updateQuantity(item.Sku, newQuantity);
                        if (selectedItems.includes(item.Sku)) {
                          handleSelect(item.Sku, true, newQuantity); // 传入更新后的数量
                        }
                      }}
                    >+</button>
                  </div>
                </div>
                <div className="spec-info">
                  {renderSpecInfo(item.Spec)}
                </div>
                {/* 操作控件保持不变 */}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );

  return isFloating ? (
    <div className="cart floating">
      {cartContent}
    </div>
  ) : (

    <div className="cart">
      <Popup
        isVisible={showPopup}
        onClose={() => {
          setShowPopup(false);
          window.location.reload();  // 直接刷新当前页面
        }}
        message={popupMessage}
        isWrong={true}
      />
      <Popup
        isVisible={showDeletePopup}
        onClose={() => {
          handleDeleteItem();
          setShowDeletePopup(false);
          window.location.reload();  // 直接刷新当前页面
        }}
        message={popupMessage}
        isWrong={true}
      />
      {cartContent}
      {/* 修改结算按钮
      <div className="cart-total">
        <h3>总计: ¥{total.toFixed(2)}</h3>
        <button onClick={handleCheckout}>结算 ({selectedItems.length})</button>
      </div> */}
      <div className="cart-total">
        <h3>总计: ¥{total.toFixed(2)}</h3>
        <button onClick={handleCheckout}>结算 ({selectedItems.length})</button>
      </div>
    </div>
  );
}