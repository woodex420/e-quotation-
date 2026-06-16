import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Phone, Mail } from 'lucide-react';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    { id: 1, initial: 'B', name: 'Black Ibex', code: 'C1', phone: '+923134227744', email: 'info@blackibex.com', location: 'Bahawalpur, Punjab', status: ['OP', '1A'], lastActivity: '28/03/2028', spent: 'Rs 230,000' },
    { id: 2, initial: 'Z', name: 'Zainab Tower', code: 'C2', phone: '+923224000768', email: 'info@zainab.pk', location: 'Lahore, Pakistan', status: ['OP', '0A'], lastActivity: 'NO ACTIVITY', spent: 'Rs 450,000' },
    { id: 3, initial: 'a', name: 'ahmad', code: 'C177649', phone: '03213638360', email: 'new@gmaik.cd,', location: 'lahore pakistan', status: ['OP', '1A'], lastActivity: '31/03/2028', spent: 'Rs 0' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'OP') return 'bg-orange-600';
    if (status === 'OA') return 'bg-orange-600';
    if (status === '1A') return 'bg-green-600';
    if (status === '0A') return 'bg-green-600';
    return 'bg-gray-600';
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Client Database</h1>
            <p className="text-gray-400">Manage your customer relationships and track quotation status.</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus size={20} />
            ADD CLIENT
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Clients</p>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-green-900 border border-green-800 rounded-lg p-6">
            <p className="text-gray-300 text-sm mb-2">Active Quotations</p>
            <p className="text-3xl font-bold">8</p>
          </div>
          <div className="bg-blue-900 border border-blue-800 rounded-lg p-6">
            <p className="text-gray-300 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">Rs 2.8M</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-600"
            />
          </div>
          <button className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Clients Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-6 py-3 text-left text-sm font-bold"></th>
                <th className="px-6 py-3 text-left text-sm font-bold">CLIENT INFO</th>
                <th className="px-6 py-3 text-left text-sm font-bold">CONTACT</th>
                <th className="px-6 py-3 text-left text-sm font-bold">LOCATION</th>
                <th className="px-6 py-3 text-left text-sm font-bold">STATUS (P/A)</th>
                <th className="px-6 py-3 text-left text-sm font-bold">LAST ACTIVITY</th>
                <th className="px-6 py-3 text-left text-sm font-bold">TOTAL SPENT</th>
                <th className="px-6 py-3 text-left text-sm font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                      {client.initial.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-bold">{client.name}</p>
                      <p className="text-gray-400 text-sm">{client.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Phone size={14} />
                        <span className="text-sm">{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Mail size={14} />
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{client.location}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {client.status.map((s, idx) => (
                      <span key={idx} className={`${getStatusColor(s)} text-white text-xs px-2 py-1 rounded font-bold`}>
                        {s}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{client.lastActivity}</td>
                  <td className="px-6 py-4 text-cyan-400 font-bold">{client.spent}</td>
                  <td className="px-6 py-4 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <MoreVertical size={18} />
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
