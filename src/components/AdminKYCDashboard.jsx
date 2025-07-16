import { useEffect, useState } from 'react';
import axios from 'axios';
import { Delete, Edit } from 'lucide-react';

export default function AdminKYCPanel() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [selectedDoc, setSelectedDoc] = useState({ url: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalData, setEditModalData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/kyc-submissions`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching KYC submissions:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveKYC = async (userId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/approve/${userId}`);
      fetchData();
    } catch (err) {
      console.error('Error approving KYC:', err);
    }
  };

  const rejectKYC = async (userId, reason) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/reject/${userId}`, { reason });
      fetchData();
    } catch (err) {
      console.error('Error rejecting KYC:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this KYC submission?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/kyc-delete/${userId}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting KYC:', err);
    }
  };

  const handleEditSubmit = async (updatedDetails) => {
    try {
      console.log("edit ", editModalData._id)
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/admin/kyc-edit/${editModalData._id}`, updatedDetails);
      fetchData();
      closeEditModal();
    } catch (err) {
      console.error('Error updating KYC:', err);
    }
  };

  const handleApprove = (id) => approveKYC(id);

  const handleReject = (id) => {
    const reason = rejectionReasons[id] || '';
    if (!reason.trim()) return alert('Please enter a rejection reason.');
    rejectKYC(id, reason);
  };

  const openEditModal = (user) => setEditModalData(user);
  const closeEditModal = () => setEditModalData(null);

  const handleDocumentView = (url) => {
    if (!url) return;
    const isPDF = url.toLowerCase().endsWith('.pdf');
    setSelectedDoc({ url, type: isPDF ? 'pdf' : 'image' });
  };

  const filteredUsers = users.filter((user) => {
    const status = user.kycStatus?.toLowerCase() || 'pending';
    const matchesStatus = filter === 'all' || status === filter;
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobileNumber?.includes(searchQuery) ||
      user.referralCode?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Admin Dashboard – KYC Panel</h1>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1 rounded-md border text-sm font-medium ${filter === status ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-100'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by UniqueId, name, email, or mobile"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-64"
        />
      </div>

      {/* Table */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2 text-left">User Info</th>
                <th className="px-3 py-2 text-left">UniqueId</th>
                <th className="px-3 py-2 text-left">Document Details</th>
                <th className="px-3 py-2 text-left">Bank Details</th>
                <th className="px-3 py-2 text-left">Documents</th>
                {filter === 'rejected' && <th className="px-3 py-2">Rejection Reason</th>}
                <th className="px-3 py-2 text-left">Actions</th>
                <th className="px-3 py-2 text-left">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => {
                const details = user.kycDetails || {};
                return (
                  <tr key={user._id} className="bg-white hover:bg-gray-50">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 text-left">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-600">{user.mobileNumber}</p>
                      <p className="text-gray-600"><b>WhatsApp: </b> {details.whatsAppNumber}</p>
                      <span className="text-xs font-semibold text-blue-600 capitalize">
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2">{user.referralCode}</td>
                    <td className="px-3 py-2 text-left text-xs leading-5">
                      <p><b>Document Type:</b> {details.documentType}</p>
                      <p><b>Document Number:</b> {details.documentNumber}</p>
                      <p><b>PAN Number:</b> {details.panNumber}</p>
                      <p><b>UPI ID:</b> {details.upiId}</p>
                    </td>
                    <td className="px-3 py-2 text-left text-xs leading-5">
                      <p><b>Account Holder:</b> {details.accountHolderName}</p>
                      <p><b>Bank Name:</b> {details.bankName}</p>
                      <p><b>Account Number:</b> {details.accountNumber}</p>
                      <p><b>IFSC Code:</b> {details.ifscCode}</p>
                    </td>
                    <td className="px-3 py-2 text-left space-y-1">
                      <button onClick={() => handleDocumentView(details.addressProofDocument)} className="text-blue-600 underline">Document</button><br />
                      <button onClick={() => handleDocumentView(details.panCard)} className="text-blue-600 underline">PAN Card</button><br />
                      <button onClick={() => handleDocumentView(details.bankDocument)} className="text-blue-600 underline">Bank Doc</button>
                    </td>
                    {filter === 'rejected' && (
                      <td className="px-3 py-2 text-red-600">{details.rejectionReason}</td>
                    )}
                    <td className="px-3 py-2 space-y-2 text-left">
                      {(user.kycStatus?.toLowerCase() === 'pending') ? (
                        <>
                          <textarea
                            placeholder="Rejection reason"
                            value={rejectionReasons[user._id] || ''}
                            onChange={(e) =>
                              setRejectionReasons({
                                ...rejectionReasons,
                                [user._id]: e.target.value,
                              })
                            }
                            className="w-full border px-2 py-1 rounded text-xs"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleApprove(user._id)}
                              className="bg-green-600 text-white py-1 px-2 rounded text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(user._id)}
                              className="bg-red-600 text-white py-1 px-2 rounded text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500 text-xs">No action needed</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-3 items-center">
                        <Edit
                          className="cursor-pointer text-blue-600"
                          onClick={() => openEditModal(user)}
                        />
                        <Delete
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDelete(user._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No {filter === 'all' ? '' : filter} KYC submissions found.
        </p>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc.url && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDoc({ url: '', type: '' })}
              className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Document Viewer</h2>
            {selectedDoc.type === 'pdf' ? (
              <embed src={selectedDoc.url} type="application/pdf" className="w-full h-[75vh] border" />
            ) : (
              <img src={selectedDoc.url} alt="Document" className="w-full max-h-[75vh] object-contain border rounded" />
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit KYC Details for <span className="text-blue-600">{editModalData.name}</span></h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const updatedDetails = {
                  whatsAppNumber: form.whatsAppNumber.value,
                  documentType: form.documentType.value,
                  documentNumber: form.documentNumber.value,
                  panNumber: form.panNumber.value,
                  upiId: form.upiId.value,
                  accountHolderName: form.accountHolderName.value,
                  bankName: form.bankName.value,
                  accountNumber: form.accountNumber.value,
                  ifscCode: form.ifscCode.value,
                };
                handleEditSubmit(updatedDetails);
              }}
              className="grid gap-4"
            >
              {/* WhatsApp & Document */}
              <div>
                <label className="block text-sm font-medium">WhatsApp Number</label>
                <input type="text" name="whatsAppNumber" defaultValue={editModalData.kycDetails?.whatsAppNumber} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Document Type</label>
                <input type="text" name="documentType" defaultValue={editModalData.kycDetails?.documentType} className="w-full border p-2 rounded" />
              </div>

              {/* Document Info */}
              <div>
                <label className="block text-sm font-medium">Document Number</label>
                <input type="text" name="documentNumber" defaultValue={editModalData.kycDetails?.documentNumber} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">PAN Number</label>
                <input type="text" name="panNumber" defaultValue={editModalData.kycDetails?.panNumber} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">UPI ID</label>
                <input type="text" name="upiId" defaultValue={editModalData.kycDetails?.upiId} className="w-full border p-2 rounded" />
              </div>

              {/* Bank Info */}
              <div>
                <label className="block text-sm font-medium">Account Holder Name</label>
                <input type="text" name="accountHolderName" defaultValue={editModalData.kycDetails?.accountHolderName} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Bank Name</label>
                <input type="text" name="bankName" defaultValue={editModalData.kycDetails?.bankName} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Account Number</label>
                <input type="text" name="accountNumber" defaultValue={editModalData.kycDetails?.accountNumber} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">IFSC Code</label>
                <input type="text" name="ifscCode" defaultValue={editModalData.kycDetails?.ifscCode} className="w-full border p-2 rounded" />
              </div>

              {/* Optional Rejection Reason (readonly) */}
              {editModalData.kycDetails?.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-red-600">Rejection Reason</label>
                  <textarea
                    className="w-full border p-2 rounded bg-gray-100"
                    value={editModalData.kycDetails.rejectionReason}
                    readOnly
                  />
                </div>
              )}

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
