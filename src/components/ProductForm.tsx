import React, { useState } from 'react';
import { toast } from 'sonner';

interface ProductFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
}

export default function ProductForm({ onSubmit, isLoading = false, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState(initialData || {
    sku: '',
    name: '',
    category: '',
    unitPrice: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku?.trim()) newErrors.sku = 'SKU is required';
    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Price must be greater than 0';
    }
    if (!formData.category?.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    onSubmit(formData);
    setFormData({ sku: '', name: '', category: '', unitPrice: '', description: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">SKU *</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="e.g., WDX-001"
          className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 ${
            errors.sku ? 'border-red-500' : 'border-slate-700'
          }`}
        />
        {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product name"
          className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 ${
            errors.name ? 'border-red-500' : 'border-slate-700'
          }`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-emerald-500 ${
            errors.category ? 'border-red-500' : 'border-slate-700'
          }`}
        >
          <option value="">Select Category</option>
          <option value="Furniture">Furniture</option>
          <option value="Office">Office</option>
          <option value="Fixtures">Fixtures</option>
          <option value="Accessories">Accessories</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Unit Price *</label>
        <input
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 ${
            errors.unitPrice ? 'border-red-500' : 'border-slate-700'
          }`}
        />
        {errors.unitPrice && <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product description"
          rows={3}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
