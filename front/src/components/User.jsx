import { useState } from "react";

const User = ({ user, onDeleteClick, onUpdateClick }) => {
    const handleDeleteClick = () => {
        onDeleteClick(user)
    }

    const handleUpdateClick = () => {
        onUpdateClick(user)
    }

    return (
        <div className="w-fit bg-white p-6 rounded-2xl border border-gray-200 shadow-xl hover:shadow-lg transition-all duration-200 min-h-[200px] flex flex-col items-center">
            <h3 className="font-bold text-xl mb-4">{user.name}</h3>
            <div className="flex gap-4">
                <button className="btn_delete" onClick={handleDeleteClick}>Supprimer</button>
                <button className="btn_form" onClick={handleUpdateClick}>Modifier</button>
            </div>
            
        </div>
    )
}

export default User;