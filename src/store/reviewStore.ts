import { create } from 'zustand';
import { 
  getProductReviews, 
  getUserReviews, 
  createReview, 
  deleteReview 
} from '@/lib/appwrite';
import type { Review } from '@/types';

interface ReviewState {
  reviews: Review[];
  userReviews: Review[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProductReviews: (productId: string) => Promise<void>;
  fetchUserReviews: (userId: string) => Promise<void>;
  addReview: (reviewData: Omit<Review, '$id' | 'createdAt'>) => Promise<void>;
  removeReview: (reviewId: string) => Promise<void>;
  getProductRating: (productId: string) => { average: number; count: number };
  hasUserReviewed: (userId: string, productId: string) => boolean;
  clearError: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  userReviews: [],
  isLoading: false,
  error: null,

  fetchProductReviews: async (productId: string) => {
    try {
      set({ isLoading: true, error: null });
      const reviews = await getProductReviews(productId);
      set({ reviews: reviews as unknown as Review[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch reviews', isLoading: false });
    }
  },

  fetchUserReviews: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const reviews = await getUserReviews(userId);
      set({ userReviews: reviews as unknown as Review[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch user reviews', isLoading: false });
    }
  },

  addReview: async (reviewData) => {
    try {
      set({ isLoading: true, error: null });
      await createReview(reviewData);
      await get().fetchProductReviews(reviewData.productId);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to add review', isLoading: false });
      throw error;
    }
  },

  removeReview: async (reviewId: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteReview(reviewId);
      set((state) => ({
        reviews: state.reviews.filter(r => r.$id !== reviewId),
        userReviews: state.userReviews.filter(r => r.$id !== reviewId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete review', isLoading: false });
      throw error;
    }
  },

  getProductRating: (productId: string) => {
    const productReviews = get().reviews.filter(r => r.productId === productId);
    if (productReviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return { average: sum / productReviews.length, count: productReviews.length };
  },

  hasUserReviewed: (userId: string, productId: string) => {
    return get().reviews.some(r => r.userId === userId && r.productId === productId);
  },

  clearError: () => set({ error: null }),
}));
