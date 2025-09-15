import { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from '../api/users';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [selectedUserId, setSelectedUserId] = useState(() => {
        const saved = localStorage.getItem('selectedUserId');
        return saved ? parseInt(saved) : null;
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // AJOUT: Fonction pour recharger les utilisateurs
    const refreshUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
            
            // Si l'utilisateur sélectionné n'existe plus, sélectionner le premier
            if (selectedUserId && !data.find(user => user.id === selectedUserId)) {
                setSelectedUserId(data.length > 0 ? data[0].id : null);
            }
        } catch (error) {
            console.error('Erreur lors du rechargement des utilisateurs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Charger les utilisateurs au montage
    useEffect(() => {
        refreshUsers();
    }, []);

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        if (selectedUserId) {
            localStorage.setItem('selectedUserId', selectedUserId.toString());
        }
    }, [selectedUserId]);

    // Auto-sélectionner le premier utilisateur si aucun n'est sélectionné
    useEffect(() => {
        if (!selectedUserId && users.length > 0) {
            setSelectedUserId(users[0].id);
        }
    }, [users, selectedUserId]);

    return (
        <UserContext.Provider value={{
            selectedUserId,
            setSelectedUserId,
            users,
            refreshUsers, // AJOUT: Exposer la fonction
            loading
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};