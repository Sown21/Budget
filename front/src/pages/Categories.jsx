import { useEffect, useState } from "react"
import { getCategories } from "../api/categories";
import Category from "../components/Category";

const Categories = () => {
    const [ categories, setCategories ] = useState([])

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

    return (
        <div className="flex flex-col">
            <h1 className="mt-10 mx-12 text-2xl font-semibold">Mes catégories</h1>
            <div className="mx-8 my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {categories.map((category) => (
                    <Category key={category.id} category={category} />
                ))}
            </div>
        </div>
    )
}

export default Categories;