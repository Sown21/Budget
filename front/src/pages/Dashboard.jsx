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
            if (month !== "") {
                let remaining = await totalRemainingByMonth(year, month);
                setYearTotalRemainingByMonth(remaining)
            } else {
                setYearTotalRemainingByMonth(null)
            }

        }
        getTotalRemainingByMonth()
    }, [year, month])

    return (
        <div>
            <div className="flex flex-col gap-4 dashboard_banner shadow_blue">
                <div className="flex gap-4 mx-10">
                    <select className="banner_selector" value={year} onChange={e => setYear(Number(e.target.value))}>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}  
                    </select>
                <select className="banner_selector" value={month === null ? "" : month} onChange={e => setMonth(e.target.value === "" ? "" : Number(e.target.value))}>
                    <option value="">Année entière</option>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}  
                </select>
                </div>
                <div className="flex gap-8 mx-10 mt-6">
                    <div className="budget_card">
                        <h2>Revenue total :</h2>
                        <p className="font-semibold">{yearTotalIncome}€</p>
                    </div>
                    <div className="budget_card">
                        <h2>Total dépensé :</h2>
                        <p className="font-semibold">{yearTotalSpent} €</p>
                    </div>
                        {month && (
                        <div className="budget_card">
                            <h2>Restant pour le mois :</h2>
                            <p className="font-semibold">{yearTotalRemainingByMonth}€</p>
                        </div>
                        )}
                    <div className="budget_card">
                        <h2>Capital restant :</h2>
                        <p className="font-semibold">{yearTotalRemaining}€</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-8 mx-8 gap-8">
                <div className="scatter_chart shadow_blue">

                </div>
                <div className="pie_chart shadow_blue">
                    <CategoryPieChart year={year} month={month} />
                </div>
            </div>     
        </div>
    )
}

export default Dashboard;