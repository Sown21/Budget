import { FaMoneyBillTrendUp } from "react-icons/fa6";

const Header = () => {
    return (
        <header className="header_budget shadow_blue">
            <div className="flex mx-auto justify-between items-center">
                <a className="flex gap-4 items-end cursor-pointer" href="/">
                    <FaMoneyBillTrendUp className="text-3xl text-blue-500" />
                    <h3 className="font-semibold text-lg">Budget</h3>
                </a>
                <div className="flex gap-6">
                    <a className="cursor-pointer text-blue-500 font-semibold hover:scale-105" href="/saisis">
                        <span>Saisies</span>
                    </a>
                    <a className="cursor-pointer text-blue-500 font-semibold hover:scale-105" href="/dashboard">
                        <span>Dashboard</span>
                    </a>
                </div>

            </div>
        </header>
    )
}

export default Header;