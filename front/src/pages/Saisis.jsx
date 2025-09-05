import Table from "../components/Table";
import { deleteSpent, getSpents, postSpents, modifySpent } from "../api/spents";
import { getCategories } from "../api/categories";
import { useState, useEffect } from "react"
import SpentForm from "../components/SpentForm";
import { toast } from 'react-toastify';

const Saisis = () => {
    const [ data, setData ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ refreshForm, setRefreshForm ] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const spents = await getSpents();
            // Tri par date décroissante
            spents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(spents);
            const spents_categories = await getCategories();
            setCategories(spents_categories);
        };
        fetchData();
    }, []); // [] exéctué une seule fois au montage

    const handleSpentSubmit = async (payload) => {
        try {
            await postSpents(payload);
            const spents = await getSpents();
            spents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(spents);
            setRefreshForm(prev => prev + 1); // Force form reset
            toast.success("Ajout de la saisie réussi !");
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Erreur lors de l'ajout de la saisie !";
            toast.error(errorMessage);
        };
    };

    const [ idToDelete, setIdToDelete ] = useState(null);
    const [ showDeleteConfirm, setShowDeleteConfirm ] = useState(false);

    const handleDelete = async (id) => {
        setShowDeleteConfirm(true);
        setIdToDelete(id)
    }

    const confirmDelete = async () => {
        try {
            await deleteSpent(idToDelete);
            const spents = await getSpents();
            spents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(spents);
            setShowDeleteConfirm(false);
            setIdToDelete(null);
            toast.success("Dépense supprimée avec succès !");
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Erreur lors de la suppression";
            toast.error(errorMessage);
        }
    }

    const [ showModify, setShowModify ] = useState(false);
    const [ idToModify, setIdToModify ] = useState("");

    const handleModifyClick = (id) => {
        setShowModify(true);
        setIdToModify(id);
    };

    const handleModify = async (payload) => {
        try {
            await modifySpent(idToModify, payload);
            const spents = await getSpents();
            spents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setData(spents);
            setShowModify(false);
            setIdToModify("");
            toast.success("Dépense modifiée avec succès !");
        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Erreur lors de la modification";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="saisie_bg flex flex-col">
            <div className="saisie_card mt-10">
                <h2 className="text-4xl font-extrabold text-center mb-12 text-blue-600">Saisie des dépenses</h2>
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

            {showDeleteConfirm && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/20">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6">
                        <p className="font-semibold text-xl">Confirmer la suppression ?</p>
                        <div className="flex gap-4">
                            <button onClick={confirmDelete} className="btn_form">Oui</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn_form">Non</button>
                        </div>

                    </div>
                </div>
            )}
            {showModify && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/20">
                    <div className="bg-blue-200 p-4 rounded border-blue-100 shadow-lg p-6">
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
                            cancelButton={<button onClick={() => { setShowModify(false);  setIdToModify(""); }} type="button" className="btn_form">Annuler</button>}
                        />
                    </div>
                </div>
            )}
        </div>
    )
};

export default Saisis;