import { useState, useEffect } from "react"
import { totalSpent, totalIncome, totalRemaining, allYears, totalRemainingByMonth, yearIncome, yearSpent } from "../api/spents"
import { LuPiggyBank } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import { GiPayMoney, GiMoneyStack } from "react-icons/gi";
import CustomLineChart from "../components/LineChart";
import CategoryTable from "../components/TableChart";

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
    const [ isLoading, setIsLoading ] = useState(true)
    const [ hasData, setHasData ] = useState(false)
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
        const loadAllData = async () => {
            setIsLoading(true);
            
            try {
                const [spents, incomes, remaining, allYearsData, yearIncomeData, yearSpentData] = await Promise.all([
                    totalSpent(year, month),
                    totalIncome(year, month),
                    totalRemaining(year, month),
                    allYears(),
                    yearIncome(year),
                    yearSpent(year)
                ]);

                setYearTotalSpent(spents);
                setYearTotalIncome(incomes);
                setYearTotalRemaining(remaining);
                setYears(allYearsData);
                setCurrentYearIncome(yearIncomeData);
                setCurrentYearSpent(yearSpentData);

                // Déterminer s'il y a des données
                setHasData(yearTotalData !== "" && yearTotalData !== "0" && yearTotalData !== 0);

                // Gestion du mois
                if (month !== "") {
                    const monthRemaining = await totalRemainingByMonth(year, month);
                    setYearTotalRemainingByMonth(monthRemaining);
                } else {
                    setYearTotalRemainingByMonth(null);
                }

            } finally {
                setIsLoading(false);
            }
        };

        loadAllData();
    }, [year, month]);

    // Loading state pendant le chargement initial
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-600">Chargement du dashboard...</h3>
                </div>
            </div>
        );
    }

    // Message uniquement si pas de données ET chargement terminé
    if (!hasData) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="dashboard_banner p-8 flex flex-col items-center">
                    <h3 className="text-xl font-semibold">Veuillez saisir vos premières données</h3>
                    <a href="/saisis">
                        <button className="btn_form">Aller aux saisies</button>
                    </a>
                </div>
            </div>
        );
    }

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
            
            {/* Flexbox avec items-start pour alignment en haut */}
            <div className="flex flex-col lg:flex-row gap-8 mt-8 mx-8 items-start">
                <div className="flex-1 min-w-0"> {/* Taille normale */}
                    <CategoryTable year={year} month={month} />
                </div>
                <div className="line_chart flex-[2] min-w-0"> {/* 2x plus large */}
                    <CustomLineChart data_income={currentYearIncome ? currentYearIncome : []} data_spent={currentYearSpent ? currentYearSpent : []} />
                </div>
            </div>     
        </div>
    )
}

export default Dashboard;