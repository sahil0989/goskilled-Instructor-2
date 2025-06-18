import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [fullscreenImage, setFullscreenImage] = useState(null);

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
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/payment/verify/${id}`, {
        status,
        adminNote,
      });
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

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-4">🧾 Payment Verification Panel</h1>

      {/* Filter Buttons */}
      <div className="mb-6 text-sm flex flex-nowrap gap-1 md:gap-3">
        <FilterButton label="All" value="all" />
        <FilterButton label="Pending" value="pending" />
        <FilterButton label="Approved" value="approved" />
        <FilterButton label="Rejected" value="rejected" />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payment requests found.</p>
      ) : (
        <div className="grid gap-6">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="p-4 border rounded-lg shadow-sm bg-white flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <img
                src={payment.screenshot}
                alt="Payment Screenshot"
                className="w-full max-w-xs sm:w-40 h-auto rounded border cursor-pointer object-cover"
                onClick={() => setFullscreenImage(payment.screenshot)}
              />

              <div className="flex-1 w-full">
                <p>
                  👤 <b>{payment.user?.name}</b>
                </p>
                <p>📧 {payment.user?.email}</p>
                {payment?.courseType ? (
                  payment.courseType === "skill" ? (
                    <h2 className="font-bold">Course Type: Skill Builder</h2>
                  ) : (
                    <h2 className="font-bold">Course Type: Career Booster</h2>
                  )
                ) : (
                  <div></div>
                )}
                <h2 className="font-semibold text-lg">
                  {payment.course?.title || "Course"}
                </h2>
                <div className="mt-1">
                  {Array.isArray(payment.course) ? (
                    payment.course.map((c, i) => <p key={i}>📘 {c.title}</p>)
                  ) : (
                    <p>📘 {payment.course?.title || "Course"}</p>
                  )}
                </div>

                <p className="font-bold">💰 Amount Paid: ₹{payment.amountPaid}</p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <b
                    className={`capitalize ${
                      payment.status === "approved"
                        ? "text-green-600"
                        : payment.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {payment.status}
                  </b>
                </p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(payment.submittedAt).toLocaleString()}
                </p>

                <div className="mt-3 flex gap-3 flex-wrap">
                  {payment.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleVerification(payment._id, "approved")}
                        className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerification(payment._id, "rejected")}
                        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
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
