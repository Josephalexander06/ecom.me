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

const safeJsonParse = (text) => {
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const parseApiResponse = async (response) => {
  const text = await response.text();
  const data = safeJsonParse(text);
  return { text, data };
};

export const apiFetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const { text, data } = await parseApiResponse(response);

  if (!response.ok) {
    const fallback =
      response.status === 404 && url.includes('/api/')
        ? `API route not found (${url}). Check VITE_API_BASE_URL and backend deployment.`
        : `Request failed (${response.status})`;
    throw new Error(data?.message || fallback);
  }

  if (data === null) {
    throw new Error(
      `API did not return JSON for ${url}.` +
      (text ? ` Response starts with: ${text.slice(0, 80)}` : '')
    );
  }

  return data;
};
