import React, { useState } from 'react';
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
  TrendingUp,
  Plus,
  Search,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { cn } from './lib/utils';

// Import pages
import Dashboard from './pages/Dashboard';
import LeadGeneration from './pages/LeadGeneration';
import QuotationBuilder from './pages/QuotationBuilder';
import Invoices from './pages/Invoices';
import Products from './pages/Products';
import Clients from './pages/Clients';

type Tab = 'dashboard' | 'leads' | 'quotations' | 'invoices' | 'products' | 'clients' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tabs: Array<{ id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Lead Generation', icon: TrendingUp },
    { id: 'quotations', label: 'Quote Builder', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadGeneration />;
      case 'quotations':
        return <QuotationBuilder />;
      case 'invoices':
        return <Invoices />;
      case 'products':
        return <Products />;
      case 'clients':
        return <Clients />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Toaster />
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static top-0 left-0 h-screen bg-gray-950 border-r border-gray-800 transition-transform duration-300 z-40 w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center font-bold text-lg">
              W
            </div>
            <div>
              <h1 className="text-lg font-bold">WOODEX</h1>
              <p className="text-xs text-gray-400">eQuotation</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-sm',
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
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
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@woodex.pk</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-gray-800 bg-gray-950 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Page Content */}
        <main className="overflow-auto h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Settings Page Component
function Settings() {
  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <p className="text-gray-400">Settings page coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
