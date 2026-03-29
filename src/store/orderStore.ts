import { create } from 'zustand';
import { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus,
  updateOrderPayment
} from '@/lib/appwrite';
import type { Order, OrderStatus, OrderFilters } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Getters
  getUserOrders: (userId: string) => Order[];
  getOrderStats: () => {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
  
  // Actions
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  fetchUserOrders: (userId: string) => Promise<void>;
  placeOrder: (orderData: Omit<Order, '$id' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory' | 'paymentStatus'>) => Promise<Order | null>;
  updateStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  updatePayment: (orderId: string, paymentStatus: string) => Promise<void>;
  clearCurrentOrder: () => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  getUserOrders: (userId: string) => {
    return get().orders.filter(order => order.userId === userId);
  },

  getOrderStats: () => {
    const orders = get().orders;
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
    };
  },

  fetchOrders: async (filters) => {
    try {
      set({ isLoading: true, error: null });
      const orders = await getOrders(filters);
      set({ orders: orders as unknown as Order[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch orders', isLoading: false });
    }
  },

  fetchOrderById: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });
      const order = await getOrderById(orderId);
      set({ currentOrder: order as unknown as Order, isLoading: false });
      return order as unknown as Order;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch order', isLoading: false });
      return null;
    }
  },

  fetchUserOrders: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const orders = await getOrders({ userId });
      set({ orders: orders as unknown as Order[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch user orders', isLoading: false });
    }
  },

  placeOrder: async (orderData) => {
    try {
      set({ isLoading: true, error: null });
      const order = await createOrder(orderData);
      set({ 
        currentOrder: order as unknown as Order, 
        orders: [order as unknown as Order, ...get().orders],
        isLoading: false 
      });
      return order as unknown as Order;
    } catch (error: any) {
      set({ error: error.message || 'Failed to place order', isLoading: false });
      return null;
    }
  },

  updateStatus: async (orderId, status, note) => {
    try {
      set({ isLoading: true, error: null });
      await updateOrderStatus(orderId, status, note);
      
      // Update local state
      const updatedOrders = get().orders.map(order =>
        order.$id === orderId ? { ...order, status } as Order : order
      );
      
      set({ 
        orders: updatedOrders,
        currentOrder: get().currentOrder?.$id === orderId 
          ? { ...get().currentOrder, status } as Order 
          : get().currentOrder,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to update order status', isLoading: false });
      throw error;
    }
  },

  updatePayment: async (orderId, paymentStatus) => {
    try {
      set({ isLoading: true, error: null });
      await updateOrderPayment(orderId, paymentStatus);
      
      const updatedOrders = get().orders.map(order =>
        order.$id === orderId ? { ...order, paymentStatus } as Order : order
      );
      
      set({ 
        orders: updatedOrders,
        currentOrder: get().currentOrder?.$id === orderId 
          ? { ...get().currentOrder, paymentStatus } as Order 
          : get().currentOrder,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to update payment status', isLoading: false });
      throw error;
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
  clearError: () => set({ error: null }),
}));
