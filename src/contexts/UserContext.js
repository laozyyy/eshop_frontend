import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 修改为完整的用户对象状态
  const [user, setUser] = useState(null);

  const updateAvatar = () => {
    const token = localStorage.getItem('userToken');
    if (token != null) {
      const avatarUrl = 'https://tse4-mm.cn.bing.net/th/id/OIP-C.4VIkNUS4ZmeKarixs3XWFgHaHa?rs=1&pid=ImgDetMain';
      setUser({
        avatar: avatarUrl,
        uid: token
      });
      localStorage.setItem('uid', token);
    }
  };

  // 添加初始化检测
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      updateAvatar();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);