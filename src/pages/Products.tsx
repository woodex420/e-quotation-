import React, { useState } from 'react';
import { Plus, Search, Upload, Grid, List, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ProductForm from '../components/ProductForm';
import { toast } from 'sonner';

export default function Products() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([
    { id: 1, sku: 'WDX-10010', name: 'Workstation 4 Person', category: 'FURNITURE', price: 'Rs 55,000', stock: 12 },
    { id: 2, sku: 'WDX-10011', name: 'Workstation', category: 'FURNITURE', price: 'Rs 55,000', stock: 8 },
    { id: 3, sku: 'SOVEREIGN', name: 'SOVEREIGN', category: 'FURNITURE', price: 'Rs 165,000', stock: 5 },
    { id: 4, sku: 'OASIS-EXEC', name: 'OASIS Exec', category: 'FURNITURE', price: 'Rs 65,000', stock: 15 },
  ]);

  const handleAddProduct = (data: any) => {
    const newProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      sku: data.sku,
      name: data.name,
      category: data.category,
      price: `Rs ${data.unitPrice}`,
      stock: 0,
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
    toast.success('Product added successfully');
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
    toast.success('Product deleted successfully');
  };

  const filteredProducts = products.filter(p => 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Product Catalog</h1>
            <p className="text-gray-400">Manage your furniture inventory and pricing.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Upload size={18} />
              Export to Sheets
            </button>
            <button className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Upload size={18} />
              Import from Sheets
            </button>
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setIsModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Plus size={20} />
              ADD PRODUCT
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-600"
            />
          </div>
          <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
                <div className="bg-gray-950 h-32 flex items-center justify-center text-gray-600 text-sm">
                  Product Image
                </div>
                <div className="p-4">
                  <p className="text-cyan-400 text-xs font-bold mb-1">{product.sku}</p>
                  <h3 className="text-white font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-cyan-400 font-bold">{product.price}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="px-6 py-3 text-left text-sm font-bold">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">NAME</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">CATEGORY</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">PRICE</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">STOCK</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-cyan-400">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-white">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-cyan-400">{product.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{product.stock}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          title={selectedProduct ? 'Edit Product' : 'Add New Product'}
          size="md"
        >
          <ProductForm 
            onSubmit={handleAddProduct}
            initialData={selectedProduct}
          />
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Product"
          message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
        />
      </div>
    </div>
  );
}
