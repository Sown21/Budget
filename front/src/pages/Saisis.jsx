import Table from "../components/Table";
import { deleteSpent, getSpents, postSpents, modifySpent } from "../api/spents";
import { getCategories } from "../api/categories";
import { useState, useEffect } from "react"
import SpentForm from "../components/SpentForm";

const Saisis = () => {
    const [ data, setData ] = useState([]);
    const [ categories, setCategories ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const spents = await getSpents();
            setData(spents);
            const spents_categories = await getCategories();
            setCategories(spents_categories);
        };
        fetchData();
    }, []); // [] exéctué une seule fois au montage

    const handleSpentSubmit = async (payload) => {
        await postSpents(payload);
        const spents = await getSpents();
        setData(spents);
    };

    const [ idToDelete, setIdToDelete ] = useState(null);
    const [ showDeleteConfirm, setShowDeleteConfirm ] = useState(false);

    const handleDelete = async (id) => {
        setShowDeleteConfirm(true);
        setIdToDelete(id)
    }

    const confirmDelete = async () => {
        await deleteSpent(idToDelete);
        const spents = await getSpents();
        setData(spents);
        setShowDeleteConfirm(false);
        setIdToDelete(null)
    }

    const [ showModify, setShowModify ] = useState(false);
    const [ idToModify, setIdToModify ] = useState("");

    const handleModifyClick = (id) => {
        setShowModify(true);
        setIdToModify(id);
    };

    const handleModify = async (payload) => {
    await modifySpent(idToModify, payload);
    const spents = await getSpents();
    setData(spents);
    setShowModify(false);
    setIdToModify("");
    };

    return (
        <div>
            <SpentForm
                categories={categories}
                onSubmit={handleSpentSubmit}
                submitLabel="Ajouter"
            />
            <Table 
                data = {data}
                onDelete = {handleDelete}
                onModify = {handleModifyClick}
            />
            {showDeleteConfirm && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                    <div className="bg-gray-200 p-4 rounded border-2 border-gray-400 shadow-lg">
                        <p className="font-semibold text-xl">Confirmer la suppression ?</p>
                        <button onClick={confirmDelete}>Oui</button>
                        <button onClick={() => setShowDeleteConfirm(false)}>Non</button>
                    </div>
                </div>
            )}
            {showModify && (
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
                />
            )}
        </div>
    )
};

export default Saisis;