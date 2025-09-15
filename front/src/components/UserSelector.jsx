import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../api/users';
import { useUser } from '../context/UserContext';

const UserSelector = () => {
  // Utiliser le contexte au lieu des props
  const { users, selectedUserId, setSelectedUserId, refreshUsers } = useUser();
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    try {
      const newUser = await createUser({ name: newUserName.trim() });
      refreshUsers([...users, newUser]);
      setNewUserName('');
      setShowCreateForm(false);
      setSelectedUserId(newUser.id);
    } catch (error) {
      console.error('❌ UserSelector - Erreur lors de la création de l\'utilisateur:', error);
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (users.length <= 1) {
      alert('Vous ne pouvez pas supprimer le dernier utilisateur');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Toutes ses dépenses seront supprimées.')) {
      return;
    }

    try {
      await deleteUser(userId);
      const updatedUsers = users.filter(user => user.id !== userId);
      refreshUsers(updatedUsers);

      // Si l'utilisateur supprimé était sélectionné, sélectionner le premier disponible
      if (selectedUserId === userId && updatedUsers.length > 0) {
        setSelectedUserId(updatedUsers[0].id);
      }
    } catch (error) {
      console.error('❌ UserSelector - Erreur lors de la suppression de l\'utilisateur:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
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
    <div className="px-4 py-2 border-t border-gray-200 mt-auto">
      <div className="mb-2 mt-4">
        <select
          value={selectedUserId || ''}
          onChange={(e) => handleUserChange(parseInt(e.target.value))}
          className="w-full border-blue-50 bg-blue-100 rounded-2xl px-2 py-2 text-sm font-semibold cursor-pointer shadow-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        
        {/* {selectedUserId && users.length > 1 && (
          <button
            onClick={() => handleDeleteUser(selectedUserId)}
            className="mt-1 text-xs text-red-600 hover:text-red-800"
            title="Supprimer cet utilisateur"
          >
            🗑️ Supprimer
          </button>
        )} */}
      </div>

      {/* {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + Ajouter utilisateur
        </button>
      ) : (
        <form onSubmit={handleCreateUser} className="space-y-2">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Nom utilisateur"
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
          <div className="flex space-x-1">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setNewUserName('');
              }}
              className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
            >
              ✕
            </button>
          </div>
        </form>
      )} */}
    </div>
  );
};

export default UserSelector;