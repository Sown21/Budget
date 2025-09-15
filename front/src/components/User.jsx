import { useState } from "react";

const User = ({ user, onDeleteClick }) => {
    const handleDeleteClick = () => {
        onDeleteClick(user) // AJOUT: appeler la fonction du parent avec l'utilisateur
    }

    return (
        <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-xl hover:shadow-lg transition-all duration-200 min-h-[200px] flex flex-col items-center">
            <h3 className="font-bold text-xl mb-4">{user.name}</h3>
            <button className="btn_delete" onClick={handleDeleteClick}>Supprimer</button>
        </div>
    )
}

export default User;