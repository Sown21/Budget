import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { MdOutlineSpaceDashboard, MdOutlineTableRows, MdOutlineCategory } from "react-icons/md";

const SideBar = () => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="bg-white w-64 p-6 shadow-lg flex flex-col rounded my-10 border border-gray-200">
                <div className="font-bold text-xl mb-8 flex gap-4 justify-center items-end">
                    <FaMoneyBillTrendUp className="text-3xl text-blue-500" />
                    <h2>Budget</h2>
                </div>
                <div className="border border-gray-200 my-4"></div>
                <nav className="flex-1">
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " bg-blue-100 text-blue-600 font-semibold" : "")
                            }
                        >
                            <div className="flex gap-2 items-center">
                                <MdOutlineSpaceDashboard className="text-2xl"/>
                                Dashboard
                            </div>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/saisis"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " bg-blue-100 text-blue-600 font-semibold" : "")
                            }
                        >
                            <div className="flex gap-2 items-center">
                                <MdOutlineTableRows className="text-2xl" />
                                Saisis
                            </div>
                           
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/categories"
                            className={({ isActive }) =>
                                "sidebar-link" + (isActive ? " bg-blue-100 text-blue-600 font-semibold" : "")
                            }
                        >
                            <div className="flex gap-2 items-center">
                                <MdOutlineCategory className="text-2xl" />
                                Catégories
                            </div>
                           
                        </NavLink>
                    </li>

                </ul>
                </nav>
            </aside>

        </div>
    )
}

export default SideBar;