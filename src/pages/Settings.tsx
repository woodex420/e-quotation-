import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'WOODEX',
    email: 'info@woodex.pk',
    phone: '+92-321-7779522',
    addressPK: 'L5, ZAMAAR TOWER MODEL TOWN LINK ROAD LAHORE',
    addressUAE: 'UAE Address Here',
    taxRate: 0,
    advancePercentage: 75,
    termsConditions: '• Delivery will be made within 14-21 working days after receipt of advance payment.\n• Quotation is valid for 30 days from the date of issue.\n• Colors and finishes may vary slightly from digital catalog.\n• Installation is included in the total price within Dalal area.\n• 75% Advance payment is required to process the order.',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!settings.companyName?.trim()) newErrors.companyName = 'Company name is required';
    if (!settings.email?.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!settings.phone?.trim()) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your company information and system configuration</p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Company Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Company Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 ${
                    errors.companyName ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 ${
                    errors.email ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 ${
                    errors.phone ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Office Address (Pakistan)</label>
                <textarea
                  name="addressPK"
                  value={settings.addressPK}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Office Address (UAE)</label>
                <textarea
                  name="addressUAE"
                  value={settings.addressUAE}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Financial Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Advance Payment (%)</label>
                <input
                  type="number"
                  name="advancePercentage"
                  value={settings.advancePercentage}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Terms & Conditions</h2>

            <textarea
              name="termsConditions"
              value={settings.termsConditions}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="Enter your terms and conditions"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isLoading ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* Company Logo */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Company Logo</h3>
            <div className="w-full aspect-square bg-slate-900 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
              <div className="text-center">
                <Upload size={32} className="text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Click to upload logo</p>
              </div>
            </div>
          </div>

          {/* Settings Summary */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Current Settings</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Tax Rate:</span>
                <span className="text-white font-mono">{settings.taxRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Advance Payment:</span>
                <span className="text-white font-mono">{settings.advancePercentage}%</span>
              </div>
              <div className="pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-500">Last Updated: Today</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
