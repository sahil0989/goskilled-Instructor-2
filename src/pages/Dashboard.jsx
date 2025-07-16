import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Button } from '../@/components/ui/button';
import { CalendarDays, IndianRupee, Newspaper, Wallet2Icon, LogOut, User, BarChart, Book, Menu, X, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/");
        }
    }, [navigate]);

    const menuItems = [
        { icon: BarChart, label: "Dashboard", path: "/dashboard" },
        { icon: Users, label: "Users", path: "/dashboard/users" },
        { icon: Book, label: "Courses", path: "/dashboard/courses" },
        { icon: IndianRupee, label: "Payments", path: "/dashboard/payments" },
        { icon: Newspaper, label: "Blogs", path: "/dashboard/blogs" },
        { icon: Wallet2Icon, label: "Wallet", path: "/dashboard/wallet" },
        { icon: CalendarDays, label: "Meetings", path: "/dashboard/meetings" },
        { icon: User, label: "KYC Approval", path: "/dashboard/kyc" },
        { icon: LogOut, label: "Logout", action: logout },
    ];

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-100">
            {/* Sidebar */}
            <aside className={`md:w-64 w-full bg-white p-4 md:block ${sidebarOpen ? 'block' : 'hidden'} md:relative absolute z-20 shadow-lg`}>
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <h2 className='text-xl font-bold'>Instructor View</h2>
                    <Button variant="ghost" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></Button>
                </div>
                <h2 className='text-2xl font-bold mb-4 hidden md:block'>Instructor View</h2>

                <nav>
                    {menuItems.map((item, idx) => (
                        <div key={idx} className="mb-2">
                            {item.path ? (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 w-full px-4 py-2 rounded ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'}`
                                    }
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </NavLink>
                            ) : (
                                <Button onClick={item.action} variant="ghost" className="w-full justify-start">
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Button>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 md:hidden bg-white shadow-sm">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu />
                </Button>
            </div>

            {/* Main content */}
            <main className="flex-1 p-4 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
