import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';

export default function AdminKYCPanel() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [selectedDoc, setSelectedDoc] = useState({ url: '', type: '' });

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

  const handleApprove = (id) => {
    approveKYC(id);
  };

  const handleReject = (id) => {
    const reason = rejectionReasons[id] || '';
    if (!reason.trim()) {
      return alert('Please enter a rejection reason.');
    }
    rejectKYC(id, reason);
  };

  const filteredUsers = users.filter(user => {
    const status = user.kycStatus?.toLowerCase() || 'pending';
    return status === filter;
  });

  const handleDocumentView = (url) => {
    if (!url) return;
    const isPDF = url.toLowerCase().endsWith('.pdf');
    setSelectedDoc({ url, type: isPDF ? 'pdf' : 'image' });
  };

  const closeModal = () => {
    setSelectedDoc({ url: '', type: '' });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Admin Dashboard - KYC Panel</h1>

      {/* Filter Tabs */}
      <div className="flex flex-nowrap justify-center gap-3 mb-8">
        {['pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition 
              ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* User Cards */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredUsers.map((user) => {
            const details = user.kycDetails || {};
            return (
              <div key={user._id} className="bg-white p-5 rounded-xl shadow-md border flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 gap-4 sm:gap-0">
                  <div className='flex gap-3 items-center flex-wrap'>
                    <User className="text-gray-600" />
                    <div>
                      <h2 className="text-lg font-semibold">{user.name}</h2>
                      <p className="text-sm text-gray-600">{user.mobileNumber}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`font-semibold text-sm capitalize px-3 py-1 rounded-md
                      ${filter === 'pending' ? 'bg-yellow-400 text-yellow-900' : filter === 'approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      Status: {user.kycStatus}
                    </span>
                  </div>
                </div>

                {filter === 'rejected' && (
                  <div className='border rounded-md mb-4 p-3 bg-red-600/20'>
                    <p className='text-sm'><strong className='text-base'>Reason: </strong>{details.rejectionReason}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                  <p><strong>Document Type:</strong> {details.documentType}</p>
                  <p><strong>Document Number:</strong> {details.documentNumber}</p>
                  <p><strong>PanCard Number:</strong> {details.panNumber}</p>
                  <p><strong>UPI ID:</strong> {details.upiId}</p>
                </div>

                <strong className='underline'>User Bank Details: </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 my-4">
                  <p><strong>Account Holder Name:</strong> {details.accountHolderName}</p>
                  <p><strong>Bank Name:</strong> {details.bankName}</p>
                  <p><strong>Account Number:</strong> {details.accountNumber}</p>
                  <p><strong>IFSC Code:</strong> {details.ifscCode}</p>
                </div>

                <strong className='underline'>User Documents: </strong>
                <div className="space-y-4 mt-2 text-sm text-left">
                  {/* address document */}
                  <div className="flex justify-between items-center">
                    <strong>Address Document:</strong>
                    <button
                      onClick={() => handleDocumentView(details.addressProofDocument)}
                      className="text-blue-600 underline whitespace-nowrap"
                    >
                      View Address Doc
                    </button>
                  </div>

                  {/* Pancard document  */}
                  <div className="flex justify-between items-center">
                    <strong>PanCard Document:</strong>
                    <button
                      onClick={() => handleDocumentView(details.panCard)}
                      className="text-blue-600 underline whitespace-nowrap"
                    >
                      View PAN Card
                    </button>
                  </div>

                  {/* Bank document  */}
                  <div className="flex justify-between items-center">
                    <strong>Bank Document:</strong>
                    <button
                      onClick={() => handleDocumentView(details.bankDocument)}
                      className="text-blue-600 underline whitespace-nowrap"
                    >
                      View Bank Doc
                    </button>
                  </div>
                </div>

                {filter === 'pending' && (
                  <div className="space-y-3 mt-5">
                    <textarea
                      placeholder="Enter rejection reason"
                      value={rejectionReasons[user._id] || ''}
                      onChange={(e) =>
                        setRejectionReasons({ ...rejectionReasons, [user._id]: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded resize-none min-h-[80px]"
                      rows={3}
                    />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="bg-green-700 text-white px-4 py-2 rounded w-full"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(user._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded w-full"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No {filter} KYC submissions found.</p>
      )}

      {/* Modal Viewer */}
      {selectedDoc.url && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-xl font-bold text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Document Viewer</h2>

            {selectedDoc.type === 'pdf' ? (
              <embed
                src={selectedDoc.url}
                type="application/pdf"
                className="w-full h-[75vh] border"
              />
            ) : (
              <img
                src={selectedDoc.url}
                alt="Document"
                className="w-full max-h-[75vh] object-contain border rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
