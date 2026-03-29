import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Grid3X3,
  Loader2,
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategories() {
  const { categories, fetchCategories, addCategory, editCategory, removeCategory, isLoading } = useProductStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    order: '0',
  });

  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        order: category.order.toString(),
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        order: categories.length.toString(),
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        order: parseInt(formData.order) || 0,
      };

      if (editingCategory) {
        await editCategory(editingCategory.$id, categoryData);
        toast.success('Category updated successfully!');
      } else {
        await addCategory(categoryData);
        toast.success('Category added successfully!');
      }

      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await removeCategory(categoryToDelete.$id);
      toast.success('Category deleted successfully!');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const confirmDelete = (category: any) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg text-forest">Categories</h1>
          <p className="text-warmbrown">Manage product categories</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-8 h-8 text-forest/40" />
            </div>
            <p className="text-warmbrown">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ivory-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Order</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Category Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Slug</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {categories.sort((a, b) => a.order - b.order).map((category) => (
                  <tr key={category.$id} className="hover:bg-ivory-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-warmbrown/40" />
                        <span className="font-medium text-forest">{category.order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-forest">{category.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-warmbrown bg-ivory-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-warmbrown max-w-xs truncate">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(category)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="heading-sm text-forest">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-forest font-medium">Category Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="input-organic mt-1"
                placeholder="e.g., Outdoor Plants"
                required
              />
            </div>

            <div>
              <Label className="text-forest font-medium">Slug *</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input-organic mt-1"
                placeholder="e.g., outdoor-plants"
                required
              />
              <p className="text-xs text-warmbrown mt-1">
                Used in URLs. Use lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <div>
              <Label className="text-forest font-medium">Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                rows={3}
                placeholder="Brief description of this category..."
              />
            </div>

            <div>
              <Label className="text-forest font-medium">Display Order</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="input-organic mt-1"
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-warmbrown mt-1">
                Categories are displayed in ascending order.
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
                  editingCategory ? 'Update Category' : 'Add Category'
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
            <DialogTitle className="heading-sm text-forest">Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-warmbrown">
              Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>? 
              This action cannot be undone. Products in this category will become uncategorized.
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
