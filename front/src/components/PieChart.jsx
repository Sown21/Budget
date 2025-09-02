import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
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

    return (
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                stroke="none"
                label={({value}) => `${value} €`}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    )
}

export default CategoryPieChart;