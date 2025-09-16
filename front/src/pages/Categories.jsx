import React, { useEffect, useState } from "react"
import { getCategories, addCategory, addSubCategory, delCategory, updateCategory } from "../api/categories";
import Category from "../components/Category";
import { toast } from 'react-toastify';
import { toFormData } from "axios";

const Categories = () => {
    const [ categories, setCategories ] = useState([])
    const [ showAddCategory, setShowAddCategory ] = useState(false)
    const [ showAddSubCategory, setShowAddSubCategory ] = useState(false)
    const [ categoryName, setCategoryName ] = useState("")
    const [ subCategoryName, setSubCategoryName ] = useState("")
    const [ parentId, setParentId ] = useState(null)
    const [ showDelCategory, setShowDelCategory] = useState(false)
    const [ categoryId, setCategoryId ] = useState(null)
    const [ showConfirmDelete, setShowConfirmDelete ] = useState(false)
    const [ showUpdateCategory, setShowUpdateCategory ] = useState(false)

    useEffect(() => {
        const getAllCategorie = async () => {
            let data = await getCategories()
            setCategories(data)
        }
        getAllCategorie()
    }, [])

    if (!categories || !Array.isArray(categories)) {
        return <div>Chargement des catégories...</div>
    }

    const handleAddCategory = async () => {
        try {
            const payload = { name: categoryName }
            await addCategory(payload)
            let data = await getCategories()
            setCategories(data)
            setShowAddCategory(false)
            setCategoryName("")
            toast.success("Catégorie ajoutée avec succès !")
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error)
            const errorMessage = error.response?.data?.detail || "Erreur lors de l'ajout de la catégorie"
            toast.error(errorMessage)
        }
    }

    const handleAddSubCategory = async () => {
        try {
            const payload = { name: subCategoryName, parent_id: parentId }
            await addSubCategory(payload)
            let data = await getCategories()
            setCategories(data)
            setShowAddSubCategory(false)
            setSubCategoryName("")
            setParentId(null)
            toast.success("Sous-catégorie ajoutée avec succès !")
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error)
            const errorMessage = error.response?.data?.detail || "Erreur lors de l'ajout de la sous-catégorie"
            toast.error(errorMessage)
        }
    }

    const handleDeleteCategory = async () => {
        try {
            await delCategory(categoryId)
            let data = await getCategories()
            setCategories(data)
            setShowDelCategory(false)
            setShowConfirmDelete(false)
            setCategoryId(null)
            setCategoryName("")
            toast.success("Catégorie supprimée avec succès !")
        } catch (error) {
            console.error("Erreur lors de la suppression:", error)
            const errorMessage = error.response?.data?.detail || "Erreur lors de la suppression de la catégorie"
            toast.error(errorMessage)
        }
    }

    const handleUpdateCategory = async () => {
        try {
            const payload = { name: categoryName }
            await updateCategory(categoryId, payload)
            let data = await getCategories()
            setCategories(data)
            setShowUpdateCategory(false)
            setCategoryId(null)
            setCategoryName("")
            toast.success("Catégorie modifiée avec succès !")
        } catch (error) {
            const errorMessage = error.response?.data?.detail ||"Erreur lors de la modification de la catégorie"
            toast.error(errorMessage)
        }
    }

    const getCategoryNameById = (id) => {
        // Chercher dans les catégories principales
        for (let cat of categories) {
            if (cat.id == id) {
                return cat.name;
            }
            // Chercher dans les sous-catégories
            if (cat.children) {
                for (let child of cat.children) {
                    if (child.id == id) {
                        return child.name;
                    }
                }
            }
        }
        return "";
    };

    return (
        <div className="flex flex-col">
            <h1 className="mt-10 mx-12 text-2xl font-semibold">Mes catégories</h1>
            <div className="flex justify-between mt-6 mb-12 mx-10">
                <div className="flex gap-2">
                    <button className="btn_form" onClick={() => setShowAddCategory(true)}>Ajouter une catégorie</button>
                    <button className="btn_form" onClick={() => setShowAddSubCategory(true)}>Ajouter une sous-catégorie</button>
                    <button className="btn_form" onClick={() => setShowUpdateCategory(true)}>Modifier une catégorie</button>
                </div>
                <button className="btn_delete" onClick={() => setShowDelCategory(true)}>Supprimer une catégorie</button>
            </div>
            { showAddCategory && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6">
                        <label htmlFor="category-name" className="block font-medium text-gray-700 mb-2">
                            Entrez la catégorie à ajouter : 
                        </label>
                        <div className="flex justify-center">
                            <input onChange={e => setCategoryName(e.target.value)} placeholder="Catégorie" className="border rounded p-2 bg-white/80 mt-2"></input>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="btn_form" onClick={() => handleAddCategory()}>Ajouter</button>
                            <button className="btn_form" onClick={() => setShowAddCategory(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
            { showAddSubCategory && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6">
                        <label htmlFor="category-name" className="block font-medium text-gray-700 mb-2">
                            Séléctionez la catégorie principale et entrez le nom de la sous catégorie 
                        </label>
                        <div className="flex justify-center">
                            <select className="p-2 border rounded bg-white/80 my-2" onChange={e => setParentId(e.target.value)}>
                                <option value="">-- Choisir une catégorie --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <input onChange={e => setSubCategoryName(e.target.value)} placeholder="Sous Catégorie" className="border rounded p-2 bg-white/80 my-2"></input>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="btn_form" onClick={() => handleAddSubCategory()}>Ajouter</button>
                            <button className="btn_form" onClick={() => { setShowAddSubCategory(false), setSubCategoryName(""), setParentId(null)}}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
            { showDelCategory && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-red-100 p-4 rounded border-blue-100 shadow-lg p-6 backdrop-blur">
                        <label className="block font-medium text-gray-700 mb-2">
                            Sélectionnez la catégorie à supprimer
                        </label>
                        <div className="flex justify-center">
                            <select className="p-2 border rounded bg-white/80 my-2" onChange={e => { 
                                const selectedId = e.target.value;
                                setCategoryId(selectedId);
                                setCategoryName(getCategoryNameById(selectedId));
                            }}>
                                <option value="">-- Choisir une catégorie --</option>
                                    {categories.map((cat) => (
                                        <React.Fragment key={cat.id}>
                                            {/* Catégorie principale */}
                                            <option value={cat.id}>{cat.name}</option>
                                            
                                            {/* Sous-catégories avec indentation */}
                                            {cat.children && cat.children.map((child) => (
                                                <option key={child.id} value={child.id}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;└─ {child.name}
                                                </option>
                                            ))}
                                        </React.Fragment>
                                    ))}
                            </select>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="btn_delete" onClick={() => setShowConfirmDelete(true)}>
                                Supprimer
                            </button>
                            <button className="btn_form" onClick={() => {
                                setShowDelCategory(false);
                                setCategoryId(null);
                            }}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            { showConfirmDelete && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-red-100 p-4 rounded border-blue-100 shadow-lg p-6">
                        <div className="flex justify-center">
                           <p className="text-lg">Etes vous sûr de vouloir supprimer definitivement la catégorie <span className="font-semibold">{categoryName}</span> ?</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="btn_delete" onClick={() => handleDeleteCategory()}>
                                Supprimer
                            </button>
                            <button className="btn_form" onClick={() => {
                                setShowDelCategory(false);
                                setShowConfirmDelete(false);
                                setCategoryId(null);
                                setCategoryName("")
                            }}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            { showUpdateCategory && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6 backdrop-blur">
                        <label className="block font-medium text-gray-700 mb-2">
                            Sélectionnez la catégorie à modifier
                        </label>
                        <div className="flex justify-center items-start">
                            <select className="p-2 border rounded bg-white/80 my-2" onChange={e => { 
                                const selectedId = e.target.value;
                                setCategoryId(selectedId);
                                setCategoryName(getCategoryNameById(selectedId));
                            }}>
                                <option value="">-- Choisir une catégorie --</option>
                                    {categories.map((cat) => (
                                        <React.Fragment key={cat.id}>
                                            {/* Catégorie principale */}
                                            <option value={cat.id}>{cat.name}</option>
                                            
                                            {/* Sous-catégories avec indentation */}
                                            {cat.children && cat.children.map((child) => (
                                                <option key={child.id} value={child.id}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;└─ {child.name}
                                                </option>
                                            ))}
                                        </React.Fragment>
                                    ))}
                            </select>
                            <input onChange={e => setCategoryName(e.target.value)} placeholder="Nouveau nom" className="border rounded p-2 bg-white/80 mt-2"></input>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="btn_form" onClick={() => {handleUpdateCategory()}}>
                                Modifier
                            </button>
                            <button className="btn_form" onClick={() => {
                                setShowUpdateCategory(false);
                                setCategoryId(null);
                            }}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="mx-8 my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {categories.map((category) => (
                    <Category key={category.id} category={category} />
                ))}
            </div>
        </div>
    )
}

export default Categories;