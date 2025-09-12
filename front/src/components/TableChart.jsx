import { useEffect, useState } from 'react';
import { totalByCategory } from '../api/spents';

const CategoryTable = ({ selectedUserId, year, month }) => { 
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            // Vérifier que selectedUserId existe
            if (!selectedUserId || !year) return;
            
            try {
                const result = await totalByCategory(selectedUserId, year, month);
                const sortedData = result.sort((a, b) => b.total - a.total);
                const totalAmount = result.reduce((sum, item) => sum + parseFloat(item.total), 0);
                setData(sortedData);
                setTotal(totalAmount);
            } catch (error) {
                setData([]);
                setTotal(0);
            }
        };
        fetchData();
    }, [selectedUserId, year, month]);

    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return num % 1 === 0 ? `${num} €` : `${num.toFixed(2).replace(/\.?0+$/, '')} €`;
    };

    const getPercentage = (value) => {
        return total > 0 ? ((parseFloat(value) / total) * 100).toFixed(1) : 0;
    };

    const colors = [
        'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Dépenses par catégorie</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                            <span className="font-medium text-gray-700 min-w-0 flex-1">
                                {item.category}
                            </span>
                        </div>
                        <div className="flex items-center ml-4">
                            {/* Barre de progression */}
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                    style={{ width: `${getPercentage(item.total)}%` }}
                                ></div>
                            </div>
                            <span className="text-sm text-gray-500 w-12 text-right">
                                {getPercentage(item.total)}%
                            </span>
                            <span className="font-semibold text-gray-900 w-20 text-right">
                                {formatCurrency(item.total)}
                            </span>
                        </div>
                    </div>
                ))}
                <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryTable;