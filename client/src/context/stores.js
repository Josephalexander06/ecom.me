import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE, apiFetchJson } from '../utils/api';

const getErrorMessage = (error) =>
  error instanceof TypeError
    ? 'Unable to reach the server. Check that the backend is running and CORS/API URL are configured.'
    : error.message;

// --- AUTH STORE ---
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      location: { city: 'Mumbai', pincode: '400001' },
      hasSetLocation: false,

      setLocation: (loc) => set({ location: loc, hasSetLocation: true }),

      detectLocation: async () => {
        if (!navigator.geolocation) return;
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                  {
                    headers: { 'Accept-Language': 'en', 'User-Agent': 'ecom.me-demo' }
                  }
                );
                const data = await response.json();
                if (data && data.address) {
                  const city = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Mumbai';
                  const postCode = data.address.postcode || '400001';
                  const newLoc = { city, pincode: postCode };
                  set({ location: newLoc, hasSetLocation: true });
                  resolve(newLoc);
                }
              } catch (error) {
                console.error('Location Error:', error);
                reject(error);
              }
            },
            (error) => {
              console.error('Geolocation Error:', error);
              reject(error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        });
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await apiFetchJson(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          set({ 
            user: data, 
            token: data.token, 
            isAuthenticated: true, 
            loading: false 
          });
          return data;
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await apiFetchJson(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });

          set({ 
            user: data, 
            token: data.token, 
            isAuthenticated: true, 
            loading: false 
          });
          return data;
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => {
        set((state) => ({ user: { ...state.user, ...updatedUser } }));
      },

      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const token = get().token;
          const data = await apiFetchJson(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(profileData),
          });

          set((state) => ({
            user: { ...state.user, ...data },
            loading: false
          }));
          return data;
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      upgradeUser: async (storeName, bankAccount) => {
        set({ loading: true, error: null });
        try {
          const token = get().token;
          const data = await apiFetchJson(`${API_BASE}/auth/upgrade-to-seller`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ storeName, bankAccount }),
          });

          set((state) => ({
            user: { ...state.user, ...data },
            loading: false
          }));
          return data;
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      toggleWishlist: async (productId) => {
        if (!get().isAuthenticated) throw new Error('Sign in to save items');
        try {
          const token = get().token;
          const data = await apiFetchJson(`${API_BASE}/auth/wishlist/${productId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
          });

          set((state) => ({
            user: { ...state.user, wishlist: data.wishlist }
          }));
          return data;
        } catch (error) {
          console.error(error);
          throw error;
        }
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
      recentlyViewed: [],
      
      trackProduct: (product) => {
        set((state) => {
          const recentlyViewed = Array.isArray(state.recentlyViewed) ? state.recentlyViewed : [];
          const filtered = recentlyViewed.filter((p) => (p?._id || p?.id) !== (product?._id || product?.id));
          return {
            recentlyViewed: [product, ...filtered].slice(0, 10)
          };
        });
      },

      addItem: (product, quantity = 1) => {
        const id = product._id || product.id;
        set((state) => {
          const items = Array.isArray(state.items) ? state.items : [];
          const existing = items.find(item => item.productId === id);
          if (existing) {
            return {
              items: items.map(item =>
                item.productId === id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return {
            items: [
              ...items,
              {
                productId: id,
                name: product.name,
                image: product.images?.[0] || '',
                price: Number(product.dealPrice || product.price),
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

      clearCart: () => set({ items: [] })
    }),
    {
      name: 'ecomme-cart-storage',
    }
  )
);
