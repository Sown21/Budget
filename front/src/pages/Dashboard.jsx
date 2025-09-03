import { useState, useEffect } from "react"
import { totalSpent, totalIncome, totalRemaining, allYears, totalRemainingByMonth, yearIncome, yearSpent } from "../api/spents"
import CategoryPieChart from "../components/PieChart";
import { LuPiggyBank } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import { GiPayMoney, GiMoneyStack } from "react-icons/gi";
import CustomLineChart from "../components/LineChart";

const Dashboard = () => {
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ yearTotalSpent, setYearTotalSpent ] = useState("")
    const [ yearTotalIncome, setYearTotalIncome ] = useState("")
    const [ yearTotalRemaining, setYearTotalRemaining ] = useState("")
    const [ yearTotalRemainingByMonth, setYearTotalRemainingByMonth ] = useState("")
    const [ years, setYears ] = useState([])
    const [ month, setMonth ] = useState("")
    const [ currentYearIncome, setCurrentYearIncome ] = useState([])
    const [ currentYearSpent, setCurrentYearSpent ] = useState([])
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

        const getYearIncome = async () => {
            let data = await yearIncome(year)
            setCurrentYearIncome(data)
        }
        getYearIncome()

        const getYearSpent = async () => {
            let data = await yearSpent(year)
            setCurrentYearSpent(data)
        }
        getYearSpent()
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
                    <div className="budget_card border-yellow-100 bg-yellow-100">
                        <div className="flex gap-8">
                            <h2>Revenue total</h2>
                            <div className="border border-yellow-200 rounded-lg bg-yellow-500 p-1.5">
                                <TbMoneybag className="text-2xl text-white" />
                            </div>
                        </div>
                        <p className="font-semibold">{yearTotalIncome}€</p>
                    </div>
                    <div className="budget_card border-purple-100 bg-purple-100">
                        <div className="flex gap-8">
                            <h2>Total dépensé</h2>
                            <div className="border border-purple-200 rounded-lg bg-purple-500 p-1.5">
                                <GiPayMoney className="text-2xl text-white" />
                            </div>
                        </div>
                        <p className="font-semibold">{yearTotalSpent} €</p>
                    </div>
                        {month && (
                        <div className="budget_card border-blue-100 bg-blue-100">
                            <div className="flex gap-8">
                                <h2>Restant pour le mois</h2>
                                <div className="border border-blue-200 rounded-lg bg-blue-500 p-1.5">
                                    <GiMoneyStack className="text-2xl text-white" />
                                </div>
                            </div>
                            <p className="font-semibold">{yearTotalRemainingByMonth}€</p>
                        </div>
                        )}
                    <div className="budget_card border-orange-100 bg-orange-100">
                        <div className="flex gap-8">
                            <h2>Capital restant</h2>
                            <div className="border border-orange-200 rounded-lg bg-orange-500 p-1.5">
                                <LuPiggyBank className="text-2xl text-white" />
                            </div>
                        </div>
                        <p className="font-semibold">{yearTotalRemaining}€</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-8 mx-8 gap-8">
                <div className="scatter_chart">
                    <CustomLineChart data_income={currentYearIncome ? currentYearIncome : []} data_spent={currentYearSpent ? currentYearSpent : []} />
                </div>
                <div className="pie_chart flex flex-col gap-8 items-center">
                    <h3 className="text-xl text-slate-600">Dépenses par catégorie</h3>
                    <CategoryPieChart year={year} month={month} />
                </div>
            </div>     
        </div>
    )
}

export default Dashboard;