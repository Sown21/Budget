import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { totalByCategory } from '../api/spents';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#FEA8B8'];

const CategoryPieChart = ({ year, month }) => {
    const [ data, setData ] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const result = await totalByCategory(year, month)
            setData(result)
        }
        fetchData()
    }, [year, month])

    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return num % 1 === 0 ? `${num} €` : `${num.toFixed(2).replace(/\.?0+$/, '')} €`;
    };

    return (
        <ResponsiveContainer width="100%" height={450}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="40%"
                    outerRadius={100}
                    innerRadius={60}
                    stroke="white"
                    strokeWidth={1}
                    label={({value}) => formatCurrency(value)}
                    labelLine={true}
                    minAngle={8}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default CategoryPieChart;