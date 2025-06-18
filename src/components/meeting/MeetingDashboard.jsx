import { useEffect, useState } from "react";
import { getMeetings, deleteMeeting } from "./meetingService";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const MeetingDashboard = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

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

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meeting Admin Panel</h1>
                <Link
                    to="/admin/meetings/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
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
                            <p className="text-sm mt-2 text-gray-500 italic">Hosted by {meeting.host}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(meeting.dateTime).toLocaleString()}
                            </p>

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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeetingDashboard;
