import Table from "../components/Table";
import { deleteSpent, getSpents, postSpents } from "../api/spents";
import { getCategories } from "../api/categories";
import { useState, useEffect } from "react"

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            amount,
            description,
            category_id: subCategorySelected ||categorySelected,
            date
        };
        await postSpents(payload);
        const spents = await getSpents(); // récupère la liste complète
        setData(spents);
    }

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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <select className="input_form" name="category" onChange={e => setCategorySelected(e.target.value)} required>
                    <option value="">Choisir une catégorie</option>
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {subCategories.length > 0 && (
                    <select
                        className="input_form"
                        name="subcategory"
                        value={subCategorySelected}
                        onChange={e => setSubCategorySelected(e.target.value)}
                    >
                        <option value="">Choisir une sous-catégorie</option>
                        {subCategories.map(subcat => (
                            <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                        ))}
                    </select>
                )}
                <input className="input_form" type="text" name="name" placeholder="Nom" required onChange={e => setName(e.target.value)}></input>
                <input className="input_form" type="text" name="description" placeholder="Description (optionnel)" onChange={e => setDescription(e.target.value)}></input>
                <input className="input_form" type="text" name="amount" placeholder="Montant €" required onChange={e => setAmount(e.target.value)}></input>
                <input className="input_form" type="date" name="date" required onChange={e => setDate(e.target.value)}></input>
                <button type="submit" className="">Valider</button>
            </form>
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