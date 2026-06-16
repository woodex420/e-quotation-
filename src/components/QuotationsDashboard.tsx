import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Edit,
  Copy,
  Send,
  TrendingUp,
  DollarSign,
  FileCheck,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { getQuotations, deleteQuotation } from '../lib/db-queries';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

interface QuotationRow {
  id: string;
  quote_number: string;
  clients: { name: string; email?: string } | null;
  status: string;
  grand_total: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export default function QuotationsDashboard({ onCreateNew, onEdit, onView }: Props) {
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    setLoading(true);
    const { data } = await getQuotations();
    setQuotations(data as QuotationRow[]);
    setLoading(false);
  };

  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchesSearch =
        q.quote_number.toLowerCase().includes(search.toLowerCase()) ||
        q.clients?.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus =
        filterStatus === 'All' || q.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: quotations.length,
      draft: quotations.filter(q => q.status === 'Draft').length,
      approved: quotations.filter(q => q.status === 'Approved').length,
      sent: quotations.filter(q => q.status === 'Sent').length,
      totalValue: quotations.reduce((sum, q) => sum + q.grand_total, 0),
    };
  }, [quotations]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      await deleteQuotation(id);
      await loadQuotations();
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-700',
      'Sent': 'bg-blue-100 text-blue-700',
      'Approved': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Invoiced': 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Quotations"
          value={stats.total}
          icon={FileCheck}
          color="blue"
        />
        <StatCard
          label="Draft"
          value={stats.draft}
          icon={Clock}
          color="gray"
        />
        <StatCard
          label="Sent"
          value={stats.sent}
          icon={Send}
          color="blue"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-premium p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 flex gap-2 w-full lg:w-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by quote # or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={onCreateNew}
            className="w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            New Quotation
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Draft', 'Sent', 'Approved', 'Rejected', 'Invoiced'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quote #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading quotations...
                  </td>
                </tr>
              ) : filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No quotations found
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((quote) => (
                  <tr
                    key={quote.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedRows.has(quote.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedRows);
                          if (e.target.checked) {
                            newSelected.add(quote.id);
                          } else {
                            newSelected.delete(quote.id);
                          }
                          setSelectedRows(newSelected);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono-data font-semibold text-blue-600">
                        {quote.quote_number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {quote.clients?.name || 'Unknown Client'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {quote.clients?.email || '—'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono-data font-semibold">
                        {formatCurrency(quote.grand_total)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          getStatusBadgeColor(quote.status)
                        )}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(quote.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onView(quote.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="View"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => onEdit(quote.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number }>;
  color: 'blue' | 'gray' | 'green' | 'purple';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-50 text-gray-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-premium p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 font-mono-data">
            {value}
          </p>
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default QuotationsDashboard;
