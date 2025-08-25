const Table = ({ data }) => {
    return (
        <div className="rounded-lg shadow overflow-hidden mx-8 my-8">
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="border border-gray-800 bg-gray-800 text-white">
                        <th className="p-2">Nom</th>
                        <th className="p-2">Montant</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Catégorie</th>
                        <th className="p-2">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((spent, idx) => (
                        <tr key={spent.id} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="p-2 border">{spent.name}</td>
                            <td className="p-2 border">{spent.amount}</td>
                            <td className="p-2 border">{spent.description}</td>
                            <td className="p-2 border">{spent.category_name}</td>
                            <td className="p-2 border">{spent.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table> 
        </div>
    )
};

export default Table;