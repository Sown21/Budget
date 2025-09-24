const Category = ({ category }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl hover:scale-105 hover:shadow-lg transition-all duration-200 min-h-[200px] flex flex-col h-full">
            <h3 className="font-bold text-xl mb-4">{category.name}</h3>
            
            <div className="flex-1"> {/* Prend l'espace restant */}
                {category.children && category.children.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            {category.children.length} sous-catégorie(s)
                        </p>
                        <ul className="space-y-1">
                            {category.children.map((child) => (
                                <li key={child.id} className="text-gray-700 text-sm">
                                    • {child.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Category;