import PackageChart from "../components/graph components/PackageChart";
import TopReferrersChart from "../components/graph components/TopReferrersChart";
import MeetingChart from "../components/graph components/MeetingChart";
import KYCChart from "../components/graph components/KYCChart";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
    const { data, loading } = useAuth();


    if (loading) return <p className="text-center">Loading...</p>;
    if (!data) return <p className="text-center">No data available</p>;

    // -------------------- Data Mapping --------------------
    const mappedUserPackages = (data.users.userPackages || []).map(p => ({
        name: p._id,
        value: p.count
    }));

    const mappedUserStatus = (data.users.userStatus || []).map(u => ({
        name: u._id,
        value: u.count
    }));

    const mappedTopReferrers = (data.users.topReferrers || []).map(u => ({
        name: u.name,
        referrals: u.level1Count
    }));

    const mappedKYC = Object.entries(data.users.kycSummary || {}).map(
        ([key, value]) => ({
            name: key.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
            value: value
        })
    );

    const walletStats = data.users.walletStats?.[0] || {};

    // -------------------- JSX --------------------
    return (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* USERS */}
            {mappedUserPackages.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-2">User Packages</h2>
                    <PackageChart data={mappedUserPackages} />
                </div>
            )}

            {mappedUserStatus.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow w-full">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>

                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex-1 bg-blue-50 text-blue-600 rounded-xl p-4 flex flex-col items-center justify-center shadow">
                            <p className="text-sm font-medium">Total Users</p>
                            <p className="text-2xl font-bold mt-2">{mappedUserStatus[0]?.value || 0}</p>
                        </div>

                        <div className="flex-1 bg-green-50 text-green-600 rounded-xl p-4 flex flex-col items-center justify-center shadow">
                            <p className="text-sm font-medium">Total Blogs</p>
                            <p className="text-2xl font-bold mt-2">{data.blogs.totalBlogs || 0}</p>
                        </div>

                        {/* <div className="flex-1 bg-red-50 text-red-600 rounded-xl p-4 flex flex-col items-center shadow">
                            <p className="text-sm font-medium">Total Withdrawn</p>
                            <p className="text-2xl font-bold mt-2">₹{walletStats.totalWithdrawn || 0}</p>
                        </div> */}
                    </div>
                </div>
            )}

            {mappedUserStatus.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow w-full">
                    <h2 className="text-lg font-semibold mb-4">Course Summary</h2>

                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex-1 bg-blue-50 text-blue-600 rounded-xl p-4 flex flex-col items-center justify-center shadow">
                            <p className="text-sm font-medium">Total Courses</p>
                            <p className="text-2xl font-bold mt-2">{data?.courses?.totalCourses || 0}</p>
                        </div>

                        <div className="flex-1 bg-green-50 text-green-600 rounded-xl p-4 flex flex-col items-center justify-center shadow">
                            <p className="text-sm font-medium">Live Courses</p>
                            <p className="text-2xl font-bold mt-2">{data?.courses?.liveCourses || 0}</p>
                        </div>

                        <div className="flex-1 bg-red-50 text-red-600 rounded-xl p-4 flex flex-col items-center shadow">
                            <p className="text-sm font-medium">Draft Courses</p>
                            <p className="text-2xl font-bold mt-2">{data?.courses?.draftCourses || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            {mappedTopReferrers.length > 0 ? (
                <div className="bg-white p-4 rounded-2xl shadow xl:col-span-2">
                    <h2 className="text-lg font-semibold mb-2">Top Referrers</h2>
                    <TopReferrersChart data={mappedTopReferrers} />
                </div>
            ) : (
                <p className="text-center text-gray-500 xl:col-span-2">No referrals yet</p>
            )}

            {/* Wallet Stats */}
            {walletStats && (
                <div className="bg-white p-4 rounded-2xl shadow w-full">
                    <h2 className="text-lg font-semibold mb-4">Wallet Summary</h2>

                    <div className="flex flex-col justify-between gap-4">
                        <div className="flex-1 bg-blue-50 text-blue-600 rounded-xl p-4 flex flex-col items-center shadow">
                            <p className="text-sm font-medium">Total Balance</p>
                            <p className="text-2xl font-bold mt-2">₹{walletStats.totalBalance || 0}</p>
                        </div>

                        <div className="flex-1 bg-green-50 text-green-600 rounded-xl p-4 flex flex-col items-center shadow">
                            <p className="text-sm font-medium">Total Earned</p>
                            <p className="text-2xl font-bold mt-2">₹{walletStats.totalEarned || 0}</p>
                        </div>

                        <div className="flex-1 bg-red-50 text-red-600 rounded-xl p-4 flex flex-col items-center shadow">
                            <p className="text-sm font-medium">Total Withdrawn</p>
                            <p className="text-2xl font-bold mt-2">₹{walletStats.totalWithdrawn || 0}</p>
                        </div>
                    </div>
                </div>
            )}


            {/* KYC */}
            {mappedKYC.length > 0 ? (
                <div className="bg-white p-4 rounded-2xl shadow xl:col-span-3">
                    <h2 className="text-lg font-semibold mb-2">KYC Status</h2>
                    <KYCChart data={mappedKYC} />
                </div>
            ) : (
                <p className="text-center text-gray-500">No KYC data</p>
            )}

            {/* MEETINGS */}
            {data.meetings?.registrationsOverTime?.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow xl:col-span-3">
                    <h2 className="text-lg font-semibold mb-2">Meeting Registrations</h2>
                    <MeetingChart data={data.meetings.registrationsOverTime} />
                </div>
            )}

        </div>
    );
}
