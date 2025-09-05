import Table from "../components/Table";
import { deleteSpent, getSpents, postSpents, modifySpent } from "../api/spents";
import { getCategories } from "../api/categories";
import { useState, useEffect } from "react";
import SpentForm from "../components/SpentForm";
import { toast } from 'react-toastify';
import { useUser } from "../context/UserContext";

const Saisis = () => {
    const { selectedUserId } = useUser();
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [refreshForm, setRefreshForm] = useState(0);
    const [loading, setLoading] = useState(true);

    // Charger les catégories une seule fois
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const spents_categories = await getCategories();
                setCategories(spents_categories);
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Charger les données quand selectedUserId change
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedUserId) {
                setData([]);
                setLoading(false);
                return;
            }
            
            setLoading(true);
            
            try {
                const spents = await getSpents(selectedUserId);
                // Tri par date décroissante
                spents.sort((a, b) => new Date(b.date) - new Date(a.date));
                setData(spents);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [selectedUserId]);

    const handleSpentSubmit = async (payload) => {
        if (!selectedUserId) {
            toast.error("Aucun utilisateur sélectionné");
            return;
        }

        try {
            const payloadWithUser = { ...payload, user_id: selectedUserId };
            await postSpents(payloadWithUser);
            
            // Recharger les données
            const spents = await getSpents(selectedUserId);
            spents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(spents);
            setRefreshForm(prev => prev + 1);
            toast.success("Ajout de la saisie réussi !");
        } catch (error) {
            console.error('Erreur création:', error);
            const errorMessage = error.response?.data?.detail || "Erreur lors de l'ajout de la saisie !";
            toast.error(errorMessage);
        }
    };

    const [idToDelete, setIdToDelete] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = async (id) => {
        setShowDeleteConfirm(true);
        setIdToDelete(id);
    };

    const confirmDelete = async () => {
        try {
            await deleteSpent(idToDelete);
            const spents = await getSpents(selectedUserId);
            spents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(spents);
            setShowDeleteConfirm(false);
            setIdToDelete(null);
            toast.success("Dépense supprimée avec succès !");
        } catch (error) {
            console.error('Erreur suppression:', error);
            const errorMessage = error.response?.data?.detail || "Erreur lors de la suppression";
            toast.error(errorMessage);
        }
    };

    const [showModify, setShowModify] = useState(false);
    const [idToModify, setIdToModify] = useState("");

    const handleModifyClick = (id) => {
        setShowModify(true);
        setIdToModify(id);
    };

    const handleModify = async (payload) => {
        try {
            const payloadWithUser = { ...payload, user_id: selectedUserId };
            await modifySpent(idToModify, payloadWithUser);
            const spents = await getSpents(selectedUserId);
            spents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(spents);
            setShowModify(false);
            setIdToModify("");
            toast.success("Dépense modifiée avec succès !");
        } catch (error) {
            console.error('Erreur modification:', error);
            const errorMessage = error.response?.data?.detail || "Erreur lors de la modification";
            toast.error(errorMessage);
        }
    };

    // État de chargement
    if (loading) {
        return (
            <div className="saisie_bg flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
        );
    }

    // Si pas d'utilisateur sélectionné
    if (!selectedUserId) {
        return (
            <div className="saisie_bg flex flex-col items-center justify-center min-h-screen">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
                    <p className="font-bold text-lg">Aucun utilisateur sélectionné</p>
                    <p>Veuillez sélectionner un utilisateur dans la barre latérale pour voir vos dépenses.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="saisie_bg flex flex-col">
            <div className="saisie_card mt-10">
                <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-600">
                    Saisie des dépenses - Utilisateur ID: {selectedUserId}
                </h2>
                <SpentForm
                    key={refreshForm}
                    categories={categories}
                    onSubmit={handleSpentSubmit}
                    submitLabel="Ajouter"
                />
            </div>
            <Table 
                data={data}
                onDelete={handleDelete}
                onModify={handleModifyClick}
                idToModify={idToModify}
            />

            {/* Modale de confirmation de suppression */}
            {showDeleteConfirm && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/20">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6">
                        <p className="font-semibold text-xl">Confirmer la suppression ?</p>
                        <div className="flex gap-4 mt-4">
                            <button onClick={confirmDelete} className="btn_form bg-red-500 text-white">Oui</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn_form bg-gray-500 text-white">Non</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modale de modification */}
            {showModify && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/20">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6 max-w-lg w-full mx-4">
                        <SpentForm
                            categories={categories}
                            initialValues={(() => {
                                const spent = data.find(spent => spent.id === idToModify);
                                if (!spent) return {};
                                let category_id = spent.category_id;
                                let subCategory_id = "";
                                const parentCat = categories.find(cat => cat.children?.some(sub => sub.id === category_id));
                                if (parentCat) {
                                    subCategory_id = category_id;
                                    category_id = parentCat.id;
                                }
                                return {
                                    name: spent.name,
                                    amount: spent.amount,
                                    description: spent.description,
                                    date: spent.date,
                                    category_id,
                                    subCategory_id
                                };
                            })()}
                            onSubmit={handleModify}
                            submitLabel="Modifier"
                            cancelButton={
                                <button 
                                    onClick={() => { setShowModify(false); setIdToModify(""); }} 
                                    type="button" 
                                    className="btn_form bg-gray-500 text-white"
                                >
                                    Annuler
                                </button>
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Saisis;