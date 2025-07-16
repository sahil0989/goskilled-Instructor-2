import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPayments = async (status = "all") => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/payment/requests?status=${status}`
      );
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (err) {
      console.error("Error fetching payments", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(filterStatus);
  }, [filterStatus]);

  const handleVerification = async (id, status) => {
    const adminNote = prompt(`Add a note for this ${status} action:`) || "";
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/payment/verify/${id}`,
        { status, adminNote }
      );
      fetchPayments(filterStatus);
    } catch (err) {
      console.error("Error verifying payment", err);
    }
  };

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setFilterStatus(value)}
      className={`px-4 py-1 rounded-md border transition duration-200 ${
        filterStatus === value
          ? "bg-blue-600 text-white"
          : "bg-white hover:bg-blue-100"
      }`}
    >
      {label}
    </button>
  );

  // Search filter logic
  const filteredPayments = payments.filter((payment) => {
    const query = searchQuery.toLowerCase();
    const name = payment.user?.name?.toLowerCase() || "";
    const email = payment.user?.email?.toLowerCase() || "";
    const courseTitle = Array.isArray(payment.course)
      ? payment.course.map((c) => c.title).join(", ").toLowerCase()
      : payment.course?.title?.toLowerCase() || "";
    return (
      name.includes(query) ||
      email.includes(query) ||
      courseTitle.includes(query)
    );
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Payment Verification Panel</h1>

      {/* Filter + Search */}
      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex gap-2 flex-wrap">
          <FilterButton label="All" value="all" />
          <FilterButton label="Pending" value="pending" />
          <FilterButton label="Approved" value="approved" />
          <FilterButton label="Rejected" value="rejected" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or course"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-64"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredPayments.length === 0 ? (
        <p>No payment requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Course Type</th>
                <th className="px-4 py-2">Amount Paid</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Submitted At</th>
                <th className="px-4 py-2">Screenshot</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment, index) => (
                <tr key={payment._id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{payment.user?.name || "N/A"}</td>
                  <td className="px-4 py-2">{payment.user?.email || "N/A"}</td>
                  <td className="px-4 py-2">
                    {Array.isArray(payment.course) ? (
                      payment.course.map((c) => <p key={c.title}>{c.title}</p>)
                    ) : (
                      payment.course?.title || "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {payment.courseType === "skill"
                      ? "Skill Builder"
                      : payment.courseType === "career"
                      ? "Career Booster"
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">₹{payment.amountPaid}</td>
                  <td
                    className={`px-4 py-2 font-bold capitalize ${
                      payment.status === "approved"
                        ? "text-green-600"
                        : payment.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {payment.status}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(payment.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setFullscreenImage(payment.screenshot)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Document
                    </button>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {payment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleVerification(payment._id, "approved")
                          }
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleVerification(payment._id, "rejected")
                          }
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FULLSCREEN IMAGE PREVIEW */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Full Screen Payment Screenshot"
            className="max-w-full max-h-full object-contain rounded"
          />
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-5 right-5 text-white bg-red-500 rounded-full p-2"
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;