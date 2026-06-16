import React, { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';

export default function Invoices() {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const invoiceStats = [
    { label: 'TOTAL REVENUE', value: 'Rs 1,098,250', color: 'bg-gray-800' },
    { label: 'PAID', value: 'Rs 288,250', color: 'bg-green-900' },
    { label: 'BALANCE DUE', value: 'Rs 810,000', color: 'bg-blue-900' },
  ];

  const statusFilters = ['ALL', 'DUE', 'PAID', 'PARTIALLY PAYMENT', 'AFTER DELIVERY'];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PAID': 'bg-green-600',
      'DUE': 'bg-orange-600',
      'UNPAID': 'bg-red-600',
      'PARTIALLY PAID': 'bg-yellow-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Invoice System</h1>
            <p className="text-gray-400">Track payments, balances, and delivery status.</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Create Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {invoiceStats.map((stat, idx) => (
            <div key={idx} className={`${stat.color} border border-gray-700 rounded-lg p-8 text-center`}>
              <p className="text-gray-300 text-sm mb-2 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button className="bg-lime-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            TOTAL: 0
          </button>
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search Invoice #, Company..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-600"
            />
          </div>
          <button className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-4 py-2 rounded-lg font-medium">
            June 2026
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
          <button className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 ml-auto">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Invoices Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">SR</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">DATE</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">INVOICE#</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">COMPANY</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">TOTAL PAYMENT</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">ADVANCE</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">RECEIVE PAYMENT</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">BALANCE</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">STATUS</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">DELIVER DATE</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-300">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr className="hover:bg-gray-800 transition-colors">
                <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                  No invoices found. Create your first invoice.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
