import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fallbackProducts } from '../data/fallbackProducts';
import { API_BASE, authHeaders } from '../utils/api';

const StoreContext = createContext(null);

const CART_KEY = 'ecomme_cart';
const LOCAL_ORDERS_KEY = 'ecomme_local_orders';
const getProductId = (product) => product?._id || product?.id;
const effectivePrice = (product) => Number(product?.isDeal && product?.dealPrice ? product.dealPrice : product?.price || 0);

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({ categories: [], brands: [], priceRange: { min: 0, max: 0 } });
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState(() => readJSON(CART_KEY, []));
  const [orders, setOrders] = useState(() => readJSON(LOCAL_ORDERS_KEY, []));

  const refreshProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        setFacets(data.facets || { categories: [], brands: [], priceRange: { min: 0, max: 0 } });
        setIsUsingFallback(false);
      } else if (!Array.isArray(data) || data.length === 0) {
        setProducts(fallbackProducts);
        setIsUsingFallback(true);
      } else {
        setProducts(data);
        setIsUsingFallback(false);
      }
    } catch {
      setProducts(fallbackProducts);
      setIsUsingFallback(true);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [products]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (product, quantity = 1) => {
    const id = getProductId(product);
    if (!id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === id);
      if (existing) {
        return prev.map((item) =>
          item.productId === id
            ? { ...item, quantity: Math.max(1, item.quantity + quantity) }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: id,
          name: product.name,
          image: product.images?.[0] || '',
          quantity: Math.max(1, quantity),
          price: effectivePrice(product),
          stock: product.stock || 0
        }
      ];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async ({ userId, shippingAddress, paymentMethod, shippingAmount = 0 }) => {
    if (!cart.length) throw new Error('Cart is empty');
    const finalTotal = Number((cartSubtotal + Number(shippingAmount || 0)).toFixed(2));

    const payload = {
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: finalTotal,
      userId: userId,
      paymentMethod: paymentMethod || 'Card'
    };

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to place order');
      const created = await response.json();

      const localOrder = {
        _id: created.orderId,
        createdAt: new Date().toISOString(),
        totalAmount: payload.totalAmount,
        status: 'pending',
        items: payload.items,
        shippingAddress
      };
      setOrders((prev) => [localOrder, ...prev]);
      clearCart();
      refreshProducts();
      return localOrder;
    } catch {
      const localOrder = {
        _id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        totalAmount: payload.totalAmount,
        status: 'pending',
        items: payload.items,
        shippingAddress,
        isLocalOnly: true
      };
      setOrders((prev) => [localOrder, ...prev]);
      clearCart();
      return localOrder;
    }
  };

  const loadOrders = async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE}/orders/user/${userId}`, {
        headers: authHeaders()
      });
      if (!response.ok) throw new Error('Failed to load orders');
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        setOrders((prev) => {
          const nonLocal = prev.filter((o) => o.isLocalOnly);
          return [...data, ...nonLocal];
        });
      }
    } catch {
      // Keep local orders in fallback mode.
    }
  };

  const createProduct = async (productInput) => {
    const payload = {
      ...productInput,
      price: Number(productInput.price),
      stock: Number(productInput.stock),
      images: productInput.images?.length ? productInput.images : ['https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80']
    };

    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to create product');
      const created = await response.json();
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch {
      const created = {
        ...payload,
        _id: `local-product-${Date.now()}`,
        createdAt: new Date().toISOString(),
        averageRating: 0,
        soldCount: 0
      };
      setProducts((prev) => [created, ...prev]);
      return created;
    }
  };

  const value = {
    products,
    facets,
    loadingProducts,
    isUsingFallback,
    categories,
    cart,
    cartCount,
    cartSubtotal,
    orders,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    loadOrders,
    refreshProducts,
    createProduct
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return context;
};
