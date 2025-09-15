import { useEffect, useState } from "react";
import User from "../components/User";
import { getUsers, deleteUser, createUser } from "../api/users";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const Users = () => {
    const [users, setUsers] = useState([])
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [userName, setUserName] = useState("")
    const [showAddUser, setShowAddUser] = useState(false)

    const { refreshUsers } = useUser()

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
        setUserName(user.name)
    }

    const confirmDelete = async () => {
        try {
            await deleteUser(userToDelete.id)
            
            // Recharger la liste des utilisateurs
            const data = await getUsers()
            setUsers(data)

            await refreshUsers();
            
            // Fermer la modal
            setShowConfirmDelete(false)
            setUserToDelete(null)
            toast.success("Utilisateur supprimé !")
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            const errorMessage = error.response?.data?.detail || "Erreur lors de la suppression de l'utilisateur"
            toast.error(errorMessage)
        }
    }

    const cancelDelete = () => {
        setShowConfirmDelete(false)
        setUserToDelete(null)
    }

    const handleAddUser = async () => {
        try {
            const payload = { name: userName }
            await createUser(payload)

            const data = await getUsers()
            setUsers(data)

            await refreshUsers()

            setUserName("")
            
            setShowAddUser(false)
            toast.success("Utilisateur créé ! ")
            
        } catch (error) {
            let errorMessage = "Erreur lors de la création de l'utilisateur";
            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
                } else {
                    errorMessage = error.response.data.detail;
                }
            }
            toast.error(errorMessage);
            // Fermer la modal après un petit délai pour laisser le toast s'afficher
            setTimeout(() => setShowAddUser(false), 300);
        }
    }

    return (
        <div className="flex flex-col">
            <h1 className="mt-10 mb-5 mx-10 text-2xl font-semibold">Utilisateurs</h1>
            <button className="mx-10 w-96 mb-10 btn_form" onClick={() => setShowAddUser(true)}>Ajouter un utilisateur</button>
            <div className="mx-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                    <User key={user.id} user={user} onDeleteClick={handleDeleteClick}/>
                ))}
            </div>
            { showConfirmDelete && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-red-100 p-4 rounded border-blue-100 shadow-lg p-6">
                        <div className="flex justify-center">
                           <p className="text-lg">Etes vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{userName}</span> ?</p>
                        </div>
                        <div className="flex gap-2 justify-center" onClick={() => {
                            confirmDelete();
                        }}>
                            <button className="btn_delete">
                                Supprimer
                            </button>
                            <button className="btn_form" onClick={() => {
                                cancelDelete();
                            }}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            { showAddUser && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6">
                        <label htmlFor="category-name" className="block font-medium text-gray-700 mb-2">
                            Entrez le nom de l'utilisateur à ajouter : 
                        </label>
                        <div className="flex justify-center">
                            <input onChange={e => setUserName(e.target.value)} placeholder="Utilisateur" className="border rounded p-2 bg-white/80 mt-2"></input>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="btn_form" onClick={() => handleAddUser()}>Ajouter</button>
                            <button className="btn_form" onClick={() => setShowAddUser(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users;