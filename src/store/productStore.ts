import { create } from 'zustand';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/lib/appwrite';
import type { Product, Category } from '@/types';

interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: (filters?: { categoryId?: string; search?: string; inStock?: boolean }) => Promise<void>;
  fetchProductById: (productId: string) => Promise<Product | null>;
  fetchCategories: (activeOnly?: boolean) => Promise<void>;
  
  // Admin actions
  addProduct: (productData: Omit<Product, '$id' | 'createdAt' | 'updatedAt' | 'isActive'>) => Promise<void>;
  editProduct: (productId: string, data: Partial<Product>) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  addCategory: (categoryData: Omit<Category, '$id' | 'createdAt' | 'isActive'>) => Promise<void>;
  editCategory: (categoryId: string, data: Partial<Category>) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async (filters) => {
    try {
      set({ isLoading: true, error: null });
      const products = await getProducts(filters);
      set({ products: products as unknown as Product[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch products', isLoading: false });
    }
  },

  fetchProductById: async (productId: string) => {
    try {
      set({ isLoading: true, error: null });
      const product = await getProductById(productId);
      set({ isLoading: false });
      return product as unknown as Product;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch product', isLoading: false });
      return null;
    }
  },

  fetchCategories: async (activeOnly = true) => {
    try {
      set({ isLoading: true, error: null });
      const categories = await getCategories(activeOnly);
      set({ categories: categories as unknown as Category[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories', isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      set({ isLoading: true, error: null });
      await createProduct(productData);
      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to create product', isLoading: false });
      throw error;
    }
  },

  editProduct: async (productId, data) => {
    try {
      set({ isLoading: true, error: null });
      await updateProduct(productId, data);
      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to update product', isLoading: false });
      throw error;
    }
  },

  removeProduct: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      await deleteProduct(productId);
      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete product', isLoading: false });
      throw error;
    }
  },

  addCategory: async (categoryData) => {
    try {
      set({ isLoading: true, error: null });
      await createCategory(categoryData);
      await get().fetchCategories(false);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to create category', isLoading: false });
      throw error;
    }
  },

  editCategory: async (categoryId, data) => {
    try {
      set({ isLoading: true, error: null });
      await updateCategory(categoryId, data);
      await get().fetchCategories(false);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to update category', isLoading: false });
      throw error;
    }
  },

  removeCategory: async (categoryId) => {
    try {
      set({ isLoading: true, error: null });
      await deleteCategory(categoryId);
      await get().fetchCategories(false);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete category', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
