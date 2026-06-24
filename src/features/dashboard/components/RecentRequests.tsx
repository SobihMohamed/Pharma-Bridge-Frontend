import { Link } from 'react-router-dom';
import { Pill, ChevronRight } from 'lucide-react';

export default function RecentRequests() {
  const requests = [
    {
      id: 'REQ-8490',
      medication: 'Atorvastatin 10mg Tablet',
      status: 'Has Bids',
      date: 'Oct 12, 2023',
      bidsCount: 3,
    },
    // Adding a second mock one to make the table look realistic
    {
      id: 'REQ-8488',
      medication: 'Metformin 500mg',
      status: 'Completed',
      date: 'Oct 10, 2023',
      bidsCount: 1,
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-gray-900">Recent Requests</h2>
        <Link to="/requests" className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
          View All
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start text-gray-500">
          <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium text-start">Medication</th>
              <th scope="col" className="px-5 py-3 font-medium text-start">Status</th>
              <th scope="col" className="px-5 py-3 font-medium text-start">Date</th>
              <th scope="col" className="px-5 py-3 font-medium text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Pill className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{req.medication}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{req.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    req.status === 'Has Bids' 
                      ? 'bg-teal-100 text-teal-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {req.status}
                    {req.bidsCount > 0 && req.status === 'Has Bids' && ` (${req.bidsCount})`}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {req.date}
                </td>
                <td className="px-5 py-4 text-end">
                  <Link 
                    to={`/requests/${req.id}`} 
                    className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
