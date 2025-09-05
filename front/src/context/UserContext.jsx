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
      console.log('💾 UserContext - Utilisateur sauvegardé:', selectedUserId);
    }
  }, [selectedUserId]);

  // Fonction wrapper pour setSelectedUserId avec log
  const handleSetSelectedUserId = (userId) => {
    console.log('📝 UserContext - Changement d\'utilisateur demandé:', userId);
    setSelectedUserId(userId);
  };

  const value = {
    selectedUserId,
    setSelectedUserId: handleSetSelectedUserId
  };

  console.log('🏗️ UserContext - Provider rendu avec selectedUserId:', selectedUserId);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};