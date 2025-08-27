import { IoTrash } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useState } from "react"

const Table = ({ data, onDelete, onModify }) => {

    return (
        <div className="rounded-lg shadow overflow-hidden mx-8 my-8">
            <div className="max-h-96 overflow-auto pb-10">
                <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="border border-gray-800 bg-blue-900 text-white">
                        <th className="p-2">Nom</th>
                        <th className="p-2">Montant</th>
                        <th className="p-2">Catégorie</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((spent, idx) => (
                        <tr key={spent.id} className={idx % 2 === 0 ? "bg-gray-100 hover:bg-gray-200" : "bg-blue-100 hover:bg-blue-200"}>
                            <td className="p-2 border">{spent.name}</td>
                            <td className="p-2 border">{spent.amount}</td>
                            <td className="p-2 border">{spent.category_name}</td>
                            <td className="p-2 border">{spent.date}</td>
                            <td className="p-2 border">{spent.description}</td>
                            <td className="p-2 border">
                                <div className="flex gap-2">
                                    <button className="btn_actions flex items-center justify-center" onClick={() => onDelete(spent.id)}>
                                        <IoTrash className="text-xl" />
                                    </button>
                                    <button className="btn_actions flex items-center justify-center" onClick={() => onModify(spent.id)}>
                                        <HiOutlinePencilSquare className="text-xl" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
};

export default Table;