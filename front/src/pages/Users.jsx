import { useEffect, useState } from "react";
import User from "../components/User";
import { getUsers } from "../api/users";

const Users = () => {
    const [users, setUsers] = useState([])
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                let data = await getUsers()
                setUsers(data)
            } catch (error) {
                console.error('Erreur lors du chargement des users', error)
            }
        }
        getAllUsers()
    }, [])

    const handleDeleteClick = (user) => {
        setUserToDelete(user)
        setShowConfirmDelete(true)
    }

    const confirmDelete = async () => {
        try {
            // Ici vous ajouterez l'appel API pour supprimer l'utilisateur
            // await deleteUser(userToDelete.id)
            
            // Recharger la liste des utilisateurs
            const data = await getUsers()
            setUsers(data)
            
            // Fermer la modal
            setShowConfirmDelete(false)
            setUserToDelete(null)
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
        }
    }

    const cancelDelete = () => {
        setShowConfirmDelete(false)
        setUserToDelete(null)
    }

    return (
        <div className="p-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                    <User key={user.id} user={user} onDeleteClick={handleDeleteClick}/>
                ))}
            </div>
            { showConfirmDelete && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-red-100 p-4 rounded border-blue-100 shadow-lg p-6">
                        <div className="flex justify-center">
                           <p className="text-lg">Etes vous sûr de vouloir supprimer definitivement la catégorie <span className="font-semibold">sttdt</span> ?</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="btn_delete">
                                Supprimer
                            </button>
                            <button className="btn_form" onClick={() => {
                                setShowConfirmDelete(false);
                            }}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users;