import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { fetchAllWithdrawals, fetchUserKYCService } from '../services';

export default function AdminWithdrawals() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all withdrawal requests with user info
    const fetchWithdrawals = async () => {
        try {
            const data = await fetchAllWithdrawals();
            console.log(data)
            setWithdrawals(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFetchUserKYC = async (userId) => {
        if (!userId) {
            alert('User details not available');
            return;
        }
        try {
            const data = await fetchUserKYCService(userId);  // ✅ Correct usage
            setSelectedUser(data);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error fetching user KYC:', err);
            setSelectedUser(null);
        }
    };


    // Update withdrawal status (approve or reject)
    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/wallet/status/${id}`, { status });
            fetchWithdrawals();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Withdrawal Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Requested At</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.map(w => {
                            const user = w.userId;
                            const isPaid = w.status === 'Paid';

                            return (
                                <tr key={w._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">₹{w.amount}</td>
                                    <td
                                        className={`px-4 py-2 ${user ? "text-blue-600 cursor-pointer underline" : "text-gray-400"}`}
                                        onClick={() => user && handleFetchUserKYC(user._id)}
                                        title={user ? "View KYC Details" : "User details not available"}
                                    >
                                        {user ? user.name : "Unknown User"}
                                    </td>
                                    <td className="px-4 py-2">{user.email || "-"}</td>
                                    <td className="px-4 py-2">{user.mobileNumber}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`inline-block px-2 py-1 text-xs rounded font-semibold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {w.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{new Date(w.requestedAt).toLocaleString()}</td>

                                    {/* Conditionally render actions */}
                                    <td className="px-4 py-2 space-x-2">
                                        {!isPaid && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(w._id, 'Paid')}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* KYC Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg">
                        <Dialog.Title className="text-lg font-bold mb-2">User KYC Details</Dialog.Title>
                        {selectedUser ? (
                            <div className="space-y-2 max-h-96 overflow-auto">
                                <p><strong>Name:</strong> {selectedUser.name}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Phone:</strong> {selectedUser.mobileNumber || selectedUser.phone}</p>
                                <p><strong>KYC Status:</strong> {selectedUser.kycStatus || 'N/A'}</p>
                                {/* Render any other KYC related fields here */}
                                {selectedUser?.kycDetails && (
                                    <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto space-y-6">
                                        <h3 className="text-xl font-semibold border-b pb-2">KYC Details</h3>

                                        {/* User Basic Info */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                            <div>
                                                <p className="text-gray-700"><span className="font-semibold">WhatsApp Number:</span> {selectedUser.kycDetails.whatsAppNumber || '-'}</p>
                                                <p className="text-gray-700"><span className="font-semibold">Document Type:</span> {selectedUser.kycDetails.documentType || '-'}</p>
                                                <p className="text-gray-700"><span className="font-semibold">Document Number:</span> {selectedUser.kycDetails.documentNumber || '-'}</p>
                                                <p className="text-gray-700"><span className="font-semibold">PAN Number:</span> {selectedUser.kycDetails.panNumber || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-700"><span className="font-semibold">Submitted On:</span> {selectedUser.kycDetails.submissionDate ? new Date(selectedUser.kycDetails.submissionDate).toLocaleDateString() : '-'}</p>
                                                {selectedUser.kycDetails.approvalDate && (
                                                    <p className="text-gray-700"><span className="font-semibold">Approved On:</span> {new Date(selectedUser.kycDetails.approvalDate).toLocaleDateString()}</p>
                                                )}
                                                {selectedUser.kycDetails.rejectionReason && (
                                                    <p className="text-red-600 font-semibold mt-2">Rejection Reason: {selectedUser.kycDetails.rejectionReason}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bank Info */}
                                        <div>
                                            <h4 className="text-lg font-semibold mb-2 underline">Bank Details</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                                                <p><span className="font-semibold">Account Holder:</span> {selectedUser.kycDetails.accountHolderName || '-'}</p>
                                                <p><span className="font-semibold">Bank Name:</span> {selectedUser.kycDetails.bankName || '-'}</p>
                                                <p><span className="font-semibold">Account Number:</span> {selectedUser.kycDetails.accountNumber || '-'}</p>
                                                <p><span className="font-semibold">IFSC Code:</span> {selectedUser.kycDetails.ifscCode || '-'}</p>
                                                <p className="sm:col-span-2"><span className="font-semibold">UPI ID:</span> {selectedUser.kycDetails.upiId || '-'}</p>
                                            </div>
                                        </div>

                                        {/* Document View Buttons */}
                                        <div>
                                            <h4 className="text-lg font-semibold mb-3 underline">Documents</h4>
                                            <div className="flex flex-col gap-3">
                                                {selectedUser.kycDetails.addressProofDocument && (
                                                    <button
                                                        onClick={() => window.open(selectedUser.kycDetails.addressProofDocument, '_blank')}
                                                        className="text-blue-600 underline text-left"
                                                    >
                                                        View Address Proof Document
                                                    </button>
                                                )}
                                                {selectedUser.kycDetails.panCard && (
                                                    <button
                                                        onClick={() => window.open(selectedUser.kycDetails.panCard, '_blank')}
                                                        className="text-blue-600 underline text-left"
                                                    >
                                                        View PAN Card Document
                                                    </button>
                                                )}
                                                {selectedUser.kycDetails.bankDocument && (
                                                    <button
                                                        onClick={() => window.open(selectedUser.kycDetails.bankDocument, '_blank')}
                                                        className="text-blue-600 underline text-left"
                                                    >
                                                        View Bank Document
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                        <button
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </button>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
