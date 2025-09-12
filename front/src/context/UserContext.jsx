import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // Récupérer l'utilisateur depuis localStorage ou null
  const [selectedUserId, setSelectedUserId] = useState(() => {
    const saved = localStorage.getItem('selectedUserId');
    return saved ? parseInt(saved) : null;
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (selectedUserId) {
      localStorage.setItem('selectedUserId', selectedUserId.toString());
    }
  }, [selectedUserId]);

  // Fonction wrapper pour setSelectedUserId
  const handleSetSelectedUserId = (userId) => {
    setSelectedUserId(userId);
  };

  const value = {
    selectedUserId,
    setSelectedUserId: handleSetSelectedUserId
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};