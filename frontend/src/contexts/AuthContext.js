import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
  return (
    <AuthContext.Provider value={{ 
      currentUser,
      setCurrentUser,
      currentCharity: currentUser?.role === 'Charity' ? currentUser : null
    }}>
      {children}
    </AuthContext.Provider>
  );
};