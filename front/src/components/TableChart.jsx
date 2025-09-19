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
        'bg-blue-400', 'bg-red-400', 'bg-green-400', 'bg-yellow-400',
        'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-teal-400',
        'bg-orange-400', 'bg-lime-400', 'bg-cyan-400', 'bg-amber-400',
        'bg-emerald-400', 'bg-violet-400', 'bg-fuchsia-400', 'bg-sky-400',
        'bg-rose-400', 'bg-gray-400', 'bg-stone-400', 'bg-neutral-400'
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Dépenses par catégorie</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                            <span className="font-medium text-gray-700 min-w-0 flex-1 truncate">
                                {item.category}
                            </span>
                        </div>
                        <div className="flex items-center ml-4 min-w-0">
                            {/* Barre de progression */}
                            <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2 mr-3 flex-shrink-0">
                                <div 
                                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                    style={{ width: `${getPercentage(item.total)}%` }}
                                ></div>
                            </div>
                            <span className="text-sm text-gray-500 w-10 sm:w-12 text-right flex-shrink-0">
                                {getPercentage(item.total)}%
                            </span>
                            <span className="font-semibold text-gray-900 w-16 sm:w-20 text-right flex-shrink-0">
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