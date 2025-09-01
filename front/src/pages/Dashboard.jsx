import { useState, useEffect } from "react"
import { totalSpent, totalIncome, totalRemaining, allYears, totalRemainingByMonth } from "../api/spents"
import CategoryPieChart from "../components/PieChart";

const Dashboard = () => {
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ yearTotalSpent, setYearTotalSpent ] = useState("")
    const [ yearTotalIncome, setYearTotalIncome ] = useState("")
    const [ yearTotalRemaining, setYearTotalRemaining ] = useState("")
    const [ yearTotalRemainingByMonth, setYearTotalRemainingByMonth ] = useState("")
    const [ years, setYears ] = useState([])
    const [ month, setMonth ] = useState("")
    const months = [
        { value: 1, label: "Janvier" },
        { value: 2, label: "Février" },
        { value: 3, label: "Mars" },
        { value: 4, label: "Avril" },
        { value: 5, label: "Mai" },
        { value: 6, label: "Juin" },
        { value: 7, label: "Juillet" },
        { value: 8, label: "Août" },
        { value: 9, label: "Septembre" },
        { value: 10, label: "Octobre" },
        { value: 11, label: "Novembre" },
        { value: 12, label: "Décembre" },
    ];

    useEffect(() => {
        const getTotalSpent = async () => {
            let spents = await totalSpent(year, month);
            setYearTotalSpent(spents);
        }
        getTotalSpent()

        const getTotalIncome = async () => {
            let incomes = await totalIncome(year, month);
            setYearTotalIncome(incomes)
        }
        getTotalIncome()

        const getTotalRemaining = async () => {
            let remaining = await totalRemaining(year, month);
            setYearTotalRemaining(remaining)
        }
        getTotalRemaining()
        const getAllYears = async () => {
            let years = await allYears()
            setYears(years)
        }
        getAllYears()

        const getTotalRemainingByMonth = async () => {
            let remaining = await totalRemainingByMonth(year, month);
            setYearTotalRemainingByMonth(remaining)
        }
        getTotalRemainingByMonth()
    }, [year, month])

    return (
        <div>
            <select value={year} onChange={e => setYear(Number(e.target.value))}>
                {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}  
            </select>
            <select value={month === null ? "" : month} onChange={e => setMonth(e.target.value === "" ? "" : Number(e.target.value))}>
                <option value="">Année entière</option>
                {months.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}  
            </select>
            <div className="flex gap-4">
                <div className="budget_card">
                    <h2>Total dépensé :</h2>
                    <p className="font-semibold">{yearTotalSpent} €</p>
                </div>
                <div className="budget_card">
                    <h2>Revenue total :</h2>
                    <p className="font-semibold">{yearTotalIncome}€</p>
                </div>
                <div className="budget_card">
                    <h2>Capital restant :</h2>
                    <p className="font-semibold">{yearTotalRemaining}€</p>
                </div>
                {month && (
                    <div className="budget_card">
                        <h2>Restant pour le mois en cours :</h2>
                        <p className="font-semibold">{yearTotalRemainingByMonth}€</p>
                    </div>
                )
                }
            </div>
            <CategoryPieChart year={year} month={month} />
        </div>
    )
}

export default Dashboard;