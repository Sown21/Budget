import { useState, useEffect } from "react";
import { totalSpent, totalIncome, totalRemaining, allYears, totalRemainingByMonth, yearIncome, yearSpent, compareMonthSpent } from "../api/spents";
import { LuPiggyBank } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import { GiPayMoney, GiMoneyStack } from "react-icons/gi";
import CustomLineChart from "../components/LineChart";
import CategoryTable from "../components/TableChart";
import { useUser } from "../context/UserContext";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const Dashboard = () => {
    const { users, selectedUserId } = useUser();
    const activeUser = users.find(u => u.id === selectedUserId);
    const [year, setYear] = useState(new Date().getFullYear());
    const [yearTotalSpent, setYearTotalSpent] = useState("");
    const [yearTotalIncome, setYearTotalIncome] = useState("");
    const [yearTotalRemaining, setYearTotalRemaining] = useState("");
    const [yearTotalRemainingByMonth, setYearTotalRemainingByMonth] = useState("");
    const [years, setYears] = useState([]);
    const [month, setMonth] = useState("");
    const [currentYearIncome, setCurrentYearIncome] = useState([]);
    const [currentYearSpent, setCurrentYearSpent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [monthPercentSpents, setMonthPercentSpents] = useState(null)
    
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
            // Ne pas charger si pas d'utilisateur sélectionné
            if (!selectedUserId) {
                setIsLoading(false);
                setHasData(false);
                return;
            }

            setIsLoading(true);

            let percentSpents = null
            
            try {
                const spents = await totalSpent(selectedUserId, year, month);
                if (month) {
                    percentSpents = await compareMonthSpent(selectedUserId, year, month)   
                    console.log(percentSpents)
                };   
                const spentsYear = await totalSpent(selectedUserId, year);
                
                // Valeurs par défaut pour les autres (pour éviter les erreurs)
                const incomes = await totalIncome(selectedUserId, year, month);
                const remaining = await totalRemaining(selectedUserId, year, month);
                const allYearsData = await allYears(selectedUserId);
                const yearIncomeData = await yearIncome(selectedUserId, year);
                const yearSpentData = await yearSpent(selectedUserId, year);

                setYearTotalSpent(spents);
                setMonthPercentSpents(percentSpents);
                setYearTotalIncome(incomes);
                setYearTotalRemaining(remaining);
                setYears(allYearsData.length > 0 ? allYearsData : [year]);
                setCurrentYearIncome(yearIncomeData);
                setCurrentYearSpent(yearSpentData);

                const hasAnyData = (spentsYear && spentsYear > 0);

                setHasData(hasAnyData);

                if (month !== "") {
                    const monthRemaining = await totalRemainingByMonth(selectedUserId, year, month);
                    setYearTotalRemainingByMonth(monthRemaining);
                } else {
                    setYearTotalRemainingByMonth(null);
                }

            } catch (error) {
                console.error('Dashboard - Erreur lors du chargement des données:', error);
                setHasData(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadAllData();
    }, [selectedUserId, year, month]);

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

    // Si pas d'utilisateur sélectionné
    if (!selectedUserId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="dashboard_banner p-8 flex flex-col items-center">
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
                        <p className="font-bold text-lg">Aucun utilisateur sélectionné</p>
                        <p>Veuillez sélectionner un utilisateur dans la barre latérale pour voir le dashboard.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Message uniquement si pas de données ET chargement terminé
    if (!hasData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="dashboard_banner p-8 flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4">Aucune donnée pour cet utilisateur</h3>
                    <p className="text-gray-600 mb-4">Veuillez saisir vos premières données pour voir le dashboard.</p>
                    <a href="/saisis">
                        <button className="btn_form">Aller aux saisies</button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="mx-8 mt-4 text-2xl font-semibold">Bonjour {activeUser ? activeUser.name : ""}</h2>
            <div className="flex flex-col gap-4 dashboard_banner">
                <div className="flex gap-4 mx-10">
                    <select 
                        className="banner_selector" 
                        value={year} 
                        onChange={e => setYear(Number(e.target.value))}
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}  
                    </select>
                    <select 
                        className="banner_selector" 
                        value={month === null ? "" : month} 
                        onChange={e => setMonth(e.target.value === "" ? "" : Number(e.target.value))}
                    >
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
                        <div className="flex justify-between items-end">
                            <p className="font-semibold">{yearTotalIncome}€</p>
                        </div>

                    </div>
                    
                    <div className="budget_card border-purple-100 bg-purple-100">
                        <div className="flex gap-8">
                            <h2>Total dépensé</h2>
                            <div className="border border-purple-200 rounded-lg bg-purple-500 p-1.5">
                                <GiPayMoney className="text-2xl text-white" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <p className="font-semibold">{yearTotalSpent} €</p>
                            {month && monthPercentSpents !== null && monthPercentSpents !== 0 && (
                                monthPercentSpents < 0 ? (
                                    <div className="flex gap-2 items-center text-sm text-green-500 font-semibold">
                                        <FaArrowTrendDown />
                                        <p>{monthPercentSpents}%</p>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 items-center text-sm text-red-500 font-semibold">
                                        <FaArrowTrendUp />
                                        <p>{monthPercentSpents}%</p>
                                    </div>
                                )
                            )}
                        </div>
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
                <div className="flex-1 min-w-0">
                    <CategoryTable 
                        year={year} 
                        month={month} 
                        selectedUserId={selectedUserId}
                    />
                </div>
                <div className="line_chart flex-[2] min-w-0">
                    <CustomLineChart 
                        data_income={currentYearIncome ? currentYearIncome : []} 
                        data_spent={currentYearSpent ? currentYearSpent : []} 
                    />
                </div>
            </div>     
        </div>
    );
};

export default Dashboard;