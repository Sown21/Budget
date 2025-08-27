import Table from "../components/Table";
import { deleteSpent, getSpents, postSpents, modifySpent } from "../api/spents";
import { getCategories } from "../api/categories";
import { useState, useEffect } from "react"
import SpentForm from "../components/SpentForm";

const Saisis = () => {
    const [ data, setData ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ categorySelected, setCategorySelected ] = useState("");
    const [ subCategorySelected, setSubCategorySelected ] = useState("");
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ amount, setAmount ] = useState("");
    const [ date, setDate ] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const spents = await getSpents();
            setData(spents);
            const spents_categories = await getCategories();
            setCategories(spents_categories);
        };
        fetchData();
    }, []); // [] exéctué une seule fois au montage

    const selectedCat = categories.find(cat => cat.id === Number(categorySelected));
    const subCategories = selectedCat?.children || [];

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

    const handleModify = async (id) => {
        
    }

    return (
        <div>
            <SpentForm
                categories={categories}
                onSubmit={handleSpentSubmit}
                submitLabel="Valider"
            />
            <Table 
                data = {data}
                onDelete = {handleDelete}
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
        </div>
    )
};

export default Saisis;