import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUser();
  // 明确初始化值为空数组
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const syncCart = async () => {
      try {
        if (user?.uid) {
          // 已登录同步远程数据逻辑...
        } else {
          // 确保本地存储读取失败时返回空数组
          const localCart = localStorage.getItem('cart') || '[]';
          setCartItems(JSON.parse(localCart));
        }
      } catch (error) {
        setCartItems([]);
      }
    };
    syncCart();
  }, [user?.uid]);

  // 修改本地存储同步逻辑
  useEffect(() => {
    if (cartItems !== null) { // 排除初始化null状态
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);
  const [selectedItems, setSelectedItems] = useState([]);
  // Remove this duplicate declaration
  // const { user } = useUser();
  // 同步本地存储
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (quantity < 1) return;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.goods_id === product.goods_id);
      if (existing) {
        return prev.map(item => item.goods_id === product.goods_id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
        );
      }
      return [...prev, { ...product, quantity, checked: true }];
    });
  };

  const updateQuantity = (Sku, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.Sku === Sku ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleItemCheck = (goodsId) => {
    setSelectedItems(prev =>
      prev.includes(goodsId)
        ? prev.filter(id => id !== goodsId)
        : [...prev, goodsId]
    );
  };


  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };


  const fetchRemoteCart = async (uid) => {
    try {
      const response = await fetch('http://117.72.72.114:9000/api/v1/cart/mget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_size: "100",
          page_num: 1,
          uid: uid
        })
      });
      
      const resp = await response.json();
      
      if (!resp || !resp.data) {
        console.error('获取购物车为空:', resp);
        return []; 
      }
      // 创建基础字典结构
      const cartData = {
        price: resp.price, // 添加响应中的价格字段
        items: await Promise.all(resp.data.map(async item => {
          const skuResponse = await fetch(`http://117.72.72.114:9000/api/v1/main/get_sku/${item.sku}`);
          const skuData = await skuResponse.json();
          
          return {
            ...skuData,
            id: skuData.goods_id,
            quantity: item.quantity,
            selected: item.selected, 
            image: skuData.ShowPic,
          };
        }))
      };
      
      return cartData; // 返回包含价格字典和商品列表的对象
    } catch (error) {
      console.error('获取购物车失败:', error);
      return [];
    }
  };

  useEffect(() => {
    const syncCart = async () => {
      if (user?.uid) {
        const remoteItems = await fetchRemoteCart(user.uid);
        // 合并data字段和quantity字段
        if (!remoteItems.items) {
          console.error('获取购物车为空:', remoteItems);
          return []; 
        }
        const formattedItems = remoteItems.items.map(item => ({
          ...item.data,
          quantity: item.quantity,
          selected: item.selected,
          all_price: remoteItems.price
        }));
        // console.log('r:', remoteItems);
        // console.log('获取到的数据:', formattedItems);
        setCartItems(formattedItems);
      }
    };
    syncCart();
  }, [user?.uid]);

  // 在Provider中暴露refreshCart方法
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      refreshCart: async () => {  // 新增暴露方法
        if (user?.uid) {
          const remoteItems = await fetchRemoteCart(user.uid);
          setCartItems(remoteItems);
        }
      }
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);