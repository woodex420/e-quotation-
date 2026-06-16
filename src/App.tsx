import React, { useState, Suspense, lazy } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { cn } from './lib/utils';

// Lazy load components for better performance
const QuotationsDashboard = lazy(() => import('./components/QuotationsDashboard'));
const ClientsManagement = lazy(() => import('./components/ClientsManagement'));
const ProductsMaster = lazy(() => import('./components/ProductsMaster'));

type Tab = 'dashboard' | 'quotations' | 'clients' | 'products' | 'reports' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs: Array<{ id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static top-0 left-0 h-screen bg-gray-900 text-white transition-transform duration-300 z-40 w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
              E
            </div>
            <h1 className="text-xl font-bold tracking-tight">eQuote</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <tab.icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-gray-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-400">admin@eq.local</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Suspense fallback={<LoadingPlaceholder />}>
              {activeTab === 'dashboard' && <DashboardPage />}
              {activeTab === 'quotations' && (
                <QuotationsDashboard
                  onCreateNew={() => setActiveTab('quotations')}
                  onEdit={(id) => console.log('Edit quotation:', id)}
                  onView={(id) => console.log('View quotation:', id)}
                />
              )}
              {activeTab === 'clients' && <ClientsManagement />}
              {activeTab === 'products' && <ProductsMaster />}
              {activeTab === 'reports' && <ReportsPage />}
              {activeTab === 'settings' && <SettingsPage />}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to eQuote</h1>
        <p className="text-gray-600 mt-2">
          Manage your quotations, clients, and products efficiently.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Quotations"
          value="—"
          description="Coming soon"
          color="blue"
        />
        <StatCard
          title="Active Clients"
          value="—"
          description="Coming soon"
          color="green"
        />
        <StatCard
          title="Product Catalog"
          value="—"
          description="Coming soon"
          color="purple"
        />
        <StatCard
          title="Pending Approvals"
          value="—"
          description="Coming soon"
          color="orange"
        />
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Getting Started</h3>
          <p className="text-sm text-blue-800 mb-4">
            Start by adding clients and products to your catalog, then create quotations.
          </p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Learn More →
          </button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-2">Database Connected</h3>
          <p className="text-sm text-green-800 mb-4">
            Your Supabase database is fully integrated and ready to manage your business data.
          </p>
          <button className="text-sm font-medium text-green-600 hover:text-green-700">
            View Status →
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-premium p-8 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Reports Coming Soon</h3>
        <p className="text-gray-600">
          Analytics dashboard with quotation trends, revenue forecasting, and more.
        </p>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-premium p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Your company name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Default Tax Rate (%)
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Default Advance Policy (%)
            </label>
            <input
              type="number"
              placeholder="75"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className={cn('border rounded-lg p-6', colorClasses[color])}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs opacity-60 mt-2">{description}</p>
    </div>
  );
}

export default App;
