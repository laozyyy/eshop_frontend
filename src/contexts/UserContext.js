import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const randomAvatar = `https://ts1.cn.mm.bing.net/th?id=OIP-C.vuLJrhOeaj1OZ2RTOig_hgHaHa&w=173&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2`;
      setUserAvatar(randomAvatar);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 