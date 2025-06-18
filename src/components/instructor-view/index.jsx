import { useEffect, useState } from "react";
import { Button } from "../../@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

const AdminUsersPage = () => {
    const { leaderboard } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalReferrals, setTotalReferrals] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchUsers = async () => {
        try {
            if (leaderboard) {
                setUsers(leaderboard);
                const total = leaderboard.reduce((acc, user) => acc + (user.totalReferrals || 0), 0);
                setTotalReferrals(total);
                setLoading(false);
            } else {
                setLoading(true);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line 
    }, [leaderboard]);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);

        const sorted = [...users].sort((a, b) => {
            let valA = a[field];
            let valB = b[field];

            if (field === "createdAt") {
                valA = new Date(valA);
                valB = new Date(valB);
            } else {
                valA = typeof valA === "string" ? valA.toLowerCase() : valA || "";
                valB = typeof valB === "string" ? valB.toLowerCase() : valB || "";
            }


            if (valA < valB) return order === "asc" ? -1 : 1;
            if (valA > valB) return order === "asc" ? 1 : -1;
            return 0;
        });

        setUsers(sorted);
        setCurrentPage(1);
    };

    const exportToCSV = () => {
        const headers = ["Name", "Phone Number", "Email", "Total Referrals", "Registered At"];
        const rows = users.map(user => [
            `"${user.name || ""}"`,
            `"${user.mobileNumber || ""}"`,
            `"${user.email || ""}"`,
            `"${user.totalReferrals || 0}"`,
            `"${new Date(user.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })}"`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="p-4 border">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
            </td>
            <td className="p-4 border">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
            </td>
            <td className="p-4 border">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
            </td>
            <td className="p-4 border">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
            </td>
            <td className="p-4 border">
                <div className="h-4 bg-gray-300 rounded w-28"></div>
            </td>
        </tr>
    );

    return (
        <div className="w-full space-y-6">
            {/* Stats Cards */}
            <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <div className="bg-blue-100 md:px-12 py-6 rounded-lg shadow text-center flex flex-col sm:flex-row items-center justify-between">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-2xl mt-2 text-blue-700">{users.length}</p>
                </div>
                <div className="bg-green-100 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between rounded-lg shadow text-center">
                    <h2 className="text-lg font-semibold">Total Referrals</h2>
                    <p className="text-2xl mt-2 text-green-700">{totalReferrals}</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">

                    <h1 className="text-xl sm:text-2xl font-bold">Users Overview</h1>
                    <div className="flex justify-end">
                        <Button
                            onClick={exportToCSV}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg shadow-md transition"
                        >
                            Export to CSV
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                    <table className="min-w-full text-sm text-left">

                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="p-4 border">
                                    <div className="flex items-center gap-2">
                                        Name
                                        <div className="flex w-full justify-between items-center">
                                            <div></div>
                                            <div
                                                onClick={() => handleSort("name")}
                                                className="px-5 py-1 shadow-lg bg-gray-400 rounded-lg text-xl font-bold cursor-pointer"
                                            >
                                                {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                                            </div>
                                        </div>
                                    </div>
                                </th>
                                <th className="p-4 border">Phone Number</th>
                                <th className="p-4 border">Email</th>
                                <th className="p-4 border">
                                    <div className="flex items-center flex-nowrap gap-2">
                                        <span className="flex flex-nowrap w-full">Total Referrals</span>
                                        <div className="flex items-center justify-between w-full">
                                            <div></div>
                                            <div
                                                onClick={() => handleSort("totalReferrals")}
                                                className="px-5 py-1 shadow-lg bg-gray-400 rounded-lg text-xl font-bold"
                                            >
                                                {sortField === "totalReferrals" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                                            </div>
                                        </div>
                                    </div>
                                </th>
                                <th className="p-4 border">
                                    <div className="flex items-center gap-2">
                                        <span className="flex flex-nowrap w-full">Registered At</span>
                                        <div className="flex items-center justify-between w-full">
                                            <div></div>
                                            <div
                                                onClick={() => handleSort("createdAt")}
                                                className="px-5 py-1 shadow-lg bg-gray-400 rounded-lg text-xl font-bold cursor-pointer"
                                            >
                                                {sortField === "createdAt" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                                            </div>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {loading
                                ? Array.from({ length: usersPerPage }).map((_, i) => <SkeletonRow key={i} />)
                                : currentUsers.map((user) => (
                                    <tr key={user._id} className="border-t">
                                        <td className="p-4 border">{user.name}</td>
                                        <td className="p-4 border">{user.mobileNumber}</td>
                                        <td className="p-4 border">{user.email}</td>
                                        <td className="p-4 border">{user.totalReferrals || 0}</td>
                                        <td className="p-4 border">
                                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
