import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Leaf,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const { products, categories, fetchProducts, fetchCategories, addProduct, editProduct, removeProduct, isLoading } = useProductStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [] as string[],
    careTips: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.scientificName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        scientificName: product.scientificName || '',
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        images: product.images || [],
        careTips: product.careTips || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        scientificName: '',
        description: '',
        price: '',
        stock: '',
        categoryId: categories[0]?.$id || '',
        images: [],
        careTips: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const category = categories.find(c => c.$id === formData.categoryId);
      const productData = {
        name: formData.name,
        scientificName: formData.scientificName || undefined,
        description: formData.description || `${formData.name} - Premium quality plant`,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId,
        categoryName: category?.name || 'Uncategorized',
        images: formData.images,
        careTips: formData.careTips || 'Water regularly and provide adequate sunlight.',
      };

      if (editingProduct) {
        await editProduct(editingProduct.$id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }

      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await removeProduct(productToDelete.$id);
      toast.success('Product deleted successfully!');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const confirmDelete = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg text-forest">Products</h1>
          <p className="text-warmbrown">Manage your product catalog</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-ivory-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-organic"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-forest/40" />
            </div>
            <p className="text-warmbrown">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ivory-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredProducts.map((product) => (
                  <tr key={product.$id} className="hover:bg-ivory-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-ivory-100 rounded-lg flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-forest/30" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-forest">{product.name}</p>
                          {product.scientificName && (
                            <p className="text-xs text-warmbrown italic">{product.scientificName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-green">{product.categoryName}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-forest">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock < 10 
                          ? 'bg-red-100 text-red-800' 
                          : product.stock < 20 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(product)}
                          className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="heading-sm text-forest">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-forest font-medium">Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-organic mt-1"
                  placeholder="e.g., Hibiscus"
                  required
                />
              </div>
              <div>
                <Label className="text-forest font-medium">Scientific Name</Label>
                <Input
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  className="input-organic mt-1"
                  placeholder="e.g., Hibiscus rosa-sinensis"
                />
              </div>
            </div>

            <div>
              <Label className="text-forest font-medium">Category *</Label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.$id} value={category.$id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-forest font-medium">Price (₹) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-organic mt-1"
                  placeholder="299"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label className="text-forest font-medium">Stock Quantity *</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input-organic mt-1"
                  placeholder="50"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-forest font-medium">Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                rows={3}
                placeholder="Product description..."
              />
            </div>

            <div>
              <Label className="text-forest font-medium">Care Tips</Label>
              <textarea
                value={formData.careTips}
                onChange={(e) => setFormData({ ...formData, careTips: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                rows={2}
                placeholder="Care instructions..."
              />
            </div>

            <div>
              <Label className="text-forest font-medium">Image URLs (comma separated)</Label>
              <Input
                value={formData.images.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  images: e.target.value.split(',').map(url => url.trim()).filter(Boolean)
                })}
                className="input-organic mt-1"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <p className="text-xs text-warmbrown mt-1">
                Enter image URLs separated by commas
              </p>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                ) : (
                  editingProduct ? 'Update Product' : 'Add Product'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="heading-sm text-forest">Delete Product</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-warmbrown">
              Are you sure you want to delete <strong>{productToDelete?.name}</strong>? 
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
