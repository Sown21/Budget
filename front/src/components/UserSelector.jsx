import { useState, useEffect } from 'react';
import { getUsers } from '../api/users';
import { useUser } from '../context/UserContext';

const UserSelector = () => {
  // Utiliser le contexte au lieu des props
  const { users, selectedUserId, setSelectedUserId, refreshUsers } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      refreshUsers(usersData);

      // Si aucun utilisateur n'est sélectionné, prendre le premier par défaut
      if (!selectedUserId && usersData.length > 0) {
        setSelectedUserId(usersData[0].id);
      }
    } catch (error) {
      console.error('❌ UserSelector - Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
  };

  if (loading) {
    return (
      <div className="px-4 py-2">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 border-t border-gray-200 mt-auto">
      <div className="mb-2 mt-4">
        <select
          value={selectedUserId || ''}
          onChange={(e) => handleUserChange(parseInt(e.target.value))}
          className="w-full border-blue-50 bg-blue-100 rounded-2xl px-2 py-2.5 text-sm font-semibold cursor-pointer shadow-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {users.length === 0 && (
            <option value="">Aucun utilisateur</option>
          )}
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserSelector;