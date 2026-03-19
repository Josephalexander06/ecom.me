const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

const resolveApiRoot = () => {
  if (rawApiBaseUrl) {
    return rawApiBaseUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    return origin;
  }

  return 'http://localhost:5000';
};

const apiRoot = resolveApiRoot();
export const API_BASE = apiRoot.endsWith('/api') ? apiRoot : `${apiRoot}/api`;

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem('ecomme-auth-storage');
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.state?.token || null,
      user: parsed?.state?.user || null
    };
  } catch {
    return { token: null, user: null };
  }
};

export const authHeaders = (extra = {}) => {
  const { token } = getStoredAuth();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};
