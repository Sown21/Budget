const Table = ({ data }) => {
    return (
        <table className="border border-gray-300">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Montant</th>
                        <th>Description</th>
                        <th>Catégorie</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((spent) => (
                        <tr key={spent.id}>
                            <td>{spent.name}</td>
                            <td>{spent.amount}</td>
                            <td>{spent.description}</td>
                            <td>{spent.category}</td>
                            <td>{spent.date}</td>
                        </tr>
                    ))}
                </tbody>
        </table> 
    )
};

export default Table;