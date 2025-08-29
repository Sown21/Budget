import { useState, useEffect } from "react"
import { totalSpent, totalIncome, totalRemaining } from "../api/spents"

const Dashboard = () => {
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ yearTotalSpent, setYearTotalSpent ] = useState("")
    const [ yearTotalIncome, setYearTotalIncome ] = useState("")
    const [ yearTotalRemaining, setYearTotalRemaining ] = useState("")

    useEffect(() => {
        const getTotalSpent = async () => {
        let spents = await totalSpent(year)
        setYearTotalSpent(spents)
        }
        getTotalSpent()

        const getTotalIncome = async () => {
            let incomes = await totalIncome(year)
            setYearTotalIncome(incomes)
        }
        getTotalIncome()

        const getTotalRemaining = async () => {
            let remaining = await totalRemaining(year)
            setYearTotalRemaining(remaining)
        }
        getTotalRemaining()
    }, [])


    return (
        <div>
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
            </div>
        </div>
    )
}

export default Dashboard;