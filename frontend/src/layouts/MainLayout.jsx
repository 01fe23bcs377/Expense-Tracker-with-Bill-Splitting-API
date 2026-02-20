import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, PieChart, Bell, Settings, LogOut } from 'lucide-react';

const MainLayout = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('app_user_name') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('app_user_id');
        localStorage.removeItem('app_user_name');
        localStorage.removeItem('app_user_email');
        navigate('/login');
    };
    return (
        <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xl tracking-tight">
                        <Receipt size={24} className="text-brand-500" />
                        <span>SplitWise Pro</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" exact />
                    <NavItem to="/friends" icon={<Users size={20} />} label="Friends" />
                    <NavItem to="/activity" icon={<PieChart size={20} />} label="Activity" />
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center md:hidden gap-2 text-brand-600 font-bold text-xl">
                        <Receipt size={24} />
                        <span>SplitWise Pro</span>
                    </div>
                    <div className="hidden md:block">
                        {/* Page title area could go here, handled by outlet contents mostly */}
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold cursor-pointer border border-brand-200 shadow-sm uppercase">
                            {userName.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, exact }) => (
    <NavLink
        to={to}
        end={exact}
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
        }
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default MainLayout;
