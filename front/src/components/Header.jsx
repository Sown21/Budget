import { FaMoneyBillTrendUp } from "react-icons/fa6";

const Header = () => {
    return (
        <header className="header_budget shadow_blue">
            <div className="flex mx-auto justify-between">
                <a className="">
                    <FaMoneyBillTrendUp />
                </a>
                <a className="cursor-pointer text-blue-500 font-semibold hover:scale-105" href="/dashboard">
                    <span>Dashboard</span>
                </a>
            </div>
        </header>
    )
}

export default Header;