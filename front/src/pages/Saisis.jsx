import Table from "../components/Table";
import { getSpents, postSpents } from "../api/spents";
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
    console.log(date)
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
            />
        </div>
    )
};

export default Saisis;