import { API_BASE, authHeaders } from './api';

export const defaultSiteConfig = {
  showDealsSection: true,
  showRecommended: true,
  showCategoryPanels: true,
  showWideBanner: true,
  showBestsellers: true,
  showNewArrivals: true,
  showSellerSpotlight: true,
  showRecentlyViewed: true,
  globalAnnouncementEnabled: false,
  globalAnnouncementText: 'Welcome to ecom.me',
  freeShippingThreshold: 5000,
  defaultShippingCharge: 499
};

export const fetchSiteConfig = async () => {
  const response = await fetch(`${API_BASE}/site-config`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch site config');
  }
  return { ...defaultSiteConfig, ...data };
};

export const updateSiteConfig = async (config) => {
  const response = await fetch(`${API_BASE}/site-config`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(config)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update site config');
  }
  return { ...defaultSiteConfig, ...data };
};
