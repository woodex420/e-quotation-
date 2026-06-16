import React, { useState } from 'react';
import { Plus, Search, Download, Eye } from 'lucide-react';

export default function QuotationBuilder() {
  const [quotations] = useState([
    { id: 1, quote: 'WF-10054', date: '31/03/2026', client: 'ahmad', total: 'Rs 165,000', status: 'INVOICED' },
    { id: 2, quote: 'WF-10053', date: '28/03/2026', client: 'nabeel', total: 'Rs 110,000', status: 'INVOICED' },
    { id: 3, quote: 'WF-10052', date: '28/03/2026', client: 'M. ishaq', total: 'Rs 1,302,000', status: 'INVOICED' },
    { id: 4, quote: 'WF-10051', date: '28/03/2026', client: 'Jw Online', total: 'Rs 370,000', status: 'SENT' },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'INVOICED': 'bg-purple-600',
      'SENT': 'bg-blue-600',
      'DRAFT': 'bg-gray-600',
      'APPROVED': 'bg-green-600',
      'REJECTED': 'bg-red-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Quotation Builder</h1>
            <p className="text-gray-400">Create and manage quotations with live PDF preview.</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus size={20} />
            New Quotation
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Quotations</p>
            <p className="text-3xl font-bold">24</p>
          </div>
          <div className="bg-green-900 border border-green-800 rounded-lg p-6">
            <p className="text-gray-300 text-sm mb-2">Total Value</p>
            <p className="text-3xl font-bold">Rs 2.5M</p>
          </div>
          <div className="bg-purple-900 border border-purple-800 rounded-lg p-6">
            <p className="text-gray-300 text-sm mb-2">Conversion Rate</p>
            <p className="text-3xl font-bold">68%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search quotations..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-600"
            />
          </div>
          <button className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Quotations Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-6 py-3 text-left text-sm font-bold">SR</th>
                <th className="px-6 py-3 text-left text-sm font-bold">QUOTE ID</th>
                <th className="px-6 py-3 text-left text-sm font-bold">DATE</th>
                <th className="px-6 py-3 text-left text-sm font-bold">CLIENT</th>
                <th className="px-6 py-3 text-left text-sm font-bold">TOTAL</th>
                <th className="px-6 py-3 text-left text-sm font-bold">STATUS</th>
                <th className="px-6 py-3 text-left text-sm font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {quotations.map((q, idx) => (
                <tr key={q.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{q.quote}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{q.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{q.client}</td>
                  <td className="px-6 py-4 text-sm font-bold text-cyan-400">{q.total}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`${getStatusColor(q.status)} text-white text-xs px-3 py-1 rounded font-medium`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="text-green-400 hover:text-green-300 transition-colors">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
