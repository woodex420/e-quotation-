import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';

export default function LeadGeneration() {
  const [searchTerm, setSearchTerm] = useState('');

  const leads = [
    { id: 1, date: '30/03/2026', company: 'Rafi Group', name: 'Hassan', contact: '333 4405830', designation: 'manager', location: 'Lahore', source: 'NEW LEAD', category: 'INTERIOR', assignee: 'Nabeel', status: 'NEW LEADS', meeting: '-' },
    { id: 2, date: '30/03/2026', company: 'nabeel', name: 'Hassan', contact: '333 4405830', designation: 'manager', location: 'Eitihad Town', source: 'NEW LEAD', category: 'FURNITURE', assignee: 'Nabeel', status: 'MEETING', meeting: '2026-03-25' },
    { id: 3, date: '10/01/2025', company: 'Green Brain', name: 'Hassan', contact: '333 4405830', designation: 'Ceo', location: 'Eitihad Town', source: 'CLIENT', category: 'FURNITURE', assignee: 'Abdullah', status: 'DONE', meeting: '2026-03-30' },
    { id: 4, date: '17/01/2025', company: 'Total Parco', name: 'Norman Ahmad', contact: '304 010137', designation: 'Procurement', location: 'Kot ADDU Multan', source: 'NEW LEAD', category: 'FURNITURE', assignee: 'Abdullah', status: 'DONE', meeting: '-' },
  ];

  const metrics = [
    { label: 'NEW LEAD', value: '1' },
    { label: 'DONE', value: '8' },
    { label: 'WON', value: '1' },
    { label: 'TOTAL', value: '14' },
    { label: 'CLIENT', value: '4' },
    { label: 'PROPOSAL', value: '2' },
    { label: 'MEETING', value: '4' },
    { label: 'HOLD', value: '0' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'NEW LEADS': 'bg-cyan-500',
      'MEETING': 'bg-cyan-500',
      'DONE': 'bg-green-500',
      'PROPOSAL': 'bg-orange-500',
      'CLIENT': 'bg-blue-500',
      'FURNITURE': 'bg-orange-500',
      'INTERIOR': 'bg-blue-500',
      'PROJECT': 'bg-purple-500',
    };
    return colors[status] || 'bg-gray-600';
  };

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Lead Generation</h1>
            <p className="text-gray-400">Manage pipeline and track client database.</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Add Lead
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center hover:border-gray-700 transition-colors"
            >
              <p className="text-gray-400 text-xs font-medium mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-cyan-400">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <h3 className="font-bold mb-4">Advanced Monthly Performance</h3>
          <div className="h-48 bg-gray-950 rounded flex items-center justify-center text-gray-500">
            Monthly chart visualization
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-600"
            />
          </div>
          <button className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-6 py-3 text-left text-sm font-bold">SR</th>
                <th className="px-6 py-3 text-left text-sm font-bold">DATE</th>
                <th className="px-6 py-3 text-left text-sm font-bold">COMPANY</th>
                <th className="px-6 py-3 text-left text-sm font-bold">NAME</th>
                <th className="px-6 py-3 text-left text-sm font-bold">CONTACT</th>
                <th className="px-6 py-3 text-left text-sm font-bold">DESIGNATION</th>
                <th className="px-6 py-3 text-left text-sm font-bold">LOCATION</th>
                <th className="px-6 py-3 text-left text-sm font-bold">SOURCE</th>
                <th className="px-6 py-3 text-left text-sm font-bold">CATEGORY</th>
                <th className="px-6 py-3 text-left text-sm font-bold">ASSIGNEE</th>
                <th className="px-6 py-3 text-left text-sm font-bold">STATUS</th>
                <th className="px-6 py-3 text-left text-sm font-bold">MEETING</th>
                <th className="px-6 py-3 text-left text-sm font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{lead.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.designation}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.location}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`${getStatusColor(lead.source)} text-white text-xs px-2 py-1 rounded`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`${getStatusColor(lead.category)} text-white text-xs px-2 py-1 rounded`}>
                      {lead.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.assignee}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`${getStatusColor(lead.status)} text-white text-xs px-2 py-1 rounded`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{lead.meeting}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreVertical size={18} />
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
