import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';


const CustomLineChart = ({ data_income, data_spent }) => {
  // Combiner toutes les transactions et les trier par date
  const allTransactions = [
    ...data_income.map(item => ({ ...item, type: 'income' })),
    ...data_spent.map(item => ({ ...item, type: 'spent' }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculer les cumuls progressifs
  let cumulativeIncome = 0;
  let cumulativeSpent = 0;

  const chartData = allTransactions.map(transaction => {
    if (transaction.type === 'income') {
      cumulativeIncome += transaction.amount;
    } else {
      cumulativeSpent += transaction.amount;
    }

    return {
      date: transaction.date,
      cumulativeIncome: cumulativeIncome,
      cumulativeSpent: cumulativeSpent,
      capitalRestant: cumulativeIncome - cumulativeSpent
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="#e5e5e5" strokeDasharray="5 5" strokeOpacity={0.3} />
        <Line type="monotone" dataKey="cumulativeIncome" stroke="#22C55E" strokeWidth={3} name="Cumul revenus" dot={{ fill: 'green', r: 2 }} />
        <Line type="monotone" dataKey="cumulativeSpent" stroke="#3B82F6" strokeWidth={3} name="Cumul dépenses" dot={{ fill: 'blue', r: 2 }} />
        <Line type="monotone" dataKey="capitalRestant" stroke="#F97316" strokeWidth={3} name="Capital restant" dot={{ fill: 'orange', r: 2 }} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value, name) => [`${value}€`, name]} />
        <Legend align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;