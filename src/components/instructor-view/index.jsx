import { useEffect, useState } from "react";
import { Button } from "../../@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminUsersPage = () => {
  const { leaderboard, fetchUserLeaderboard } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      fetchUserLeaderboard()
    }
    // eslint-disable-next-line
  }, [navigate]);

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (leaderboard) {
        console.log(leaderboard)
        setUsers(leaderboard);
        const total = leaderboard.reduce((acc, user) => acc + (user.totalReferrals || 0), 0);
        setTotalReferrals(total);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
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
    const headers = ["Name", "Phone Number", "Email", "Unique Code", "Wallet Balance", "Total Earnings", "Direct Referrals", "Registered At"];
    const rows = users.map(user => [
      `"${user.name || ""}"`,
      `"${user.mobileNumber || ""}"`,
      `"${user.uniqueCode || ""}"`,
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

  // Filter users before pagination
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobileNumber?.includes(query) ||
      user.uniqueCode?.toLowerCase().includes(query)
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const SkeletonRow = () => (
    <tr className="border-t">
      {Array(5).fill(0).map((_, i) => (
        <td key={i} className="p-4 border">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="w-full space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
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

      {/* Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Users Overview</h1>

          <div className="flex gap-4">
            <Button onClick={() => { setUsersPerPage(10); setCurrentPage(1); toast.success("10 user per page"); }} className={`${usersPerPage === 10 ? "bg-green-700" : ""} shadow-lg`}>10</Button>
            <Button onClick={() => { setUsersPerPage(50); setCurrentPage(1); toast.success("50 user per page"); }} className={`${usersPerPage === 50 ? "bg-green-700" : ""} shadow-lg`}>50</Button>
            <Button onClick={() => { setUsersPerPage(100); setCurrentPage(1); toast.success("100 user per page"); }} className={`${usersPerPage === 100 ? "bg-green-700" : ""} shadow-lg`}>100</Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search unique code, name, email and phone"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-md w-full sm:w-64"
            />
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
                <th className="p-4 border">S. No</th>
                <th className="p-4 border">
                  <div className="flex items-center gap-2">
                    Name
                    <div
                      onClick={() => handleSort("name")}
                      className="px-2 cursor-pointer text-xl font-bold"
                    >
                      {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                    </div>
                  </div>
                </th>
                <th className="p-4 border">Unique Code</th>
                <th className="p-4 border">Phone Number</th>
                <th className="p-4 border">Email</th>
                <th className="p-4 border">Total Balance</th>
                <th className="p-4 border">Total Earning</th>
                <th className="p-4 border">
                  <div className="flex items-center gap-2">
                    Level 1 Referrals
                    <div
                      onClick={() => handleSort("totalReferrals")}
                      className="px-2 cursor-pointer text-xl font-bold"
                    >
                      {sortField === "totalReferrals" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                    </div>
                  </div>
                </th>
                <th className="p-4 border">Level 2 Referrals</th>
                <th className="p-4 border">Level 3 Referrals</th>
                <th className="p-4 border">
                  <div className="flex items-center gap-2">
                    Registered At
                    <div
                      onClick={() => handleSort("createdAt")}
                      className="px-2 cursor-pointer text-xl font-bold"
                    >
                      {sortField === "createdAt" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className={`bg-white ${loading ? "animate-pulse" : ""}`}>
              {loading
                ? Array.from({ length: usersPerPage }).map((_, i) => <SkeletonRow key={i} />)
                : currentUsers.map((user, idx) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-4 border">{indexOfFirstUser + idx + 1}</td>
                    <td className="p-4 border">{user.name}</td>
                    <td className="p-4 border">{user.uniqueCode || "—"}</td> {/* Unique Code */}
                    <td className="p-4 border">{user.mobileNumber}</td>
                    <td className="p-4 border">{user.email}</td>
                    <td className="p-4 border">{user.wallet?.balance}</td>
                    <td className="p-4 border">{user.wallet?.totalEarned}</td>
                    <td className="p-4 border">{user.level1_referrals}</td>
                    <td className="p-4 border">{user.level2_referrals}</td>
                    <td className="p-4 border">{user.level3_referrals}</td>
                    <td className="p-4 border">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
