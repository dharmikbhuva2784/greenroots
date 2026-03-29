import { Client, Account, Databases, Storage, ID, Query, type OAuthProvider } from 'appwrite';

// Appwrite Configuration
// Replace these with your actual Appwrite project credentials
export const APPWRITE_CONFIG = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || '',
  
  // Collection IDs
  collections: {
    users: 'users',
    categories: 'categories',
    products: 'products',
    orders: 'orders',
    settings: 'settings',
    reviews: 'reviews',
    faqs: 'faqs',
  },
  
  // Bucket IDs
  buckets: {
    products: 'product-images',
    categories: 'category-images',
  },
};

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(APPWRITE_CONFIG.endpoint);
client.setProject(APPWRITE_CONFIG.projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database IDs
const DB_ID = APPWRITE_CONFIG.databaseId;

// ==================== USER OPERATIONS ====================

export const createUserDocument = async (userId: string, userData: {
  email: string;
  name: string;
  phone?: string;
  role?: string;
  address?: object;
}) => {
  try {
    return await databases.createDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.users,
      userId,
      {
        ...userData,
        role: userData.role || 'customer',
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const getUserDocument = async (userId: string) => {
  try {
    return await databases.getDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.users,
      userId
    );
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
};

export const updateUserDocument = async (userId: string, data: object) => {
  try {
    return await databases.updateDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.users,
      userId,
      data
    );
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

// ==================== CATEGORY OPERATIONS ====================

export const getCategories = async (activeOnly = true) => {
  try {
    const queries = activeOnly ? [Query.equal('isActive', true), Query.orderAsc('order')] : [Query.orderAsc('order')];
    const response = await databases.listDocuments(
      DB_ID,
      APPWRITE_CONFIG.collections.categories,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const createCategory = async (categoryData: {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}) => {
  try {
    return await databases.createDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.categories,
      ID.unique(),
      {
        ...categoryData,
        isActive: true,
        order: categoryData.order || 0,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, data: object) => {
  try {
    return await databases.updateDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.categories,
      categoryId,
      data
    );
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await databases.deleteDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.categories,
      categoryId
    );
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ==================== PRODUCT OPERATIONS ====================

export const getProducts = async (filters?: {
  categoryId?: string;
  search?: string;
  inStock?: boolean;
}) => {
  try {
    const queries: string[] = [Query.equal('isActive', true), Query.orderDesc('createdAt')];
    
    if (filters?.categoryId) {
      queries.push(Query.equal('categoryId', filters.categoryId));
    }
    
    if (filters?.inStock) {
      queries.push(Query.greaterThan('stock', 0));
    }
    
    const response = await databases.listDocuments(
      DB_ID,
      APPWRITE_CONFIG.collections.products,
      queries
    );
    
    let products = response.documents;
    
    // Client-side search if needed
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.scientificName?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (productId: string) => {
  try {
    return await databases.getDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.products,
      productId
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (productData: {
  name: string;
  scientificName?: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  images: string[];
  careTips?: string;
}) => {
  try {
    return await databases.createDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.products,
      ID.unique(),
      {
        ...productData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, data: object) => {
  try {
    return await databases.updateDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.products,
      productId,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await databases.deleteDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.products,
      productId
    );
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ==================== ORDER OPERATIONS ====================

export const getOrders = async (filters?: {
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queries: string[] = [Query.orderDesc('createdAt')];
    
    if (filters?.userId) {
      queries.push(Query.equal('userId', filters.userId));
    }
    
    if (filters?.status) {
      queries.push(Query.equal('status', filters.status));
    }
    
    if (filters?.startDate) {
      queries.push(Query.greaterThanEqual('createdAt', filters.startDate));
    }
    
    if (filters?.endDate) {
      queries.push(Query.lessThanEqual('createdAt', filters.endDate));
    }
    
    const response = await databases.listDocuments(
      DB_ID,
      APPWRITE_CONFIG.collections.orders,
      queries
    );
    
    return response.documents;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    return await databases.getDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.orders,
      orderId
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const createOrder = async (orderData: {
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: object;
  items: object[];
  subtotal: number;
  taxAmount: number;
  taxPercentage: number;
  total: number;
  paymentMethod: string;
}) => {
  try {
    const now = new Date().toISOString();
    return await databases.createDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.orders,
      ID.unique(),
      {
        ...orderData,
        paymentStatus: 'pending',
        status: 'order_placed',
        statusHistory: [
          {
            status: 'order_placed',
            timestamp: now,
            note: 'Order placed successfully',
          },
        ],
        createdAt: now,
        updatedAt: now,
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
  try {
    const order = await getOrderById(orderId);
    if (!order) throw new Error('Order not found');
    
    const statusHistory = [...(order.statusHistory || [])];
    statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`,
    });
    
    return await databases.updateDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.orders,
      orderId,
      {
        status,
        statusHistory,
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updateOrderPayment = async (orderId: string, paymentStatus: string) => {
  try {
    return await databases.updateDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.orders,
      orderId,
      {
        paymentStatus,
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error updating order payment:', error);
    throw error;
  }
};

// ==================== SETTINGS OPERATIONS ====================

export const getSettings = async () => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      APPWRITE_CONFIG.collections.settings,
      [Query.limit(1)]
    );
    return response.documents[0] || null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

export const updateSettings = async (settingsId: string, data: object) => {
  try {
    return await databases.updateDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.settings,
      settingsId,
      data
    );
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// ==================== FILE STORAGE OPERATIONS ====================

export const uploadFile = async (file: File, bucketId: string) => {
  try {
    const response = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );
    return response.$id;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFilePreview = (bucketId: string, fileId: string) => {
  return storage.getFilePreview(bucketId, fileId);
};

export const getFileView = (bucketId: string, fileId: string) => {
  return storage.getFileView(bucketId, fileId);
};

export const deleteFile = async (bucketId: string, fileId: string) => {
  try {
    await storage.deleteFile(bucketId, fileId);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// ==================== AUTH HELPERS ====================

export const loginWithEmail = (email: string, password: string) => {
  return account.createEmailPasswordSession(email, password);
};

export const loginWithGoogle = () => {
  return account.createOAuth2Session(
    'google' as OAuthProvider,
    `${window.location.origin}/`,
    `${window.location.origin}/login`
  );
};

export const sendPhoneOTP = async (_phone: string) => {
  // Appwrite doesn't have built-in phone OTP, you'll need to implement
  // this using a third-party service like Twilio or Firebase
  // For now, we'll return a mock token
  return { userId: ID.unique(), secret: 'mock-secret' };
};

export const createPhoneSession = async (userId: string, secret: string) => {
  // Mock implementation - replace with actual phone authentication
  return account.createSession(userId, secret);
};

export const registerWithEmail = (email: string, password: string, name: string) => {
  return account.create(ID.unique(), email, password, name);
};

export const logout = () => {
  return account.deleteSession('current');
};

export const getCurrentUser = () => {
  return account.get();
};

// ==================== REVIEW OPERATIONS ====================

export const getProductReviews = async (productId: string) => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      APPWRITE_CONFIG.collections.reviews,
      [
        Query.equal('productId', productId),
        Query.orderDesc('createdAt'),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const getUserReviews = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      APPWRITE_CONFIG.collections.reviews,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt'),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

export const createReview = async (reviewData: {
  productId: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number;
  comment: string;
}) => {
  try {
    return await databases.createDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.reviews,
      ID.unique(),
      {
        ...reviewData,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    await databases.deleteDocument(
      DB_ID,
      APPWRITE_CONFIG.collections.reviews,
      reviewId
    );
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// ==================== FAQ OPERATIONS ====================

export const getFAQs = async (activeOnly = true) => {
  try {
    const queries: string[] = [Query.orderAsc('order')];
    if (activeOnly) {
      queries.push(Query.equal('isActive', true));
    }
    const response = await databases.listDocuments(
      DB_ID,
      APPWRITE_CONFIG.collections.faqs,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
};

export { ID, Query };
