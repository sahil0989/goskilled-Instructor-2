import { useEffect, useState } from 'react'
import { CalendarDays, IndianRupee, Newspaper, Wallet2Icon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// eslint-disable-next-line
import { BarChart, Book, LogOut, User, Menu } from 'lucide-react';
// eslint-disable-next-line
import InstructorCourses from '../components/courses';
import { Button } from '../@/components/ui/button';
import { useInstructor } from '../context/instructor-context/InstructorContext';
// eslint-disable-next-line
import AdminPayments from '../components/PaymentComponent';
import AdminKYCPanel from '../components/AdminKYCDashboard';
import AdminUsersPage from '../components/instructor-view';
import BlogDashboard from '../components/blogs section/BlogDashboard';
import MeetingDashboard from '../components/meeting/MeetingDashboard';
import AdminWithdrawals from '../components/WalletWithdraw';

export default function Dashboard() {
    const { user, logout, courses } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line
    const { instructorCoursesList, setInstructorCoursesList } = useInstructor();

    // eslint-disable-next-line
    async function fetchAllCourses() {
        setLoading(true);
        if (courses?.success) {
            setInstructorCoursesList(courses?.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchAllCourses();
        // eslint-disable-next-line
    }, [courses]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/")
        }
    }, [user, navigate]);

    const menuItems = [
    {
        icon: BarChart,
        label: "Dashboard",
        value: "dashboard",
        component: (<AdminUsersPage />),
    },
    {
        icon: Book,
        label: "Courses",
        value: "courses",
        component: loading
            ? <SkeletonLoader />
            : <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
        icon: IndianRupee,
        label: "Payments",
        value: "payments",
        component: <AdminPayments />,
    },
    {
        icon: Newspaper,
        label: "Blogs",
        value: "blogs",
        component: <BlogDashboard />,
    },
    {
        icon: Wallet2Icon,
        label: "Wallet",
        value: "wallet",
        component: <AdminWithdrawals />,
    },
    {
        icon: CalendarDays,
        label: "Meetings",
        value: "meetings",
        component: <MeetingDashboard />,
    },
    {
        icon: User,
        label: "KYC Approval",
        value: "kycpannel",
        component: <AdminKYCPanel />,
    },
    {
        icon: LogOut,
        label: "Logout",
        value: "logout",
        component: null,
    },
];

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`md:w-64 w-full h-[calc(100vh-80px)] bg-white p-4 md:block ${sidebarOpen ? 'block' : 'hidden'
                    } md:relative absolute z-20 shadow-lg`}
            >
                {/* Close Button for Mobile */}
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <h2 className='text-xl font-bold'>Instructor View</h2>
                    <Button variant="ghost" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Heading for Desktop */}
                <h2 className='text-2xl font-bold mb-4 hidden md:block'>Instructor View</h2>

                <nav>
                    {menuItems.map((item) => (
                        <Button
                            key={item.value}
                            onClick={item.value === 'logout' ? logout : () => {
                                setActiveTab(item.value);
                                setSidebarOpen(false);
                            }}
                            variant={activeTab === item.value ? "secondary" : "ghost"}
                            className="w-full justify-start mb-2"
                        >
                            <item.icon className='mr-2 h-4 w-4' />
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </aside>

            {/* Mobile toggle button */}
            <div className="flex items-center justify-between p-4 md:hidden bg-white shadow-sm">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu />
                </Button>
            </div>

            {/* Main content */}
            <main className="flex-1 p-4 overflow-y-auto space-y-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {menuItems.map((item) => (
                        activeTab === item.value && item.component ? (
                            <section key={item.value}>
                                {item.component}
                            </section>
                        ) : null
                    ))}
                </div>
            </main>

        </div>
    );
}

// eslint-disable-next-line
function SkeletonLoader() {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
        </div>
    );
}
