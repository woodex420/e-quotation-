import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Save, 
  FileText, 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings as SettingsIcon,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  Printer,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  DollarSign,
  FileCheck,
  Copy,
  Edit,
  Maximize2,
  Minimize2,
  Phone,
  Mail,
  Upload,
  FileUp,
  Image as ImageIcon,
  Filter,
  FileSpreadsheet,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency, generateQuoteId } from './lib/utils';
import { Product, Client, Quote, QuoteItem, Settings, QuoteTemplate, Invoice, Payment } from './types';
import { format, addDays, parse, subMonths } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// --- Components ---

const ImageUpload = ({ onUpload, currentImage, label }: { onUpload: (base64: string) => void, currentImage?: string, label: string }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden group"
      >
        {currentImage ? (
          <>
            <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="text-white" size={24} />
            </div>
          </>
        ) : (
          <>
            <ImageIcon className="text-gray-300 mb-2" size={32} />
            <p className="text-xs text-gray-400 font-medium">Click to upload image</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, setBuilderMode }: { activeTab: string, setActiveTab: (tab: string) => void, setBuilderMode: (mode: 'quote' | 'invoice') => void }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Quote Builder', icon: Plus, onClick: () => { setBuilderMode('quote'); setActiveTab('builder'); } },
    { id: 'quotes', label: 'Quotes Log', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: FileCheck },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="w-64 bg-[#333333] text-white h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#2D5A27] rounded-lg flex items-center justify-center font-bold text-xl">W</div>
        <h1 className="text-xl font-bold tracking-tight">WOODEX</h1>
      </div>
      <nav className="flex-1 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.onClick) tab.onClick();
              else setActiveTab(tab.id);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 transition-colors",
              activeTab === tab.id ? "bg-[#2D5A27] text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <tab.icon size={20} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-white/10">
        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Logged in as</div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600"></div>
          <div className="text-sm font-medium">Admin User</div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ quotes }: { quotes: Quote[] }) => {
  const stats = useMemo(() => {
    const approved = quotes.filter(q => q.status === 'Approved');
    const totalValue = approved.reduce((sum, q) => sum + q.grandTotal, 0);
    const pendingAdvances = approved.reduce((sum, q) => sum + q.balanceDue, 0);
    return {
      totalQuotes: quotes.length,
      approvedQuotes: approved.length,
      totalValue,
      pendingAdvances
    };
  }, [quotes]);

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#333333]">Dashboard</h2>
          <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium shadow-sm">
            <option>March 2026</option>
            <option>February 2026</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Quotes', value: stats.totalQuotes, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Approved Value', value: formatCurrency(stats.totalValue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Advances', value: formatCurrency(stats.pendingAdvances), icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Approval Rate', value: `${Math.round((stats.approvedQuotes / stats.totalQuotes) * 100 || 0)}%`, icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[#333333]">{stat.value}</h3>
            </div>
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Sales Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8f8f8' }}
                />
                <Bar dataKey="value" fill="#2D5A27" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {quotes.slice(0, 5).map((quote, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    quote.status === 'Approved' ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                  )}>
                    {quote.status === 'Approved' ? <CheckCircle size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#333333]">{quote.clientName}</p>
                    <p className="text-xs text-gray-500">{quote.id} • {quote.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatCurrency(quote.grandTotal)}</p>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    quote.status === 'Approved' ? "text-green-600" : "text-gray-400"
                  )}>{quote.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuoteBuilder = ({ 
  products, 
  clients, 
  templates,
  onSave, 
  onSaveTemplate,
  onRemoveTemplate,
  lastQuoteId,
  initialQuote,
  onClear,
  quotes,
  mode = 'quote'
}: { 
  products: Product[], 
  clients: Client[], 
  templates: QuoteTemplate[],
  onSave: (quote: Quote) => void,
  onSaveTemplate: (template: QuoteTemplate) => void,
  onRemoveTemplate: (id: string) => void,
  lastQuoteId: string | null,
  initialQuote?: Partial<Quote> | null,
  onClear: () => void,
  quotes: Quote[],
  mode?: 'quote' | 'invoice'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const pdfRef = React.useRef<HTMLDivElement>(null);
  
  const defaultQuote: Partial<Quote> = {
    id: generateQuoteId(lastQuoteId),
    date: format(new Date(), 'dd/MM/yyyy'),
    validUntil: format(addDays(new Date(), 30), 'dd/MM/yyyy'),
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    rent: 0,
    grandTotal: 0,
    advancePercentage: 75,
    advanceAmount: 0,
    balanceDue: 0,
    status: 'Draft',
    repName: 'Admin',
    title: 'WOODEX',
    tagline: '',
    terms: '• Delivery will be made within 14-21 working days after receipt of advance payment.\n• Quotation is valid for 30 days from the date of issue.\n• Colors and finishes may vary slightly from digital catalog.\n• Installation is included in the total price within Dubai area.\n• 75% Advance payment is required to process the order.',
    footerAddress: 'LG,90 ZAINAB TOWER MODEL TOWN LINK ROAD LAHORE',
    footerPhone: '0322 4000768',
    footerEmail: 'info@woodex.pk',
    logoUrl: '',
    documentType: 'Quotation',
  };

  const [quote, setQuote] = useState<Partial<Quote>>(initialQuote || defaultQuote);

  useEffect(() => {
    if (initialQuote) {
      setQuote(initialQuote);
    } else {
      setQuote(defaultQuote);
    }
  }, [initialQuote, lastQuoteId]);

  const [searchProduct, setSearchProduct] = useState('');
  const [showProductResults, setShowProductResults] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchProduct) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchProduct.toLowerCase())
    );
  }, [products, searchProduct]);

  const calculateTotals = (items: QuoteItem[], taxRate: number, discount: number, rent: number, advancePct: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount + rent - discount;
    const advanceAmount = (grandTotal * advancePct) / 100;
    const balanceDue = grandTotal - advanceAmount;

    setQuote(prev => ({
      ...prev,
      items,
      subtotal,
      taxAmount,
      grandTotal,
      advanceAmount,
      balanceDue,
      taxRate,
      discount,
      rent,
      advancePercentage: advancePct
    }));
  };

  const addItem = (product: Product) => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      sku: product.sku,
      name: product.name,
      description: product.description,
      qty: 1,
      unitPrice: product.unitPrice,
      total: product.unitPrice,
      imageUrl: product.imageUrl,
    };
    const newItems = [...(quote.items || []), newItem];
    calculateTotals(newItems, quote.taxRate || 0, quote.discount || 0, quote.rent || 0, quote.advancePercentage || 75);
    setSearchProduct('');
    setShowProductResults(false);
  };

  const handlePrint = () => {
    const printContent = pdfRef.current;
    if (!printContent) return;

    const headerHtml = printContent.querySelector('#print-header')?.outerHTML || '';
    const bodyHtml = printContent.querySelector('#print-body')?.outerHTML || '';
    const footerHtml = printContent.querySelector('#print-footer')?.outerHTML || '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${quote.documentType || 'Quotation'} - ${quote.id}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-family: 'Inter', sans-serif;
                color: #333333;
              }
              .print-container {
                width: 210mm;
                margin: 0 auto;
                padding: 0;
                box-sizing: border-box;
                background: white;
              }
              .header-fixed {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                padding: 12mm 12mm 0 12mm;
                background: white;
                z-index: 1000;
              }
              .footer-fixed {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 0 12mm 12mm 12mm;
                background: white;
                z-index: 1000;
              }
              .header-spacer {
                height: 130px;
              }
              .footer-spacer {
                height: 150px;
              }
              
              .content-wrapper {
                padding: 0 12mm;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
              }
              
              .no-print { display: none !important; }
              
              /* Allow content to break naturally */
              tr { page-break-inside: auto; }
              .line-item-row { page-break-inside: avoid; }
              thead { display: table-header-group; }
              tfoot { display: table-footer-group; }
              
              /* Force background colors and borders in print */
              .bg-gray-50\\/50 { background-color: rgba(249, 250, 251, 0.5) !important; }
              .bg-\\[\\#2D5A27\\] { background-color: #2D5A27 !important; }
              .border { border-width: 1px !important; border-style: solid !important; }
              .border-gray-100 { border-color: #f3f4f6 !important; }
              .rounded-lg { border-radius: 0.5rem !important; }
              .rounded-sm { border-radius: 0.125rem !important; }
            }
            
            body {
              font-family: 'Inter', sans-serif;
              color: #333333;
            }

            /* Reset some margins for fixed elements */
            .header-fixed #print-header { margin-bottom: 0 !important; }
            .footer-fixed #print-footer { margin-top: 0 !important; padding-top: 0 !important; }
          </style>
        </head>
        <body>
          <div class="header-fixed">
            ${headerHtml}
          </div>

          <div class="print-container">
            <table>
              <thead>
                <tr>
                  <td>
                    <div class="header-spacer"></div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="content-wrapper">
                      ${bodyHtml}
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <div class="footer-spacer"></div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="footer-fixed">
            ${footerHtml}
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    const newItems = (quote.items || []).map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'unitPrice') {
          updatedItem.total = updatedItem.qty * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    calculateTotals(newItems, quote.taxRate || 0, quote.discount || 0, quote.rent || 0, quote.advancePercentage || 75);
  };

  const removeItem = (id: string) => {
    const newItems = (quote.items || []).filter(item => item.id !== id);
    calculateTotals(newItems, quote.taxRate || 0, quote.discount || 0, quote.rent || 0, quote.advancePercentage || 75);
  };

  return (
    <div className={cn(
      "grid gap-8 transition-all duration-500",
      isFullscreen ? "fixed inset-0 z-[60] bg-gray-100 p-8 grid-cols-1 overflow-y-auto" : "grid-cols-1 lg:grid-cols-2 h-[calc(100vh-120px)]"
    )}>
      {/* Entry Form */}
      {!isFullscreen && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-lg text-[#333333]">{mode === 'invoice' ? 'New Invoice' : 'New Quotation'}</h3>
            <div className="flex gap-2">
              <button 
                onClick={onClear}
                className="bg-white border border-gray-200 text-gray-400 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} /> Clear
              </button>
              <button 
                onClick={() => setShowTemplateModal(true)}
                className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <FileUp size={16} /> Save as Template
              </button>
              <button 
                onClick={() => onSave(quote as Quote)}
                className="bg-[#2D5A27] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#1e3d1a] transition-colors"
              >
                <Save size={16} /> {mode === 'invoice' ? 'Save Invoice' : (quote.id && !quote.id.includes('DUP') && quotes.find(q => q.id === quote.id) ? 'Update Quote' : 'Save Quote')}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Templates Quick Load */}
            {templates.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Load Template</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {templates.map(t => (
                    <div key={t.id} className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors pr-1">
                      <button 
                        onClick={() => setQuote({ ...quote, ...t.quote, id: generateQuoteId(lastQuoteId) })}
                        className="whitespace-nowrap px-3 py-1.5 text-xs font-medium"
                      >
                        {t.name}
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm(`Remove template "${t.name}"?`)) {
                            onRemoveTemplate(t.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* Client & Basic Info */}
          <div className="space-y-4 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Select Client</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                  onChange={(e) => {
                    const client = clients.find(c => c.id === e.target.value);
                    if (client) setQuote(prev => ({ 
                      ...prev, 
                      clientId: client.id, 
                      clientName: client.name,
                      clientPhone: client.phone,
                      clientAddress: client.address
                    }));
                  }}
                >
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Client Name (Override)</label>
                <input 
                  type="text" 
                  value={quote.clientName || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                <input 
                  type="text" 
                  value={quote.clientPhone || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Location / Address</label>
                <input 
                  type="text" 
                  value={quote.clientAddress || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, clientAddress: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">PO Number (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. 1505503"
                value={quote.poNumber || ''}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                onChange={(e) => setQuote(prev => ({ ...prev, poNumber: e.target.value }))}
              />
            </div>
          </div>

          {/* PDF Customization */}
          <div className="space-y-4 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
            <h4 className="text-xs font-bold text-gray-500 uppercase">PDF Customization</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Quote ID</label>
                <input 
                  type="text" 
                  value={quote.id || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Date</label>
                <input 
                  type="text" 
                  value={quote.date || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Valid Until</label>
                <input 
                  type="text" 
                  value={quote.validUntil || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
              <ImageUpload 
                label="Logo Upload"
                currentImage={quote.logoUrl}
                onUpload={(base64) => setQuote(prev => ({ ...prev, logoUrl: base64 }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Header Title</label>
                <input 
                  type="text" 
                  value={quote.title || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Document Type</label>
                <select 
                  value={quote.documentType || 'Quotation'}
                  onChange={(e) => setQuote(prev => ({ ...prev, documentType: e.target.value as 'Quotation' | 'Invoice' }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                >
                  <option value="Quotation">Quotation</option>
                  <option value="Invoice">Invoice</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Footer Address</label>
              <input 
                type="text" 
                value={quote.footerAddress || ''}
                onChange={(e) => setQuote(prev => ({ ...prev, footerAddress: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Footer Phone</label>
                <input 
                  type="text" 
                  value={quote.footerPhone || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, footerPhone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Footer Email</label>
                <input 
                  type="text" 
                  value={quote.footerEmail || ''}
                  onChange={(e) => setQuote(prev => ({ ...prev, footerEmail: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Terms & Conditions</label>
              <textarea 
                value={quote.terms || ''}
                onChange={(e) => setQuote(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Enter terms and conditions..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none h-32 resize-none"
              />
            </div>
          </div>

          {/* Product Search */}
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Add Products</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by SKU or Name..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#2D5A27] outline-none"
                value={searchProduct}
                onChange={(e) => {
                  setSearchProduct(e.target.value);
                  setShowProductResults(true);
                }}
                onFocus={() => setShowProductResults(true)}
              />
            </div>
            
            <AnimatePresence>
              {showProductResults && filteredProducts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                >
                  {filteredProducts.map(p => (
                    <button
                      key={p.sku}
                      onClick={() => addItem(p)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.sku}</p>
                      </div>
                      <p className="font-bold text-[#2D5A27]">{formatCurrency(p.unitPrice)}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#333333]">Line Items</h4>
              <button 
                onClick={() => {
                  const newItem: QuoteItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    sku: 'CUSTOM',
                    name: 'New Custom Item',
                    description: 'Enter item description here...',
                    qty: 1,
                    unitPrice: 0,
                    total: 0,
                  };
                  const newItems = [...(quote.items || []), newItem];
                  calculateTotals(newItems, quote.taxRate || 0, quote.discount || 0, quote.rent || 0, quote.advancePercentage || 75);
                  
                  // Scroll to bottom of items
                  setTimeout(() => {
                    const itemsList = document.querySelector('.items-list-container');
                    if (itemsList) itemsList.scrollTop = itemsList.scrollHeight;
                  }, 100);
                }}
                className="text-xs font-bold text-[#2D5A27] hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Custom Item
              </button>
            </div>
            
            <div className="space-y-3 items-list-container overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              {quote.items?.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full font-bold text-sm bg-transparent border-none p-0 focus:ring-0"
                      />
                      <textarea 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description..."
                        className="w-full text-xs text-gray-500 bg-transparent border-none p-0 focus:ring-0 resize-none h-12"
                      />
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Qty</label>
                      <input 
                        type="number" 
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Unit Price</label>
                      <input 
                        type="number" 
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Total</label>
                      <p className="font-bold text-sm">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {quote.items?.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                  <Package className="mx-auto text-gray-200 mb-2" size={32} />
                  <p className="text-sm text-gray-400">No items added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Totals */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Tax (%)</label>
              <input 
                type="number" 
                value={quote.taxRate}
                onChange={(e) => calculateTotals(quote.items || [], parseFloat(e.target.value) || 0, quote.discount || 0, quote.rent || 0, quote.advancePercentage || 75)}
                className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Discount</label>
              <input 
                type="number" 
                value={quote.discount}
                onChange={(e) => calculateTotals(quote.items || [], quote.taxRate || 0, parseFloat(e.target.value) || 0, quote.rent || 0, quote.advancePercentage || 75)}
                className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Advance (%)</label>
              <select 
                value={quote.advancePercentage}
                onChange={(e) => calculateTotals(quote.items || [], quote.taxRate || 0, quote.discount || 0, quote.rent || 0, parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
              >
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-end pt-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Grand Total</p>
              <p className="text-2xl font-bold text-[#333333]">{formatCurrency(quote.grandTotal || 0)}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs text-gray-500">Balance Due</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(quote.balanceDue || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Save Template Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTemplateModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4"
            >
              <h3 className="font-bold text-lg">Save as Template</h3>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Template Name</label>
                <input 
                  type="text" 
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Standard Executive Office"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-bold text-sm text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (templateName) {
                      onSaveTemplate({
                        id: Math.random().toString(36).substr(2, 9),
                        name: templateName,
                        quote: { ...quote, id: '', date: '', validUntil: '' }
                      });
                      setShowTemplateModal(false);
                      setTemplateName('');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-[#2D5A27] text-white rounded-lg font-bold text-sm hover:bg-[#1e3d1a]"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Preview */}
      <div className={cn(
        "bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col",
        isFullscreen ? "w-full max-w-5xl mx-auto h-full" : ""
      )}>
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium ml-2 opacity-60">Live PDF Preview</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button 
              onClick={handlePrint}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Print / Save as PDF"
            >
              <Printer size={16} />
            </button>
            <button 
              onClick={handlePrint}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Download PDF"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div ref={pdfRef} className="bg-white w-full aspect-[1/1.414] shadow-2xl mx-auto p-12 flex flex-col font-sans text-[#333333] print:shadow-none print:p-0">
            {/* Header */}
            <div id="print-header" className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                {quote.logoUrl && (
                  <img src={quote.logoUrl} alt="Logo" className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
                )}
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-[#333333]">
                    {quote.title || 'WOODEX'}<span className="text-[#2D5A27]">.</span>
                  </h1>
                  <div className="h-1 w-full bg-[#2D5A27] mt-2"></div>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter">
                  {quote.documentType || 'QUOTATION'}
                </h2>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <div className="h-0.5 w-8 bg-[#2D5A27]"></div>
                  <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                    Official Document
                  </p>
                </div>
              </div>
            </div>

            <div id="print-body" className="flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border border-gray-100 p-6 rounded-sm bg-gray-50/30">
                  <p className="text-[10px] font-bold text-[#2D5A27] uppercase tracking-widest mb-4">
                    {quote.documentType === 'Invoice' ? 'BILL TO' : 'QUOTATION FOR'}
                  </p>
                  <h3 className="text-xl font-bold mb-2 uppercase">{quote.clientName || 'Client Name'}</h3>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>{quote.clientAddress || 'Address'}</p>
                    <p>{quote.clientPhone || 'Phone'}</p>
                  </div>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-sm grid grid-cols-2 gap-y-3 text-[10px]">
                  <p className="font-bold text-gray-400 uppercase">{quote.documentType === 'Invoice' ? 'INVOICE NO.' : 'QUOTE NO.'}</p>
                  <p className="font-bold text-right text-[#333333]">{quote.id}</p>
                  <p className="font-bold text-gray-400 uppercase">DATE</p>
                  <p className="font-bold text-right text-[#333333]">{quote.date}</p>
                  <p className="font-bold text-gray-400 uppercase">{quote.documentType === 'Invoice' ? 'DUE DATE' : 'VALID UNTIL'}</p>
                  <p className="font-bold text-right text-[#333333]">{quote.validUntil}</p>
                  <p className="font-bold text-gray-400 uppercase">PO#</p>
                  <p className="font-bold text-right text-[#333333]">{quote.poNumber || '-'}</p>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#2D5A27] text-white text-[10px] font-bold uppercase tracking-widest">
                      <th className="py-4 px-4 w-12 border-r border-white/10">SR</th>
                      <th className="py-4 px-4 w-40 border-r border-white/10">ITEM</th>
                      <th className="py-4 px-4 border-r border-white/10">DESCRIPTION</th>
                      <th className="py-4 px-4 text-center w-20 border-r border-white/10">QTY</th>
                      <th className="py-4 px-4 text-right w-32 border-r border-white/10">UNIT PRICE</th>
                      <th className="py-4 px-4 text-right w-32">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    {quote.items?.map((item, i) => (
                      <tr key={item.id} className={cn(
                        "border-b border-gray-100 line-item-row",
                        i % 2 === 1 ? "bg-gray-50/50" : "bg-white"
                      )}>
                        <td className="py-4 px-4 text-gray-400 text-center">{i + 1}</td>
                        <td className="py-4 px-4 font-bold text-[#333333] uppercase">{item.name}</td>
                        <td className="py-4 px-4 text-[#4A708B] leading-relaxed italic">{item.description}</td>
                        <td className="py-4 px-4 text-center text-gray-600">{item.qty}</td>
                        <td className="py-4 px-4 text-right text-gray-600">{item.unitPrice.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right font-bold text-[#333333]">PKR {item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                    {/* Empty rows to fill space */}
                    {Array.from({ length: Math.max(0, 3 - (quote.items?.length || 0)) }).map((_, i) => {
                      const rowIndex = (quote.items?.length || 0) + i;
                      return (
                        <tr key={i} className={cn(
                          "border-b border-gray-100 h-10",
                          rowIndex % 2 === 1 ? "bg-gray-50/50" : "bg-white"
                        )}>
                          <td colSpan={6}></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Section */}
              <div className="mt-8 grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-[#2D5A27] uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Send size={12} /> TERMS & CONDITIONS
                    </h4>
                    <div className="text-[10px] text-gray-500 space-y-2 italic whitespace-pre-line">
                      {quote.terms}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs border-b border-gray-100 pb-2">
                    <span className="font-bold text-gray-400 uppercase">SUBTOTAL</span>
                    <span className="font-bold">PKR {quote.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-gray-100 pb-2">
                    <span className="font-bold text-gray-400 uppercase">TAX ({quote.taxRate}%)</span>
                    <span className="font-bold">Rs: {quote.taxAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-gray-100 pb-2">
                    <span className="font-bold text-gray-400 uppercase">RENT</span>
                    <span className="font-bold">Rs: {quote.rent?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#2D5A27] text-white p-3 rounded-sm">
                    <span className="text-xs font-bold uppercase tracking-widest">TOTAL</span>
                    <span className="text-lg font-bold">PKR {quote.grandTotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2">
                    <span className="font-bold text-gray-400 uppercase">ADVANCE ({quote.advancePercentage}%)</span>
                    <span className="font-bold">PKR {quote.advanceAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="font-bold text-gray-400 uppercase">BALANCE DUE</span>
                    <span className="font-bold">PKR {quote.balanceDue?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div id="print-footer" className="mt-auto pt-6">
              <div className="text-center mb-4">
                <p className="text-sm font-black text-[#2D5A27] uppercase tracking-[0.2em]">THANK YOU FOR CHOOSING WOODEX!</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-[9px] text-gray-400 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <LayoutDashboard size={10} />
                  </div>
                  <span className="text-left">{quote.footerAddress}</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Phone size={10} />
                    </div>
                    <span>{quote.footerPhone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <Mail size={10} />
                  </div>
                  <span>{quote.footerEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MonthlyTracking = ({ quotes }: { quotes: Quote[] }) => {
  const monthlyStats = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const stats = months.map(month => ({ name: month, total: 0, count: 0 }));
    
    quotes.forEach(q => {
      const parts = q.date.split('/');
      if (parts.length === 3) {
        const monthIndex = parseInt(parts[1]) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          stats[monthIndex].total += q.grandTotal;
          stats[monthIndex].count += 1;
        }
      }
    });
    return stats;
  }, [quotes]);

  const maxTotal = Math.max(...monthlyStats.map(s => s.total), 1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#333333]">Advanced Monthly Performance</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#2D5A27] rounded-full"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Revenue</span>
          </div>
        </div>
      </div>
      
      <div className="h-48 flex items-end gap-2 mb-6 px-2">
        {monthlyStats.map(stat => (
          <div key={stat.name} className="flex-1 flex flex-col items-center gap-2 group relative">
            <div 
              className="w-full bg-[#2D5A27]/10 group-hover:bg-[#2D5A27]/20 rounded-t-lg transition-all duration-500 relative flex items-end justify-center overflow-hidden"
              style={{ height: `${(stat.total / maxTotal) * 100}%`, minHeight: '4px' }}
            >
              <div className="w-full bg-[#2D5A27] rounded-t-lg transition-all duration-500" style={{ height: '100%' }}></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                {formatCurrency(stat.total)}
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.name}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {monthlyStats.map(stat => (
          <div key={stat.name} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#2D5A27]/30 transition-colors">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.name}</p>
            <p className="text-sm font-bold text-[#2D5A27]">{formatCurrency(stat.total)}</p>
            <p className="text-[10px] text-gray-500">{stat.count} Transactions</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Clients = ({ clients, quotes, onAddClient }: { clients: Client[], quotes: Quote[], onAddClient: (client: Client) => void }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({ name: '', phone: '', email: '', address: '' });

  const clientStats = useMemo(() => {
    return clients.map(client => {
      const clientQuotes = quotes.filter(q => q.clientId === client.id);
      const pendingCount = clientQuotes.filter(q => q.status === 'Draft').length;
      const approvedCount = clientQuotes.filter(q => q.status === 'Approved').length;
      
      // Calculate last activity from quotes
      const lastQuote = [...clientQuotes].sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })[0];

      return { 
        ...client, 
        pendingCount, 
        approvedCount,
        lastActivity: lastQuote ? lastQuote.date : 'No activity'
      };
    });
  }, [clients, quotes]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#333333]">Client Database</h2>
          <p className="text-gray-500">Manage your customer relationships and track quotation status.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#2D5A27] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} /> Add New Client
        </button>
      </div>

      <MonthlyTracking quotes={quotes} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4">Client Info</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">Status (P/A)</th>
              <th className="px-6 py-4">Last Activity</th>
              <th className="px-6 py-4 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clientStats.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2D5A27] font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#333333]">{client.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{client.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs space-y-1">
                    <p className="text-gray-600">{client.phone}</p>
                    <p className="text-gray-400">{client.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{client.address}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-[10px] font-bold" title="Pending Quotes">
                      {client.pendingCount} P
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-[10px] font-bold" title="Approved Quotes">
                      {client.approvedCount} A
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{client.lastActivity}</p>
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#2D5A27]">
                  {formatCurrency(client.totalSpent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Add New Client</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Address</label>
                  <textarea 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27] h-20 resize-none"
                    value={newClient.address}
                    onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-bold text-sm text-gray-500 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newClient.name) {
                      onAddClient({
                        id: 'C' + (clients.length + 1),
                        name: newClient.name,
                        phone: newClient.phone || '',
                        email: newClient.email || '',
                        address: newClient.address || '',
                        totalSpent: 0
                      });
                      setShowAddModal(false);
                      setNewClient({ name: '', phone: '', email: '', address: '' });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-[#2D5A27] text-white rounded-lg font-bold text-sm hover:bg-[#1e3d1a] transition-colors"
                >
                  Save Client
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsTab = () => {
  const [settings, setSettings] = useState<Settings>({
    taxRate: 18,
    defaultAdvancePolicy: 75,
    companyAddressPK: 'LG,90 ZAINAB TOWER MODEL TOWN LINK ROAD LAHORE',
    companyAddressUAE: 'Dubai Business Bay, UAE',
  });

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-[#333333]">System Settings</h2>
        <p className="text-gray-500">Configure global defaults and company information.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-[#333333]">Financial Configuration</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Default Tax Rate (%)</label>
              <input 
                type="number" 
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D5A27] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Default Advance (%)</label>
              <select 
                value={settings.defaultAdvancePolicy}
                onChange={(e) => setSettings({ ...settings, defaultAdvancePolicy: parseInt(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D5A27] outline-none"
              >
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-[#333333]">Company Addresses</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Pakistan Office</label>
            <textarea 
              value={settings.companyAddressPK}
              onChange={(e) => setSettings({ ...settings, companyAddressPK: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D5A27] outline-none h-20 resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">UAE Office</label>
            <textarea 
              value={settings.companyAddressUAE}
              onChange={(e) => setSettings({ ...settings, companyAddressUAE: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D5A27] outline-none h-20 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-[#2D5A27] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:scale-[1.02] transition-transform">
          Save All Settings
        </button>
      </div>
    </div>
  );
};

const QuotesLog = ({ 
  quotes, 
  onEdit,
  onDuplicate, 
  onPrint,
  onShare,
  onUpdateStatus,
  onConvertToInvoice
}: { 
  quotes: Quote[], 
  onEdit: (quote: Quote) => void,
  onDuplicate: (quote: Quote) => void,
  onPrint: (quote: Quote) => void,
  onShare: (quote: Quote) => void,
  onUpdateStatus: (id: string, status: Quote['status']) => void,
  onConvertToInvoice: (quote: Quote) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const stats = useMemo(() => {
    const total = quotes.length;
    const approved = quotes.filter(q => q.status === 'Approved' || q.status === 'Invoiced').length;
    const rejected = quotes.filter(q => q.status === 'Rejected').length;
    const pending = quotes.filter(q => q.status === 'Draft' || q.status === 'Sent').length;
    const totalValue = quotes.reduce((sum, q) => sum + q.grandTotal, 0);
    
    // Monthly stats
    const monthlyData: { [key: string]: number } = {};
    quotes.forEach(q => {
      try {
        const [day, month, year] = q.date.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const monthYear = format(date, 'MMM yyyy');
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + q.grandTotal;
      } catch (e) {
        console.error("Error parsing date", q.date);
      }
    });
    
    const chartData = Object.entries(monthlyData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const dateA = parse(a.name, 'MMM yyyy', new Date());
        const dateB = parse(b.name, 'MMM yyyy', new Date());
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6);

    return { total, approved, rejected, pending, totalValue, chartData };
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => 
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotes, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#333333]">Quotation Log</h2>
          <p className="text-gray-500">History of all generated quotations and their current status.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search quotes..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2D5A27] w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Quotes</p>
          <p className="text-2xl font-bold text-[#333333]">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-green-500 uppercase mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Pending</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-[#2D5A27] uppercase mb-1">Total Value</p>
          <p className="text-xl font-bold text-[#2D5A27]">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      {stats.chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Monthly Quotation Value (PKR)</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                  />
                  <Bar dataKey="value" fill="#2D5A27" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Monthly Summary</h3>
            <div className="space-y-4">
              {stats.chartData.slice().reverse().map((data) => (
                <div key={data.name} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-[#333333]">{data.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total Value</p>
                  </div>
                  <p className="font-bold text-[#2D5A27]">{formatCurrency(data.value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-4">Quote ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-sm text-[#333333]">{quote.id}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{quote.date}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-sm text-[#333333]">{quote.clientName}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{quote.clientId}</p>
                </td>
                <td className="px-6 py-4 font-bold text-[#2D5A27]">{formatCurrency(quote.grandTotal)}</td>
                <td className="px-6 py-4">
                  <select 
                    value={quote.status}
                    onChange={(e) => onUpdateStatus(quote.id, e.target.value as Quote['status'])}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none focus:ring-0 cursor-pointer",
                      quote.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                      quote.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                      quote.status === 'Sent' ? 'bg-blue-100 text-blue-600' :
                      quote.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                      'bg-purple-100 text-purple-600'
                    )}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Invoiced">Invoiced</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {quote.status === 'Approved' && (
                      <button 
                        onClick={() => onConvertToInvoice(quote)}
                        title="Convert to Invoice"
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <FileCheck size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onEdit(quote)}
                      title="Edit Quote"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDuplicate(quote)}
                      title="Duplicate Quote"
                      className="p-2 text-gray-400 hover:text-[#2D5A27] hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => onPrint(quote)}
                      title="Print / PDF"
                      className="p-2 text-gray-400 hover:text-[#2D5A27] hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Printer size={16} />
                    </button>
                    <button 
                      onClick={() => onShare(quote)}
                      title="Share / Send"
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredQuotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <FileText className="mx-auto text-gray-200 mb-4" size={48} />
                  <p className="text-gray-400 font-medium">No quotations found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const printQuote = (quote: Quote | Invoice) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const isInvoice = 'invoiceId' in quote;
  const displayId = isInvoice ? (quote as any).invoiceId : quote.id;
  const displayTitle = isInvoice ? 'INVOICE' : 'QUOTATION';

  const itemsHtml = quote.items.map((item, i) => `
    <tr class="${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'} border-b border-gray-100">
      <td class="py-4 px-4 text-gray-400 text-center">${i + 1}</td>
      <td class="py-4 px-4 font-bold text-[#333333] uppercase">${item.name}</td>
      <td class="py-4 px-4 text-[#4A708B] leading-relaxed italic">${item.description}</td>
      <td class="py-4 px-4 text-center text-gray-600">${item.qty}</td>
      <td class="py-4 px-4 text-right text-gray-600">${item.unitPrice.toLocaleString()}</td>
      <td class="py-4 px-4 text-right font-bold text-[#333333]">PKR ${item.total.toLocaleString()}</td>
    </tr>
  `).join('');

  const emptyRowsCount = Math.max(0, 3 - quote.items.length);
  const emptyRowsHtml = Array.from({ length: emptyRowsCount }).map((_, i) => `
    <tr class="${(quote.items.length + i) % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'} border-b border-gray-100 h-10">
      <td colspan="6"></td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>${displayTitle} - ${displayId}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @media print {
            @page { size: A4; margin: 0; }
            body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: 'Inter', sans-serif; color: #333333; }
            .print-container { width: 210mm; margin: 0 auto; padding: 0; box-sizing: border-box; background: white; }
            .header-fixed { position: fixed; top: 0; left: 0; right: 0; padding: 12mm 12mm 0 12mm; background: white; z-index: 1000; }
            .footer-fixed { position: fixed; bottom: 0; left: 0; right: 0; padding: 0 12mm 12mm 12mm; background: white; z-index: 1000; }
            .header-spacer { height: 130px; }
            .footer-spacer { height: 150px; }
            .content-wrapper { padding: 0 12mm; }
            table { width: 100%; border-collapse: collapse; }
            tr { page-break-inside: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            .bg-gray-50\\/50 { background-color: rgba(249, 250, 251, 0.5) !important; }
            .bg-\\[\\#2D5A27\\] { background-color: #2D5A27 !important; }
            .border { border-width: 1px !important; border-style: solid !important; }
            .border-gray-100 { border-color: #f3f4f6 !important; }
            .rounded-lg { border-radius: 0.5rem !important; }
          }
          body { font-family: 'Inter', sans-serif; color: #333333; }
        </style>
      </head>
      <body>
        <div class="header-fixed">
          <div class="flex justify-between items-start mb-8">
            <div class="flex items-center gap-4">
              ${quote.logoUrl ? `<img src="${quote.logoUrl}" class="w-16 h-16 object-contain" />` : ''}
              <div>
                <h1 class="text-4xl font-black tracking-tighter text-[#333333]">
                  ${quote.title || 'WOODEX'}<span class="text-[#2D5A27]">.</span>
                </h1>
                <div class="h-1 w-full bg-[#2D5A27] mt-2"></div>
              </div>
            </div>
            <div class="text-right">
              <h2 class="text-3xl font-bold text-gray-800">${displayTitle}</h2>
              ${quote.tagline ? `<p class="text-xs font-bold text-gray-400 tracking-widest mt-1 uppercase">${quote.tagline}</p>` : ''}
            </div>
          </div>
        </div>

        <div class="print-container">
          <table>
            <thead><tr><td><div class="header-spacer"></div></td></tr></thead>
            <tbody>
              <tr>
                <td>
                  <div class="content-wrapper">
                    <div class="grid grid-cols-2 gap-8 mb-8">
                      <div class="border border-gray-100 p-6 rounded-sm">
                        <p class="text-[10px] font-bold text-[#2D5A27] uppercase tracking-widest mb-4">${displayTitle} FOR</p>
                        <h3 class="text-xl font-bold mb-2 uppercase">${quote.clientName}</h3>
                        <div class="space-y-1 text-xs text-gray-500">
                          <p>${quote.clientAddress}</p>
                          <p>${quote.clientPhone}</p>
                        </div>
                      </div>
                      <div class="bg-gray-50/50 p-6 rounded-sm grid grid-cols-2 gap-y-3 text-xs">
                        <p class="font-bold text-gray-400 uppercase">${displayTitle} NO.</p><p class="font-bold text-right">${displayId}</p>
                        <p class="font-bold text-gray-400 uppercase">DATE</p><p class="font-bold text-right">${quote.date}</p>
                        ${isInvoice ? `
                          <p class="font-bold text-gray-400 uppercase">DUE DATE</p><p class="font-bold text-right">${(quote as any).dueDate}</p>
                          <p class="font-bold text-gray-400 uppercase">PAID</p><p class="font-bold text-right">PKR ${(quote as any).amountPaid?.toLocaleString() || '0'}</p>
                          <p class="font-bold text-gray-400 uppercase">BALANCE</p><p class="font-bold text-right text-red-600">PKR ${(quote.grandTotal - ((quote as any).amountPaid || 0)).toLocaleString()}</p>
                        ` : `
                          <p class="font-bold text-gray-400 uppercase">VALID UNTIL</p><p class="font-bold text-right">${quote.validUntil}</p>
                        `}
                        <p class="font-bold text-gray-400 uppercase">PO#</p><p class="font-bold text-right">${quote.poNumber || '-'}</p>
                      </div>
                    </div>

                    <div class="overflow-hidden rounded-lg border border-gray-100">
                      <table class="w-full text-left border-collapse">
                        <thead>
                          <tr class="bg-[#2D5A27] text-white text-[10px] font-bold uppercase tracking-widest">
                            <th class="py-4 px-4 w-12 border-r border-white/10">SR</th>
                            <th class="py-4 px-4 w-40 border-r border-white/10">ITEM</th>
                            <th class="py-4 px-4 border-r border-white/10">DESCRIPTION</th>
                            <th class="py-4 px-4 text-center w-20 border-r border-white/10">QTY</th>
                            <th class="py-4 px-4 text-right w-32 border-r border-white/10">UNIT PRICE</th>
                            <th class="py-4 px-4 text-right w-32">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody class="text-[11px]">
                          ${itemsHtml}
                          ${emptyRowsHtml}
                        </tbody>
                      </table>
                    </div>

                    <div class="mt-8 grid grid-cols-2 gap-12">
                      <div class="space-y-6">
                        <div>
                          <h4 class="text-[10px] font-bold text-[#2D5A27] uppercase tracking-widest mb-4">TERMS & CONDITIONS</h4>
                          <div class="text-[10px] text-gray-500 space-y-2 italic whitespace-pre-line">${quote.terms}</div>
                        </div>
                      </div>
                      <div class="space-y-3">
                        <div class="flex justify-between text-xs border-b border-gray-100 pb-2">
                          <span class="font-bold text-gray-400 uppercase">SUBTOTAL</span>
                          <span class="font-bold">PKR ${quote.subtotal.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between text-xs border-b border-gray-100 pb-2">
                          <span class="font-bold text-gray-400 uppercase">TAX (${quote.taxRate}%)</span>
                          <span class="font-bold">Rs: ${quote.taxAmount.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between items-center bg-[#2D5A27] text-white p-3 rounded-sm">
                          <span class="text-xs font-bold uppercase tracking-widest">TOTAL</span>
                          <span class="text-lg font-bold">PKR ${quote.grandTotal.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between text-xs pt-2">
                          <span class="font-bold text-gray-400 uppercase">ADVANCE (${quote.advancePercentage}%)</span>
                          <span class="font-bold">PKR ${quote.advanceAmount.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between text-xs pt-1">
                          <span class="font-bold text-gray-400 uppercase">BALANCE DUE</span>
                          <span class="font-bold">PKR ${quote.balanceDue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot><tr><td><div class="footer-spacer"></div></td></tr></tfoot>
          </table>
        </div>

        <div class="footer-fixed">
          <div class="text-center mb-4">
            <p class="text-sm font-black text-[#2D5A27] uppercase tracking-[0.2em]">THANK YOU FOR CHOOSING WOODEX!</p>
          </div>
          <div class="grid grid-cols-3 gap-4 text-[9px] text-gray-400 border-t border-gray-100 pt-4">
            <span>${quote.footerAddress}</span>
            <span class="text-center">${quote.footerPhone}</span>
            <span class="text-right">${quote.footerEmail}</span>
          </div>
        </div>

        <script>
          window.onload = () => {
            setTimeout(() => { window.print(); window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

const Invoices = ({ 
  invoices, 
  onPrint,
  onUpdateInvoice,
  onCreateInvoice
}: { 
  invoices: Invoice[], 
  onPrint: (invoice: Invoice) => void,
  onUpdateInvoice: (invoice: Invoice) => void,
  onCreateInvoice: () => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'payments'>('all');
  
  const filteredInvoices = useMemo(() => {
    return invoices.filter(i => 
      i.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  const allPayments = useMemo(() => {
    const payments: (Payment & { invoiceId: string, clientName: string })[] = [];
    invoices.forEach(inv => {
      (inv.payments || []).forEach(p => {
        payments.push({ ...p, invoiceId: inv.invoiceId, clientName: inv.clientName });
      });
    });
    return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices]);

  const handleRecordPayment = () => {
    if (!selectedInvoice) return;
    
    const newPayment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      amount: paymentAmount,
      method: paymentMethod,
      note: paymentNote
    };

    const newAmountPaid = (selectedInvoice.amountPaid || 0) + paymentAmount;
    const balanceDue = selectedInvoice.grandTotal - newAmountPaid;
    
    let newStatus: Invoice['status'] = 'Partially Paid';
    if (balanceDue <= 0) {
      newStatus = 'Paid';
    } else if (newAmountPaid <= 0) {
      newStatus = 'Unpaid';
    }

    const updatedInvoice: Invoice = {
      ...selectedInvoice,
      amountPaid: newAmountPaid,
      status: newStatus,
      payments: [...(selectedInvoice.payments || []), newPayment]
    };

    onUpdateInvoice(updatedInvoice);
    setShowPaymentModal(false);
    setSelectedInvoice(null);
    setPaymentAmount(0);
    setPaymentMethod('Cash');
    setPaymentNote('');
  };

  const stats = useMemo(() => {
    const total = invoices.length;
    const pending = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Partially Paid').length;
    const paid = invoices.filter(i => i.status === 'Paid').length;
    const overdue = invoices.filter(i => i.status === 'Overdue').length;
    const totalAmount = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
    const received = invoices.reduce((sum, i) => sum + (i.amountPaid || 0), 0);
    const receivable = totalAmount - received;
    return { total, pending, paid, overdue, receivable, received };
  }, [invoices]);

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return <CheckCircle size={12} className="mr-1" />;
      case 'Overdue': return <Clock size={12} className="mr-1" />;
      default: return <Send size={12} className="mr-1" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-[#0a0a0a] min-h-screen p-8 -m-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">INVOICES</h2>
          <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wider">Manage billing and payments</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#252525] transition-colors text-sm font-bold border border-white/5">
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={onCreateInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-[#9FEF00] text-black rounded-lg hover:bg-[#8ed600] transition-colors text-sm font-bold"
          >
            <Plus size={18} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-[#111111] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">TOTAL</p>
          <h4 className="text-3xl font-black text-white">{stats.total}</h4>
        </div>
        <div className="bg-[#111111] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">PENDING</p>
          <h4 className="text-3xl font-black text-blue-500">{stats.pending}</h4>
        </div>
        <div className="bg-[#111111] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">PAID</p>
          <h4 className="text-3xl font-black text-green-500">{stats.paid}</h4>
        </div>
        <div className="bg-[#111111] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">OVERDUE</p>
          <h4 className="text-3xl font-black text-red-500">{stats.overdue}</h4>
        </div>
        <div className="bg-[#111111] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">RECEIVED</p>
          <h4 className="text-2xl font-black text-[#9FEF00]">Rs {stats.received.toLocaleString()}</h4>
        </div>
        <div className="bg-[#111111] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">RECEIVABLE</p>
          <h4 className="text-2xl font-black text-[#F27D26]">Rs {stats.receivable.toLocaleString()}</h4>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveSubTab('all')}
            className={cn(
              "text-sm font-bold uppercase tracking-widest transition-colors relative pb-4",
              activeSubTab === 'all' ? "text-[#9FEF00]" : "text-gray-500 hover:text-white"
            )}
          >
            All Invoices
            {activeSubTab === 'all' && <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9FEF00]" />}
          </button>
          <button 
            onClick={() => setActiveSubTab('payments')}
            className={cn(
              "text-sm font-bold uppercase tracking-widest transition-colors relative pb-4",
              activeSubTab === 'payments' ? "text-[#9FEF00]" : "text-gray-500 hover:text-white"
            )}
          >
            Received Payments
            {activeSubTab === 'payments' && <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9FEF00]" />}
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-white/5 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-[#9FEF00] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white rounded-lg border border-white/5 hover:bg-[#1a1a1a] transition-colors text-xs font-bold">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {activeSubTab === 'all' ? (
        <div className="overflow-hidden rounded-xl">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-2">REFERENCE</th>
                <th className="px-6 py-2">CUSTOMER</th>
                <th className="px-6 py-2">AMOUNT</th>
                <th className="px-6 py-2">RECEIVED</th>
                <th className="px-6 py-2">BALANCE</th>
                <th className="px-6 py-2">DUE DATE</th>
                <th className="px-6 py-2">STATUS</th>
                <th className="px-6 py-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.invoiceId} className="bg-[#111111] hover:bg-[#1a1a1a] transition-colors group">
                  <td className="px-6 py-5 font-bold text-[#9FEF00] rounded-l-xl">{invoice.invoiceId}</td>
                  <td className="px-6 py-5 text-white font-medium">{invoice.clientName}</td>
                  <td className="px-6 py-5 text-white font-bold">{formatCurrency(invoice.grandTotal)}</td>
                  <td className="px-6 py-5 text-[#9FEF00] font-bold">{formatCurrency(invoice.amountPaid || 0)}</td>
                  <td className="px-6 py-5 text-red-500 font-bold">{formatCurrency(invoice.grandTotal - (invoice.amountPaid || 0))}</td>
                  <td className={cn(
                    "px-6 py-5 font-medium",
                    invoice.status === 'Overdue' ? 'text-red-500' : 'text-white'
                  )}>
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      invoice.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 
                      invoice.status === 'Overdue' ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    )}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right rounded-r-xl">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => onPrint(invoice as any)}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Print Invoice"
                      >
                        <Printer size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setPaymentAmount(invoice.grandTotal - (invoice.amountPaid || 0));
                          setShowPaymentModal(true);
                        }}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Record Payment"
                      >
                        <DollarSign size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-2">DATE</th>
                <th className="px-6 py-2">INVOICE</th>
                <th className="px-6 py-2">CUSTOMER</th>
                <th className="px-6 py-2">METHOD</th>
                <th className="px-6 py-2">NOTE</th>
                <th className="px-6 py-2 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {allPayments.map((payment) => (
                <tr key={payment.id} className="bg-[#111111] hover:bg-[#1a1a1a] transition-colors group">
                  <td className="px-6 py-5 text-white font-medium rounded-l-xl">{format(new Date(payment.date), 'dd/MM/yyyy HH:mm')}</td>
                  <td className="px-6 py-5 font-bold text-[#9FEF00]">{payment.invoiceId}</td>
                  <td className="px-6 py-5 text-white font-medium">{payment.clientName}</td>
                  <td className="px-6 py-5 text-gray-400">{payment.method}</td>
                  <td className="px-6 py-5 text-gray-500 italic">{payment.note || '-'}</td>
                  <td className="px-6 py-5 text-right text-[#9FEF00] font-black rounded-r-xl">{formatCurrency(payment.amount)}</td>
                </tr>
              ))}
              {allPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 bg-[#111111] rounded-xl">
                    No payments recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111111] rounded-2xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Record Payment</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Invoice: {selectedInvoice.invoiceId}</p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Amount</p>
                    <p className="text-lg font-black text-white">{formatCurrency(selectedInvoice.grandTotal)}</p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-[10px] font-bold text-red-400 uppercase mb-1 text-center">Balance Due</p>
                    <p className="text-lg font-black text-red-500 text-center">{formatCurrency(selectedInvoice.grandTotal - (selectedInvoice.amountPaid || 0))}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Amount (PKR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      <input 
                        type="number" 
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-xl font-black text-white focus:ring-1 focus:ring-[#9FEF00] outline-none transition-all"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Method</label>
                      <select 
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:ring-1 focus:ring-[#9FEF00] outline-none"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Note</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:ring-1 focus:ring-[#9FEF00] outline-none"
                        placeholder="Optional note..."
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-4 border border-white/10 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-colors uppercase text-xs tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRecordPayment}
                    className="flex-1 py-4 bg-[#9FEF00] text-black rounded-xl font-black hover:bg-[#8ed600] transition-colors uppercase text-xs tracking-widest shadow-lg shadow-green-900/20"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductCatalog = ({ products, onAddProduct, onUpdateProduct, onRemoveProduct }: { 
  products: Product[], 
  onAddProduct: (product: Product) => void,
  onUpdateProduct: (product: Product) => void,
  onRemoveProduct: (sku: string) => void
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ sku: '', name: '', description: '', unitPrice: 0, imageUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToCSV = () => {
    const headers = ['SKU', 'Name', 'Description', 'UnitPrice', 'ImageUrl'];
    const rows = products.map(p => [
      p.sku,
      p.name,
      p.description,
      p.unitPrice,
      p.imageUrl
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `woodex_products_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const importedProducts: Product[] = [];

      // Improved CSV parsing to handle quotes and commas within fields
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts: string[] = [];
        let currentPart = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            parts.push(currentPart.trim());
            currentPart = '';
          } else {
            currentPart += char;
          }
        }
        parts.push(currentPart.trim());

        const [sku, name, description, price, imageUrl] = parts;
        if (sku && name) {
          importedProducts.push({
            sku,
            name,
            description: description || '',
            unitPrice: parseFloat(price) || 0,
            imageId: '',
            imageUrl: imageUrl || ''
          });
        }
      }

      importedProducts.forEach(p => onAddProduct(p));
      alert(`Imported ${importedProducts.length} products successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#333333]">Product Catalog</h2>
          <p className="text-gray-500">Manage your furniture inventory and pricing.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={exportToCSV}
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={18} className="text-green-600" /> Export to Sheets
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={18} className="text-green-600" /> Import from Sheets
          </button>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({ sku: '', name: '', description: '', unitPrice: 0, imageUrl: '' });
              setShowAddModal(true);
            }}
            className="bg-[#2D5A27] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 hover:scale-[1.02] transition-transform"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.sku} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow relative">
            <button 
              onClick={() => {
                if(confirm(`Are you sure you want to remove ${product.name}?`)) {
                  onRemoveProduct(product.sku);
                }
              }}
              className="absolute top-3 left-3 z-10 p-1.5 bg-white/90 backdrop-blur rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
            <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Package size={48} className="text-gray-200" />
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-[#2D5A27] shadow-sm">
                {product.sku}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-[#333333] line-clamp-1">{product.name}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 h-8">{product.description}</p>
              <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                <p className="text-lg font-bold text-[#2D5A27]">{formatCurrency(product.unitPrice)}</p>
                <button 
                  onClick={() => {
                    setEditingProduct(product);
                    setNewProduct(product);
                    setShowAddModal(true);
                  }}
                  className="text-gray-400 hover:text-[#2D5A27] transition-colors"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">SKU</label>
                    <input 
                      type="text" 
                      disabled={!!editingProduct}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27] disabled:bg-gray-50"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      placeholder="e.g. WDX-001"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Unit Price</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                      value={newProduct.unitPrice}
                      onChange={(e) => setNewProduct({...newProduct, unitPrice: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Product Name</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27]"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                  <textarea 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D5A27] h-24 resize-none"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                <ImageUpload 
                  label="Product Image"
                  currentImage={newProduct.imageUrl}
                  onUpload={(base64) => setNewProduct({...newProduct, imageUrl: base64})}
                />
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-bold text-sm text-gray-500 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newProduct.sku && newProduct.name) {
                      if (editingProduct) {
                        onUpdateProduct(newProduct as Product);
                      } else {
                        onAddProduct({
                          sku: newProduct.sku,
                          name: newProduct.name,
                          description: newProduct.description || '',
                          unitPrice: newProduct.unitPrice || 0,
                          imageId: '',
                          imageUrl: newProduct.imageUrl || ''
                        });
                      }
                      setShowAddModal(false);
                      setNewProduct({ sku: '', name: '', description: '', unitPrice: 0, imageUrl: '' });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-[#2D5A27] text-white rounded-lg font-bold text-sm hover:bg-[#1e3d1a] transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<QuoteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [duplicateQuote, setDuplicateQuote] = useState<Quote | null>(null);
  const [builderMode, setBuilderMode] = useState<'quote' | 'invoice'>('quote');

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        // Load products from localStorage
        const savedProducts = localStorage.getItem('woodex_products');
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          const mockProducts: Product[] = [
            { sku: 'SOVEREIGN', name: 'SOVEREIGN', description: 'Premium Forest Green Finish, Solid Oak Construction leather inlay and cable management.', unitPrice: 165000, imageId: '', imageUrl: '' },
            { sku: 'OASIS-EXEC', name: 'OASIS Exec', description: 'Premium Forest Green Finish, Solid Oak Construction leather inlay and cable management.', unitPrice: 65000, imageId: '', imageUrl: '' },
          ];
          setProducts(mockProducts);
          localStorage.setItem('woodex_products', JSON.stringify(mockProducts));
        }

        // Load clients from localStorage
        const savedClients = localStorage.getItem('woodex_clients');
        if (savedClients) {
          setClients(JSON.parse(savedClients));
        } else {
          const mockClients: Client[] = [
            { id: 'C1', name: 'Black Ibex', phone: '+923134227744', email: 'info@blackibex.com', address: 'Bahawalpur, Punjab', totalSpent: 230000 },
            { id: 'C2', name: 'Zainab Tower', phone: '+923224000768', email: 'info@zainab.pk', address: 'Lahore, Pakistan', totalSpent: 450000 },
          ];
          setClients(mockClients);
          localStorage.setItem('woodex_clients', JSON.stringify(mockClients));
        }
        
        // Load quotes from localStorage for offline support
        const savedQuotes = localStorage.getItem('woodex_quotes');
        if (savedQuotes) setQuotes(JSON.parse(savedQuotes));

        // Load templates from localStorage
        const savedTemplates = localStorage.getItem('woodex_templates');
        if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
        
        // Load invoices from localStorage
        const savedInvoices = localStorage.getItem('woodex_invoices');
        if (savedInvoices) {
          const parsedInvoices: Invoice[] = JSON.parse(savedInvoices);
          const today = new Date();
          const updatedInvoices = parsedInvoices.map(inv => {
            if (inv.status === 'Paid') return inv;
            const [day, month, year] = inv.dueDate.split('/').map(Number);
            const dueDate = new Date(year, month - 1, day);
            if (dueDate < today && inv.status !== 'Overdue') {
              return { ...inv, status: 'Overdue' as const };
            }
            return inv;
          });
          setInvoices(updatedInvoices);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveQuote = (quote: Quote) => {
    const newQuotes = [quote, ...quotes];
    setQuotes(newQuotes);
    localStorage.setItem('woodex_quotes', JSON.stringify(newQuotes));
    setActiveTab('quotes');
    
    // Attempt to sync with server
    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    }).catch(err => console.warn("Offline: Saved locally, sync pending", err));
  };

  const handleSaveTemplate = (template: QuoteTemplate) => {
    const newTemplates = [template, ...templates];
    setTemplates(newTemplates);
    localStorage.setItem('woodex_templates', JSON.stringify(newTemplates));
  };

  const handleAddProduct = (p: Product) => {
    const newProducts = [p, ...products];
    setProducts(newProducts);
    localStorage.setItem('woodex_products', JSON.stringify(newProducts));
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.sku === updatedProduct.sku ? updatedProduct : p);
    setProducts(newProducts);
    localStorage.setItem('woodex_products', JSON.stringify(newProducts));
  };

  const handleRemoveProduct = (sku: string) => {
    const newProducts = products.filter(p => p.sku !== sku);
    setProducts(newProducts);
    localStorage.setItem('woodex_products', JSON.stringify(newProducts));
  };

  const handleRemoveTemplate = (id: string) => {
    const newTemplates = templates.filter(t => t.id !== id);
    setTemplates(newTemplates);
    localStorage.setItem('woodex_templates', JSON.stringify(newTemplates));
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-[#2D5A27] animate-pulse">Initializing Woodex System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setBuilderMode={setBuilderMode} />
      
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Dashboard quotes={quotes} />
            </motion.div>
          )}
          {activeTab === 'builder' && (
            <motion.div key="builder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <QuoteBuilder 
                products={products} 
                clients={clients} 
                templates={templates}
                quotes={quotes}
                mode={builderMode}
                onSave={(q) => {
                  if (builderMode === 'invoice') {
                    const newInvoice: Invoice = {
                      ...q,
                      invoiceId: 'INV-' + q.id.split('-')[1],
                      quoteId: q.id,
                      dueDate: format(addDays(new Date(), 7), 'dd/MM/yyyy'),
                      status: 'Unpaid',
                      amountPaid: 0,
                      payments: []
                    };
                    const newInvoices = [newInvoice, ...invoices];
                    setInvoices(newInvoices);
                    localStorage.setItem('woodex_invoices', JSON.stringify(newInvoices));
                    setActiveTab('invoices');
                  } else {
                    if (editingQuote) {
                      const newQuotes = quotes.map(existing => existing.id === q.id ? q : existing);
                      setQuotes(newQuotes);
                      localStorage.setItem('woodex_quotes', JSON.stringify(newQuotes));
                      setEditingQuote(null);
                    } else {
                      handleSaveQuote(q);
                    }
                    setActiveTab('quotes');
                  }
                }}
                onSaveTemplate={handleSaveTemplate}
                onRemoveTemplate={handleRemoveTemplate}
                lastQuoteId={quotes.length > 0 ? quotes[0].id : null}
                initialQuote={editingQuote || duplicateQuote}
                onClear={() => {
                  setEditingQuote(null);
                  setDuplicateQuote(null);
                }}
              />
            </motion.div>
          )}
          {activeTab === 'quotes' && (
            <motion.div key="quotes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <QuotesLog 
                quotes={quotes} 
                onEdit={(q) => {
                  setEditingQuote(q);
                  setDuplicateQuote(null);
                  setActiveTab('builder');
                }}
                onDuplicate={(quoteToDup) => {
                  const newQuote = {
                    ...quoteToDup,
                    id: generateQuoteId(quotes.length > 0 ? quotes[0].id : null) + '-DUP',
                    date: format(new Date(), 'dd/MM/yyyy'),
                    status: 'Draft' as const
                  };
                  setDuplicateQuote(newQuote);
                  setEditingQuote(null);
                  setActiveTab('builder');
                }}
                onPrint={printQuote}
                onShare={(q) => {
                  const shareData = {
                    title: `Quotation ${q.id} - WOODEX`,
                    text: `Quotation ${q.id} for ${q.clientName}\nTotal: ${formatCurrency(q.grandTotal)}`,
                    url: window.location.href
                  };

                  if (navigator.share) {
                    navigator.share(shareData).catch(err => {
                      console.warn("Sharing failed", err);
                      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                      alert('Sharing failed. Quotation details copied to clipboard instead.');
                    });
                  } else {
                    navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                    alert('Quotation details copied to clipboard!');
                  }
                }}
                onUpdateStatus={(id, status) => {
                  const quoteToUpdate = quotes.find(q => q.id === id);
                  if (!quoteToUpdate) return;

                  setQuotes(prev => {
                    const newQuotes = prev.map(q => q.id === id ? { ...q, status } : q);
                    localStorage.setItem('woodex_quotes', JSON.stringify(newQuotes));
                    return newQuotes;
                  });

                  // If status changed to Invoiced, automatically convert if not already done
                  if (status === 'Invoiced') {
                    setInvoices(prevInvoices => {
                      const existingInvoice = prevInvoices.find(inv => inv.quoteId === id);
                      if (!existingInvoice) {
                        const newInvoice: Invoice = {
                          ...quoteToUpdate,
                          status: 'Unpaid',
                          invoiceId: 'INV-' + quoteToUpdate.id.replace(/^WF-/, ''),
                          quoteId: quoteToUpdate.id,
                          dueDate: format(addDays(new Date(), 7), 'dd/MM/yyyy'),
                          amountPaid: 0,
                          payments: []
                        };
                        const newInvoices = [newInvoice, ...prevInvoices];
                        localStorage.setItem('woodex_invoices', JSON.stringify(newInvoices));
                        return newInvoices;
                      }
                      return prevInvoices;
                    });
                    setActiveTab('invoices');
                  }
                }}
                onConvertToInvoice={(q) => {
                  setInvoices(prevInvoices => {
                    const existingInvoice = prevInvoices.find(inv => inv.quoteId === q.id);
                    if (existingInvoice) {
                      return prevInvoices;
                    }
                    
                    const newInvoice: Invoice = {
                      ...q,
                      invoiceId: 'INV-' + q.id.replace(/^WF-/, ''),
                      quoteId: q.id,
                      dueDate: format(addDays(new Date(), 7), 'dd/MM/yyyy'),
                      status: 'Unpaid',
                      amountPaid: 0,
                      payments: []
                    };
                    const newInvoices = [newInvoice, ...prevInvoices];
                    localStorage.setItem('woodex_invoices', JSON.stringify(newInvoices));
                    return newInvoices;
                  });
                  
                  // Update quote status
                  setQuotes(prevQuotes => {
                    const newQuotes = prevQuotes.map(quote => quote.id === q.id ? { ...quote, status: 'Invoiced' as const } : quote);
                    localStorage.setItem('woodex_quotes', JSON.stringify(newQuotes));
                    return newQuotes;
                  });

                  setActiveTab('invoices');
                }}
              />
            </motion.div>
          )}
          {activeTab === 'invoices' && (
            <motion.div key="invoices" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Invoices 
                invoices={invoices} 
                onPrint={printQuote as any} 
                onUpdateInvoice={(updated) => {
                  const newInvoices = invoices.map(i => i.invoiceId === updated.invoiceId ? updated : i);
                  setInvoices(newInvoices);
                  localStorage.setItem('woodex_invoices', JSON.stringify(newInvoices));
                }}
                onCreateInvoice={() => {
                  setBuilderMode('invoice');
                  setActiveTab('builder');
                }}
              />
            </motion.div>
          )}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ProductCatalog 
                products={products} 
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onRemoveProduct={handleRemoveProduct}
              />
            </motion.div>
          )}
          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Clients 
                clients={clients} 
                quotes={quotes} 
                onAddClient={(client) => {
                  const newClients = [...clients, client];
                  setClients(newClients);
                  // In a real app, sync to server
                }} 
              />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SettingsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
