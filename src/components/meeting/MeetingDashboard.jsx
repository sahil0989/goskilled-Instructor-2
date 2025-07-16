import { useEffect, useState } from "react";
import { getMeetings, deleteMeeting, getParticipantsData } from "./meetingService";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const MeetingDashboard = () => {
    const [meetings, setMeetings] = useState([]);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const res = await getMeetings();
            setMeetings(res.data);
        } catch (err) {
            toast.error("Failed to fetch meetings");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this meeting?")) {
            try {
                setDeletingId(id);
                await deleteMeeting(id);
                toast.success("Meeting deleted successfully");
                setMeetings((prev) => prev.filter((m) => m._id !== id));
            } catch (err) {
                toast.error("Failed to delete meeting");
                console.error(err);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const convertTo12HourFormat = (time24) => {
        const [hours, minutes] = time24.split(':');
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const fetchParticipantsData = async (id) => {
        try {
            const info = await getParticipantsData(id);
            if (info.success) {
                setUserData(info.data);
                setShowModal(true);
            }
        } catch (error) {
            toast.error("Failed to fetch participants");
        }
    };

    const filteredData = userData.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.phone.toLowerCase().includes(query) ||
            user.referralCode.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleExportCSV = () => {
        const headers = ["S.No.", "Name", "Email", "Phone"];
        const rows = filteredData.map((user, index) => [
            index + 1,
            user.name,
            user.email,
            user.phone
        ]);

        const csvContent =
            [headers, ...rows]
                .map((row) => row.join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "participants.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl md:text-2xl font-bold">Meeting Admin Panel</h1>
                    <Link
                        to="/admin/meetings/new"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-2 rounded-lg font-medium text-sm"
                    >
                        + New Meeting
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading meetings...</div>
                ) : meetings.length === 0 ? (
                    <div className="text-center text-gray-500">No meetings found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {meetings.map((meeting) => (
                            <div
                                key={meeting._id}
                                className="border border-gray-300 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition"
                            >
                                {meeting.image && (
                                    <img
                                        src={meeting.image}
                                        alt="Meeting"
                                        className="h-40 w-full object-cover rounded mb-3"
                                    />
                                )}
                                <h2 className="text-lg font-semibold line-clamp-2">{meeting.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-3">{meeting.description}</p>
                                <p className="text-sm mt-2 text-gray-500 italic">Hosted by {meeting?.host || "GoSkilled"}</p>
                                <p className="text-xs text-gray-400 mt-1"><span>{convertTo12HourFormat(meeting.time)}</span> at {meeting.date}</p>

                                <div className="flex gap-3 mt-4">
                                    <Link
                                        to={`/admin/meetings/edit/${meeting._id}`}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(meeting._id)}
                                        disabled={deletingId === meeting._id}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                    >
                                        {deletingId === meeting._id ? "Deleting..." : "Delete"}
                                    </button>
                                    <button
                                        onClick={() => fetchParticipantsData(meeting._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                                        View participants
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-3 hover:text-black text-xl bg-red-700 hover:bg-red-900 px-2 rounded-lg text-white"
                        >
                            &times;
                        </button>
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-4">
                            <h2 className="text-xl font-semibold">Participants</h2>
                            <div className="flex gap-2 w-full sm:w-auto mr-8">
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 px-3 py-1 rounded w-full sm:w-64"
                                />
                                <button
                                    onClick={handleExportCSV}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                >
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {filteredData.length === 0 ? (
                            <p className="text-gray-600">No participants found.</p>
                        ) : (
                            <>
                                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                                    <table className="min-w-full table-auto border-collapse">
                                        <thead>
                                            <tr className="bg-gray-200 text-left">
                                                <th className="p-2 border">S.No.</th>
                                                <th className="p-2 border">Name</th>
                                                <th className="p-2 border">Email</th>
                                                <th className="p-2 border">Phone</th>
                                                <th className="p-2 border">Registered At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((user, index) => (
                                                <tr key={user._id} className="hover:bg-gray-50">
                                                    <td className="p-2 border">{(currentPage - 1) * pageSize + index + 1}</td>
                                                    <td className="p-2 border">{user.name}</td>
                                                    <td className="p-2 border">{user.email}</td>
                                                    <td className="p-2 border">{user.phone}</td>
                                                    <td className="p-2 border">
                                                        {user.registeredAt
                                                            ? new Date(user.registeredAt).toLocaleString("en-IN", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })
                                                            : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-between items-center mt-4 text-sm">
                                    <p className="text-gray-600">
                                        Showing {paginatedData.length} of {filteredData.length} entries
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <span className="px-2 pt-1">{currentPage} / {totalPages}</span>
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MeetingDashboard;
