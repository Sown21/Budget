import { useState, useEffect } from "react"
import { totalSpent, totalIncome } from "../api/spents"

const Dashboard = () => {
    const [ year, setYear ] = useState("")
    const [ yearTotalSpent, setYearTotalSpent ] = useState("")
    const [ yearTotalIncome, setYearTotalInome ] = useState("")

    useEffect(() => {
        const getTotalSpent = async () => {
        let spents = await totalSpent(2025)
        setYearTotalSpent(spents)
        }
        getTotalSpent()

        const getTotalIncome = async () => {
            let incomes = await totalIncome(2025)
            setYearTotalInome(incomes)
        }
        getTotalIncome()
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
            </div>
        </div>
    )
}

export default Dashboard;