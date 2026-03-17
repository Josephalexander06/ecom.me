import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_BASE = API_ROOT.endsWith('/api') ? API_ROOT : `${API_ROOT}/api`;

// --- AUTH STORE ---
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Login failed');
          
          set({ 
            user: data, 
            token: data.token, 
            isAuthenticated: true, 
            loading: false 
          });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Registration failed');

          set({ 
            user: data, 
            token: data.token, 
            isAuthenticated: true, 
            loading: false 
          });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => {
        set((state) => ({ user: { ...state.user, ...updatedUser } }));
      }
    }),
    {
      name: 'ecomme-auth-storage',
    }
  )
);

// --- UI STORE ---
export const useUIStore = create((set) => ({
  isNavSearchOpen: false,
  isMobileMenuOpen: false,
  isFilterSheetOpen: false,
  activeModal: null, // 'login' | 'register' | null

  toggleNavSearch: (val) => set((state) => ({ isNavSearchOpen: val !== undefined ? val : !state.isNavSearchOpen })),
  toggleMobileMenu: (val) => set((state) => ({ isMobileMenuOpen: val !== undefined ? val : !state.isMobileMenuOpen })),
  toggleFilterSheet: (val) => set((state) => ({ isFilterSheetOpen: val !== undefined ? val : !state.isFilterSheetOpen })),
  setActiveModal: (modal) => set({ activeModal: modal }),
  closeModals: () => set({ activeModal: null })
}));

// --- CART STORE ---
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        const id = product._id || product.id;
        set((state) => {
          const existing = state.items.find(item => item.productId === id);
          if (existing) {
            return {
              items: state.items.map(item =>
                item.productId === id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: id,
                name: product.name,
                image: product.images?.[0] || '',
                price: product.dealPrice || product.price,
                quantity: quantity
              }
            ]
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      get subtotal() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      }
    }),
    {
      name: 'ecomme-cart-storage',
    }
  )
);
