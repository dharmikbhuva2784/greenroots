import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getCurrentUser, 
  logout, 
  loginWithEmail, 
  registerWithEmail,
  getUserDocument,
  createUserDocument,
  loginWithGoogle,
  updateUserDocument as updateUserDoc
} from '@/lib/appwrite';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  checkAuth: () => Promise<void>;
  login: (email: string, password: string, autoCreate?: boolean) => Promise<{ created: boolean }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  googleLogin: () => void;
  logout: () => Promise<void>;
  updateUserDocument: (userId: string, data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const session = await getCurrentUser();
          const userDoc = await getUserDocument(session.$id);
          
          if (userDoc) {
            set({
              user: {
                $id: userDoc.$id,
                email: userDoc.email,
                name: userDoc.name,
                phone: userDoc.phone,
                role: userDoc.role,
                address: userDoc.address,
                createdAt: userDoc.createdAt,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Create user document if it doesn't exist
            await createUserDocument(session.$id, {
              email: session.email,
              name: session.name,
              role: 'customer',
            });
            
            set({
              user: {
                $id: session.$id,
                email: session.email,
                name: session.name,
                role: 'customer',
                createdAt: new Date().toISOString(),
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      login: async (email: string, password: string, autoCreate: boolean = false) => {
        try {
          set({ isLoading: true, error: null });
          
          // Check for admin credentials
          if (email === 'admin@greenroots.in' && password === 'admin123') {
            const mockAdminUser: User = {
              $id: 'admin-user',
              email: 'admin@greenroots.in',
              name: 'Admin User',
              role: 'admin',
              createdAt: new Date().toISOString(),
            };
            set({
              user: mockAdminUser,
              isAuthenticated: true,
              isLoading: false,
            });
            return { created: false };
          }
          
          try {
            const session = await loginWithEmail(email, password);
            const userDoc = await getUserDocument(session.userId);
            
            if (userDoc) {
              set({
                user: {
                  $id: userDoc.$id,
                  email: userDoc.email,
                  name: userDoc.name,
                  phone: userDoc.phone,
                  role: userDoc.role,
                  address: userDoc.address,
                  createdAt: userDoc.createdAt,
                },
                isAuthenticated: true,
                isLoading: false,
              });
            }
            return { created: false };
          } catch (loginError: any) {
            // If auto-create is enabled and user doesn't exist, try to register
            if (autoCreate && (loginError.message?.includes('Invalid credentials') || loginError.code === 401)) {
              // Extract name from email (before @)
              const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              try {
                const account = await registerWithEmail(email, password, nameFromEmail);
                await createUserDocument(account.$id, {
                  email: account.email,
                  name: account.name,
                  role: 'customer',
                });
                
                set({
                  user: {
                    $id: account.$id,
                    email: account.email,
                    name: account.name,
                    role: 'customer',
                    createdAt: new Date().toISOString(),
                  },
                  isAuthenticated: true,
                  isLoading: false,
                });
                return { created: true };
              } catch (registerError: any) {
                throw loginError; // Throw original login error
              }
            }
            throw loginError;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed. Please check your credentials.',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string, phone?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const account = await registerWithEmail(email, password, name);
          await createUserDocument(account.$id, {
            email: account.email,
            name: account.name,
            phone,
            role: 'customer',
          });
          
          // Auto-login after registration
          await loginWithEmail(email, password);
          
          set({
            user: {
              $id: account.$id,
              email: account.email,
              name: account.name,
              phone,
              role: 'customer',
              createdAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed. Please try again.',
            isLoading: false,
          });
          throw error;
        }
      },

      googleLogin: () => {
        loginWithGoogle();
      },

      updateUserDocument: async (userId: string, data: Partial<User>) => {
        try {
          await updateUserDoc(userId, data);
          const currentUser = get().user;
          if (currentUser && currentUser.$id === userId) {
            set({ user: { ...currentUser, ...data } });
          }
        } catch (error: any) {
          throw error;
        }
      },

      logout: async () => {
        try {
          // Only call Appwrite logout if not admin
          if (get().user?.$id !== 'admin-user') {
            await logout();
          }
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
