import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Globe2,
  Megaphone,
  PackageSearch,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  ShoppingBag,
  Trash2,
  UserX,
  Users,
  XCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import AdminLayout from '../components/admin/AdminLayout';
import { API_BASE, authHeaders } from '../utils/api';
import { defaultSiteConfig, fetchSiteConfig, updateSiteConfig } from '../utils/siteConfig';

const sectionByPath = {
  '/admin/dashboard': 'overview',
  '/admin/sellers': 'sellers',
  '/admin/users': 'users',
  '/admin/orders': 'orders',
  '/admin/products': 'products',
  '/admin/analytics': 'analytics',
  '/admin/settings': 'controls',
  '/admin/controls': 'controls',
  '/admin/controls/site': 'controls',
  '/admin/controls/policies': 'controls',
  '/admin/controls/settlements': 'controls',
};

const pathBySection = Object.entries(sectionByPath).reduce((acc, [path, section]) => {
  acc[section] = path;
  return acc;
}, {});

const tabMeta = {
  overview: { label: 'Overview', icon: Globe2 },
  sellers: { label: 'Sellers', icon: CheckCircle2 },
  users: { label: 'Users', icon: Users },
  orders: { label: 'Orders', icon: ShoppingBag },
  products: { label: 'Products', icon: PackageSearch },
  analytics: { label: 'Analytics', icon: BarChart3 },
  controls: { label: 'Controls', icon: Settings2 },
};

const defaultAdminOpsControls = {
  allowCashOnDelivery: true,
  allowGuestCheckout: false,
  autoApproveSellers: false,
  strictCatalogModeration: true,
  allowSellerSelfOnboarding: true,
  returnsEnabled: true,
  maxProductsPerSeller: 1200,
  maxOrderItems: 15,
  supportEscalationHours: 24,
  commissionRatePercent: 18,
  settlementCycleDays: 7,
  settlementReservePercent: 5,
  autoPayoutEnabled: true,
};

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);
  const [configDraft, setConfigDraft] = useState(defaultSiteConfig);
  const [loading, setLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [opsControls, setOpsControls] = useState(() => {
    try {
      const raw = localStorage.getItem('ecomme_admin_ops_controls');
      if (!raw) return defaultAdminOpsControls;
      return { ...defaultAdminOpsControls, ...JSON.parse(raw) };
    } catch {
      return defaultAdminOpsControls;
    }
  });

  const activeSection = sectionByPath[location.pathname] || 'overview';
  const activeControlTab = location.pathname.startsWith('/admin/controls/settlements')
    ? 'settlements'
    : location.pathname.startsWith('/admin/controls/policies')
      ? 'policies'
      : 'site';

  const goSection = (section) => {
    const next = section === 'controls' ? '/admin/controls/site' : pathBySection[section] || '/admin/dashboard';
    if (next !== location.pathname) navigate(next);
  };

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [d, s, u, o, p, cfg] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, { headers: authHeaders() }),
        fetch(`${API_BASE}/admin/sellers`, { headers: authHeaders() }),
        fetch(`${API_BASE}/admin/users`, { headers: authHeaders() }),
        fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() }),
        fetch(`${API_BASE}/products`, { headers: authHeaders() }),
        fetchSiteConfig(),
      ]);

      const [dData, sData, uData, oData, pData] = await Promise.all([d.json(), s.json(), u.json(), o.json(), p.json()]);

      if (!d.ok) throw new Error(dData.message || 'Failed to load dashboard');
      if (!s.ok) throw new Error(sData.message || 'Failed to load sellers');
      if (!u.ok) throw new Error(uData.message || 'Failed to load users');
      if (!o.ok) throw new Error(oData.message || 'Failed to load orders');
      if (!p.ok) throw new Error(pData.message || 'Failed to load products');

      setDashboard(dData);
      setSellers(Array.isArray(sData) ? sData : []);
      setUsers(Array.isArray(uData) ? uData : []);
      setOrders(Array.isArray(oData) ? oData : []);
      setProducts(Array.isArray(pData?.products) ? pData.products : []);
      setSiteConfig(cfg);
      setLastUpdatedAt(new Date());
    } catch (error) {
      toast.error(error.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setConfigDraft(siteConfig);
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('ecomme_admin_ops_controls', JSON.stringify(opsControls));
  }, [opsControls]);

  const filteredSellers = useMemo(
    () => sellers.filter((s) => `${s.name || ''} ${s.email || ''}`.toLowerCase().includes(searchQuery.toLowerCase())),
    [sellers, searchQuery]
  );

  const filteredUsers = useMemo(
    () => users.filter((u) => `${u.name || ''} ${u.email || ''}`.toLowerCase().includes(searchQuery.toLowerCase())),
    [users, searchQuery]
  );

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return orders
      .filter((order) => {
        const id = String(order?._id || '').toLowerCase();
        const status = String(order?.status || '').toLowerCase();
        return id.includes(q) || status.includes(q);
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, searchQuery]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter((p) => `${p.name || ''} ${p.brand || ''} ${p.category || ''}`.toLowerCase().includes(q));
  }, [products, searchQuery]);

  const pendingSellers = useMemo(
    () => sellers.filter((s) => String(s.sellerStatus || '').toLowerCase() === 'pending'),
    [sellers]
  );

  const blockedUsers = useMemo(() => users.filter((u) => Boolean(u.isBlocked)), [users]);

  const lowStockProducts = useMemo(
    () => products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) < 10),
    [products]
  );

  const outOfStockProducts = useMemo(
    () => products.filter((p) => Number(p.stock || 0) <= 0),
    [products]
  );

  const unshippedOrders = useMemo(
    () => orders.filter((o) => ['pending', 'confirmed', 'packed'].includes(String(o.status || '').toLowerCase())),
    [orders]
  );

  const stats = useMemo(
    () => [
      { label: 'Total Users', value: dashboard?.totalUsers || 0, helper: `${blockedUsers.length} blocked`, icon: Users },
      {
        label: 'Total Orders',
        value: dashboard?.totalOrders || 0,
        helper: `${unshippedOrders.length} in fulfillment`,
        icon: ShoppingBag,
      },
      {
        label: 'Revenue',
        value: `₹${Number(dashboard?.totalRevenue || 0).toLocaleString('en-IN')}`,
        helper: 'Gross platform revenue',
        icon: Shield,
      },
      {
        label: 'Pending Seller Approvals',
        value: pendingSellers.length,
        helper: `${lowStockProducts.length} low-stock alerts`,
        icon: Clock3,
      },
    ],
    [dashboard, blockedUsers.length, unshippedOrders.length, pendingSellers.length, lowStockProducts.length]
  );

  const ordersByStatus = useMemo(() => {
    const map = { pending: 0, confirmed: 0, packed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => {
      const status = (o.status || 'pending').toLowerCase();
      map[status] = (map[status] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [orders]);

  const categoryDistribution = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const category = p.category || 'Uncategorized';
      map[category] = (map[category] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [products]);

  const mostViewed = useMemo(
    () => [...products].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6),
    [products]
  );

  const bestSelling = useMemo(
    () => [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 6),
    [products]
  );

  const riskQueue = useMemo(
    () => [
      {
        title: 'Seller approvals pending',
        count: pendingSellers.length,
        severity: pendingSellers.length > 5 ? 'high' : pendingSellers.length > 0 ? 'medium' : 'low',
        action: () => goSection('sellers'),
      },
      {
        title: 'Orders not yet shipped',
        count: unshippedOrders.length,
        severity: unshippedOrders.length > 20 ? 'high' : unshippedOrders.length > 0 ? 'medium' : 'low',
        action: () => goSection('orders'),
      },
      {
        title: 'Products out of stock',
        count: outOfStockProducts.length,
        severity: outOfStockProducts.length > 20 ? 'high' : outOfStockProducts.length > 0 ? 'medium' : 'low',
        action: () => goSection('products'),
      },
      {
        title: 'Blocked users',
        count: blockedUsers.length,
        severity: blockedUsers.length > 10 ? 'medium' : blockedUsers.length > 0 ? 'low' : 'low',
        action: () => goSection('users'),
      },
    ],
    [pendingSellers.length, unshippedOrders.length, outOfStockProducts.length, blockedUsers.length]
  );

  const slaBoard = useMemo(() => {
    const lanes = [
      { status: 'pending', label: 'Pending Review', targetHours: 1 },
      { status: 'confirmed', label: 'Confirmed', targetHours: 4 },
      { status: 'packed', label: 'Packed', targetHours: 8 },
      { status: 'shipped', label: 'Shipped', targetHours: 24 },
    ];
    const now = Date.now();

    return lanes.map((lane) => {
      const laneOrders = orders.filter((o) => String(o.status || '').toLowerCase() === lane.status);
      const overdue = laneOrders.filter((o) => {
        if (!o.createdAt) return false;
        const ageHours = (now - new Date(o.createdAt).getTime()) / (1000 * 60 * 60);
        return ageHours > lane.targetHours;
      }).length;
      return { ...lane, total: laneOrders.length, overdue };
    });
  }, [orders]);

  const fraudSignals = useMemo(() => {
    const highValueOrders = orders.filter((o) => Number(o.totalAmount || 0) >= 50000);
    const highValueCOD = orders.filter(
      (o) => String(o.paymentMethod || '').toLowerCase().includes('cod') && Number(o.totalAmount || 0) >= 20000
    );
    const userOrderMap = {};
    orders.forEach((o) => {
      const uid = String(o.userId || o.user || '');
      if (!uid) return;
      userOrderMap[uid] = (userOrderMap[uid] || 0) + 1;
    });
    const rapidRepeatBuyers = Object.values(userOrderMap).filter((count) => count >= 3).length;

    const riskScore = Math.min(
      100,
      highValueOrders.length * 8 + highValueCOD.length * 10 + rapidRepeatBuyers * 6 + blockedUsers.length * 2
    );

    return {
      riskScore,
      highValueOrders: highValueOrders.length,
      highValueCOD: highValueCOD.length,
      rapidRepeatBuyers,
      totalFlags: highValueOrders.length + highValueCOD.length + rapidRepeatBuyers,
    };
  }, [orders, blockedUsers.length]);

  const settlementPreview = useMemo(() => {
    const grossRevenue = Number(dashboard?.totalRevenue || 0);
    const commissionAmount = (grossRevenue * Number(opsControls.commissionRatePercent || 0)) / 100;
    const reserveAmount = (grossRevenue * Number(opsControls.settlementReservePercent || 0)) / 100;
    const netSellerPayout = Math.max(grossRevenue - commissionAmount - reserveAmount, 0);
    return { grossRevenue, commissionAmount, reserveAmount, netSellerPayout };
  }, [dashboard, opsControls.commissionRatePercent, opsControls.settlementReservePercent]);

  const handleSellerAction = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/admin/sellers/${id}/status`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update seller status');
      toast.success(`Seller ${status.toLowerCase()}`);
      load(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const approveAllPendingSellers = async () => {
    if (!pendingSellers.length) return toast('No pending sellers right now');
    try {
      await Promise.all(
        pendingSellers.map((seller) =>
          fetch(`${API_BASE}/admin/sellers/${seller._id}/status`, {
            method: 'PUT',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ status: 'Approved' }),
          })
        )
      );
      toast.success('All pending sellers approved');
      load(true);
    } catch {
      toast.error('Failed to complete bulk approval');
    }
  };

  const toggleBlockUser = async (id, blocked) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${id}/block`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ blocked }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update user');
      toast.success(data.message || 'User updated');
      load(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to remove product');
      toast.success('Product removed');
      load(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveConfig = async (nextConfig) => {
    try {
      setSavingConfig(true);
      const payload = {
        ...nextConfig,
        freeShippingThreshold: Number(nextConfig.freeShippingThreshold || 0),
        defaultShippingCharge: Number(nextConfig.defaultShippingCharge || 0),
      };
      const saved = await updateSiteConfig(payload);
      setSiteConfig(saved);
      toast.success('Website settings updated');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingConfig(false);
    }
  };

  const setDraftFlag = (key) => {
    setConfigDraft((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOpsControl = (key) => {
    setOpsControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveOpsPolicy = () => {
    toast.success('Admin operational controls updated');
  };

  const renderSectionHeader = (title, subtitle) => (
    <div className="panel p-4 md:p-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <h2 className="text-xl font-display font-bold text-text-primary">{title}</h2>
        <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
      </div>
      {activeSection !== 'overview' && (
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border-default bg-white text-sm"
            placeholder={`Search ${title.toLowerCase()}`}
          />
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="panel p-5 md:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-brand-primary text-white border-0">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/70">Platform Ops</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-display font-bold tracking-tight">Admin Control Tower</h1>
              <p className="mt-2 text-sm text-white/80 max-w-2xl">
                Centralized command center for marketplace operations, moderation, growth and storefront controls.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => load()}
                className="h-10 rounded-xl px-4 bg-white/15 hover:bg-white/25 text-sm font-semibold inline-flex items-center gap-2"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                Refresh data
              </button>
              <button
                onClick={() => goSection('controls')}
                className="h-10 rounded-xl px-4 bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 inline-flex items-center gap-2"
              >
                <Settings2 size={15} />
                Open controls
              </button>
            </div>
          </div>
          <div className="mt-4 text-xs text-white/70">
            Last sync: {lastUpdatedAt ? lastUpdatedAt.toLocaleString() : 'Loading...'}
          </div>
        </section>

        <div className="panel p-3 md:p-4">
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(tabMeta).map(([key, meta]) => {
              const Icon = meta.icon;
              const counts = {
                overview: stats.length,
                sellers: sellers.length,
                users: users.length,
                orders: orders.length,
                products: products.length,
                analytics: ordersByStatus.reduce((sum, i) => sum + i.count, 0),
                controls: Object.keys(defaultSiteConfig).length,
              };
              return (
                <button
                  key={key}
                  onClick={() => goSection(key)}
                  className={`h-10 rounded-xl px-4 text-sm font-semibold inline-flex items-center gap-2 ${
                    activeSection === key
                      ? 'bg-brand-primary text-white'
                      : 'bg-white border border-border-default text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={15} />
                  {meta.label}
                  <span className={`rounded-md px-1.5 py-0.5 text-[11px] ${activeSection === key ? 'bg-white/20' : 'bg-surface-secondary'}`}>
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeSection === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
              {stats.map((stat) => (
                <div key={stat.label} className="panel p-5 h-full">
                  <stat.icon className="text-brand-primary mb-3" size={20} />
                  <p className="text-xs uppercase tracking-[0.14em] font-bold text-text-muted">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-text-primary mt-1">{stat.value}</p>
                  <p className="mt-1 text-xs text-text-muted">{stat.helper}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">
              <div className="panel p-5 xl:col-span-2 h-full">
                <h3 className="text-base font-semibold mb-4">Operational risk queue</h3>
                <div className="space-y-3">
                  {riskQueue.map((risk) => (
                    <div key={risk.title} className="rounded-xl border border-border-default bg-white p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary">{risk.title}</p>
                        <p className="text-xs text-text-muted">Severity: {risk.severity}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${risk.severity === 'high' ? 'bg-rose-50 text-danger' : risk.severity === 'medium' ? 'bg-amber-50 text-warning' : 'bg-emerald-50 text-success'}`}>
                          {risk.count}
                        </span>
                        <button onClick={risk.action} className="h-8 rounded-lg px-3 border border-border-default text-xs font-semibold hover:border-brand-primary inline-flex items-center gap-1">
                          Open
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel p-5 h-full">
                <h3 className="text-base font-semibold mb-4">Instant actions</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={approveAllPendingSellers}
                    className="w-full h-10 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover"
                  >
                    Approve all pending sellers
                  </button>
                  <button
                    onClick={() => goSection('orders')}
                    className="w-full h-10 rounded-xl border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary"
                  >
                    Review order fulfillment
                  </button>
                  <button
                    onClick={() => goSection('products')}
                    className="w-full h-10 rounded-xl border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary"
                  >
                    Moderate product catalog
                  </button>
                  <button
                    onClick={() => goSection('controls')}
                    className="w-full h-10 rounded-xl border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary"
                  >
                    Update storefront modules
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-stretch">
              <div className="panel p-5 h-full">
                <h3 className="text-base font-semibold mb-4">Order status distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ordersByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1859ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="panel p-5 h-full">
                <h3 className="text-base font-semibold mb-4">Top viewed products</h3>
                <div className="space-y-2.5">
                  {mostViewed.map((p, idx) => (
                    <div key={p._id || p.id || idx} className="rounded-xl border border-border-default bg-surface-secondary/40 p-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold line-clamp-1">{p.name || 'Untitled product'}</p>
                        <p className="text-xs text-text-muted">{p.brand || 'Unbranded'}</p>
                      </div>
                      <span className="text-sm font-semibold text-brand-primary">{p.views || 0} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">
              <div className="panel p-5 xl:col-span-2 h-full">
                <h3 className="text-base font-semibold mb-4">Order SLA board</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {slaBoard.map((lane) => (
                    <div key={lane.status} className="rounded-xl border border-border-default bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">{lane.label}</p>
                      <p className="mt-1 text-xl font-display font-bold text-text-primary">{lane.total}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-text-muted">Target: {lane.targetHours}h</span>
                        <span className={lane.overdue > 0 ? 'text-danger font-semibold' : 'text-success font-semibold'}>
                          Overdue: {lane.overdue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel p-5 h-full">
                <h3 className="text-base font-semibold mb-4">Fraud / risk engine</h3>
                <div className="rounded-xl border border-border-default bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Risk score</p>
                  <p className={`mt-1 text-3xl font-display font-bold ${fraudSignals.riskScore >= 60 ? 'text-danger' : fraudSignals.riskScore >= 35 ? 'text-warning' : 'text-success'}`}>
                    {fraudSignals.riskScore}
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-surface-secondary overflow-hidden">
                    <div
                      className={`h-full ${fraudSignals.riskScore >= 60 ? 'bg-danger' : fraudSignals.riskScore >= 35 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${fraudSignals.riskScore}%` }}
                    />
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-text-secondary">
                    <p className="flex items-center justify-between"><span>High-value orders</span><strong>{fraudSignals.highValueOrders}</strong></p>
                    <p className="flex items-center justify-between"><span>High-value COD</span><strong>{fraudSignals.highValueCOD}</strong></p>
                    <p className="flex items-center justify-between"><span>Rapid repeat buyers</span><strong>{fraudSignals.rapidRepeatBuyers}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'sellers' && (
          <>
            {renderSectionHeader('Seller Governance', 'Approve or reject applications and keep marketplace quality high.')}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Total sellers</p>
                <p className="text-2xl font-display font-bold mt-1">{sellers.length}</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Pending approval</p>
                <p className="text-2xl font-display font-bold mt-1 text-warning">{pendingSellers.length}</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Approved</p>
                <p className="text-2xl font-display font-bold mt-1 text-success">
                  {sellers.filter((s) => String(s.sellerStatus || '').toLowerCase() === 'approved').length}
                </p>
              </div>
            </div>
            <div className="panel overflow-hidden">
              <div className="p-4 md:p-5 border-b border-border-default flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">Seller approvals</h3>
                <button
                  onClick={approveAllPendingSellers}
                  className="h-9 rounded-lg px-3 text-xs font-semibold border border-border-default hover:border-brand-primary"
                >
                  Approve all pending
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-surface-secondary/70 text-left">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Seller</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Status</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredSellers.map((seller) => {
                      const status = String(seller.sellerStatus || '').toLowerCase();
                      return (
                        <tr key={seller._id}>
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-semibold text-text-primary">{seller.name || 'Unknown seller'}</p>
                            <p className="text-xs text-text-muted">{seller.email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-sm">
                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${status === 'approved' ? 'bg-emerald-50 text-success' : status === 'rejected' ? 'bg-rose-50 text-danger' : 'bg-amber-50 text-warning'}`}>
                              {seller.sellerStatus || 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => handleSellerAction(seller._id, 'Approved')} className="h-8 w-8 rounded-lg border border-emerald-200 bg-emerald-50 text-success grid place-items-center">
                                <CheckCircle2 size={16} />
                              </button>
                              <button onClick={() => handleSellerAction(seller._id, 'Rejected')} className="h-8 w-8 rounded-lg border border-rose-200 bg-rose-50 text-danger grid place-items-center">
                                <XCircle size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeSection === 'users' && (
          <>
            {renderSectionHeader('User Security & Access', 'Review customer accounts, role composition and platform abuse controls.')}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Total users</p>
                <p className="text-2xl font-display font-bold mt-1">{users.length}</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Blocked accounts</p>
                <p className="text-2xl font-display font-bold mt-1 text-danger">{blockedUsers.length}</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Sellers</p>
                <p className="text-2xl font-display font-bold mt-1 text-brand-primary">
                  {users.filter((u) => String(u.role || '').toLowerCase() === 'seller').length}
                </p>
              </div>
            </div>
            <div className="panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-surface-secondary/70 text-left">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">User</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Role</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Access control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-text-primary">{u.name || 'Unknown user'}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm uppercase text-text-secondary">{u.role || 'user'}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => toggleBlockUser(u._id, !u.isBlocked)}
                            className={`h-8 rounded-lg px-3 text-xs font-semibold inline-flex items-center gap-1 ${u.isBlocked ? 'bg-emerald-50 text-success border border-emerald-200' : 'bg-rose-50 text-danger border border-rose-200'}`}
                          >
                            {u.isBlocked ? <CheckCircle2 size={14} /> : <UserX size={14} />}
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeSection === 'orders' && (
          <>
            {renderSectionHeader('Order Ops Center', 'Track fulfillment throughput and monitor operational bottlenecks in real time.')}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ordersByStatus.map((s) => (
                <div key={s.name} className="panel p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-text-muted">{s.name}</p>
                  <p className="text-xl font-display font-bold mt-1">{s.count}</p>
                </div>
              ))}
            </div>
            <div className="panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-surface-secondary/70 text-left">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Order</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Status</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Created</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-5 py-3.5 text-sm font-mono">#{String(order._id || '').slice(-8).toUpperCase()}</td>
                        <td className="px-5 py-3.5 text-sm uppercase text-text-secondary">{order.status || 'pending'}</td>
                        <td className="px-5 py-3.5 text-sm text-text-secondary">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold text-text-primary">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeSection === 'products' && (
          <>
            {renderSectionHeader('Catalog Moderation', 'Moderate listing quality, identify stock risk and keep the storefront healthy.')}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Total products</p>
                <p className="text-2xl font-display font-bold mt-1">{products.length}</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Low stock (&lt;10)</p>
                <p className="text-2xl font-display font-bold mt-1 text-warning">{lowStockProducts.length}</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Out of stock</p>
                <p className="text-2xl font-display font-bold mt-1 text-danger">{outOfStockProducts.length}</p>
              </div>
            </div>
            <div className="panel overflow-hidden">
              <div className="p-4 md:p-5 border-b border-border-default flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">Product moderation queue</h3>
                <p className="text-xs text-text-muted">{filteredProducts.length} visible rows</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead className="bg-surface-secondary/70 text-left">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Product</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Category</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Stock</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Price</th>
                      <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredProducts.map((p) => (
                      <tr key={p._id}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-text-primary line-clamp-1">{p.name || 'Untitled product'}</p>
                          <p className="text-xs text-text-muted">{p.brand || 'Unbranded'}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-text-secondary">{p.category || 'Uncategorized'}</td>
                        <td className="px-5 py-3.5 text-sm">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${Number(p.stock || 0) <= 0 ? 'bg-rose-50 text-danger' : Number(p.stock || 0) < 10 ? 'bg-amber-50 text-warning' : 'bg-emerald-50 text-success'}`}>
                            {Number(p.stock || 0)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold">₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button onClick={() => removeProduct(p._id)} className="h-8 w-8 rounded-lg border border-rose-200 bg-rose-50 text-danger grid place-items-center">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeSection === 'analytics' && (
          <>
            {renderSectionHeader('Marketplace Analytics', 'Monitor conversion signals and category movement to guide team decisions.')}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="panel p-5">
                <h3 className="text-base font-semibold mb-4">Order status distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={ordersByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1859ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="panel p-5">
                <h3 className="text-base font-semibold mb-4">Category coverage</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#111827" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4">Best selling products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {bestSelling.map((p, idx) => (
                  <div key={p._id || p.id || idx} className="rounded-xl border border-border-default bg-white p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Rank #{idx + 1}</p>
                    <p className="mt-1 text-sm font-semibold line-clamp-1">{p.name || 'Untitled product'}</p>
                    <p className="text-xs text-text-muted">{p.brand || 'Unbranded'}</p>
                    <p className="mt-2 text-sm font-semibold text-success">{p.soldCount || 0} sold</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'controls' && (
          <>
            {renderSectionHeader('Website Command Controls', 'Manage storefront modules, messaging and commerce rules from one place.')}
            <div className="panel p-3 md:p-4">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  ['site', 'Site Modules', '/admin/controls/site'],
                  ['policies', 'Ops Policies', '/admin/controls/policies'],
                  ['settlements', 'Settlement Controls', '/admin/controls/settlements'],
                ].map(([key, label, path]) => (
                  <button
                    key={key}
                    onClick={() => navigate(path)}
                    className={`h-9 rounded-lg px-3 text-sm font-semibold ${
                      activeControlTab === key
                        ? 'bg-brand-primary text-white'
                        : 'bg-white border border-border-default text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="xl:col-span-2 space-y-5">
                {(activeControlTab === 'site' || activeControlTab === 'policies') && (
                <div className="panel p-5">
                  <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                    <Shield size={16} className="text-brand-primary" />
                    Admin-only platform policies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                    <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                      <span>Allow Cash on Delivery</span>
                      <input type="checkbox" checked={Boolean(opsControls.allowCashOnDelivery)} onChange={() => toggleOpsControl('allowCashOnDelivery')} />
                    </label>
                    <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                      <span>Allow Guest Checkout</span>
                      <input type="checkbox" checked={Boolean(opsControls.allowGuestCheckout)} onChange={() => toggleOpsControl('allowGuestCheckout')} />
                    </label>
                    <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                      <span>Auto-approve Sellers</span>
                      <input type="checkbox" checked={Boolean(opsControls.autoApproveSellers)} onChange={() => toggleOpsControl('autoApproveSellers')} />
                    </label>
                    <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                      <span>Strict Catalog Moderation</span>
                      <input type="checkbox" checked={Boolean(opsControls.strictCatalogModeration)} onChange={() => toggleOpsControl('strictCatalogModeration')} />
                    </label>
                    <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                      <span>Allow Seller Self-Onboarding</span>
                      <input type="checkbox" checked={Boolean(opsControls.allowSellerSelfOnboarding)} onChange={() => toggleOpsControl('allowSellerSelfOnboarding')} />
                    </label>
                    <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                      <span>Returns Enabled</span>
                      <input type="checkbox" checked={Boolean(opsControls.returnsEnabled)} onChange={() => toggleOpsControl('returnsEnabled')} />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Max Products / Seller</span>
                      <input
                        type="number"
                        min="1"
                        value={opsControls.maxProductsPerSeller}
                        onChange={(e) => setOpsControls((prev) => ({ ...prev, maxProductsPerSeller: Number(e.target.value || 1) }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Max Items / Order</span>
                      <input
                        type="number"
                        min="1"
                        value={opsControls.maxOrderItems}
                        onChange={(e) => setOpsControls((prev) => ({ ...prev, maxOrderItems: Number(e.target.value || 1) }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Escalation SLA (hours)</span>
                      <input
                        type="number"
                        min="1"
                        value={opsControls.supportEscalationHours}
                        onChange={(e) => setOpsControls((prev) => ({ ...prev, supportEscalationHours: Number(e.target.value || 1) }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                  </div>
                </div>
                )}

                {activeControlTab === 'site' && (
                <div className="panel p-5">
                  <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                    <Megaphone size={16} className="text-brand-primary" />
                    Global announcement
                  </h3>
                  <div className="space-y-3">
                    <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={Boolean(configDraft.globalAnnouncementEnabled)}
                        onChange={() => setDraftFlag('globalAnnouncementEnabled')}
                      />
                      Enable announcement bar on home page
                    </label>
                    <input
                      value={configDraft.globalAnnouncementText || ''}
                      onChange={(e) => setConfigDraft((prev) => ({ ...prev, globalAnnouncementText: e.target.value }))}
                      className="w-full h-10 rounded-xl border border-border-default bg-white px-3 text-sm"
                      placeholder="Announcement text"
                    />
                  </div>
                </div>
                )}

                {activeControlTab === 'site' && (
                <div className="panel p-5">
                  <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                    <Settings2 size={16} className="text-brand-primary" />
                    Home module toggles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                    {Object.keys(defaultSiteConfig)
                      .filter((key) => key.startsWith('show'))
                      .map((key) => (
                        <label key={key} className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                          <span>{key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                          <input type="checkbox" checked={Boolean(configDraft[key])} onChange={() => setDraftFlag(key)} />
                        </label>
                      ))}
                  </div>
                </div>
                )}

                {(activeControlTab === 'site' || activeControlTab === 'policies') && (
                <div className="panel p-5">
                  <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                    <Shield size={16} className="text-brand-primary" />
                    Commerce rules
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Free shipping threshold (₹)</span>
                      <input
                        type="number"
                        min="0"
                        value={configDraft.freeShippingThreshold}
                        onChange={(e) => setConfigDraft((prev) => ({ ...prev, freeShippingThreshold: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Default shipping charge (₹)</span>
                      <input
                        type="number"
                        min="0"
                        value={configDraft.defaultShippingCharge}
                        onChange={(e) => setConfigDraft((prev) => ({ ...prev, defaultShippingCharge: e.target.value }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                  </div>
                </div>
                )}

                {(activeControlTab === 'settlements' || activeControlTab === 'policies') && (
                <div className="panel p-5">
                  <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                    <BarChart3 size={16} className="text-brand-primary" />
                    Commission & settlement controls
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Commission rate (%)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={opsControls.commissionRatePercent}
                        onChange={(e) => setOpsControls((prev) => ({ ...prev, commissionRatePercent: Number(e.target.value || 0) }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Settlement cycle (days)</span>
                      <input
                        type="number"
                        min="1"
                        value={opsControls.settlementCycleDays}
                        onChange={(e) => setOpsControls((prev) => ({ ...prev, settlementCycleDays: Number(e.target.value || 1) }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                    <label className="text-sm text-text-secondary">
                      <span className="block mb-1">Settlement reserve (%)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={opsControls.settlementReservePercent}
                        onChange={(e) => setOpsControls((prev) => ({ ...prev, settlementReservePercent: Number(e.target.value || 0) }))}
                        className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                      />
                    </label>
                    <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary text-sm">
                      <span>Auto seller payouts</span>
                      <input type="checkbox" checked={Boolean(opsControls.autoPayoutEnabled)} onChange={() => toggleOpsControl('autoPayoutEnabled')} />
                    </label>
                  </div>
                  <div className="mt-4 rounded-xl border border-border-default bg-surface-secondary/40 p-3 text-sm">
                    <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted mb-2">Settlement preview</p>
                    <div className="grid grid-cols-2 gap-2 text-text-secondary">
                      <p>Gross Revenue</p><p className="text-right font-semibold text-text-primary">₹{settlementPreview.grossRevenue.toLocaleString('en-IN')}</p>
                      <p>Commission</p><p className="text-right font-semibold text-text-primary">₹{settlementPreview.commissionAmount.toLocaleString('en-IN')}</p>
                      <p>Reserve Hold</p><p className="text-right font-semibold text-text-primary">₹{settlementPreview.reserveAmount.toLocaleString('en-IN')}</p>
                      <p>Net Seller Payout</p><p className="text-right font-semibold text-success">₹{settlementPreview.netSellerPayout.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="panel p-5">
                  <h3 className="text-base font-semibold mb-3 inline-flex items-center gap-2">
                    <AlertTriangle size={16} className="text-warning" />
                    Guardrails
                  </h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li className="rounded-lg bg-surface-secondary/60 px-3 py-2">Review seller approvals daily</li>
                    <li className="rounded-lg bg-surface-secondary/60 px-3 py-2">Keep out-of-stock under 8% of catalog</li>
                    <li className="rounded-lg bg-surface-secondary/60 px-3 py-2">Resolve pending orders every 2 hours</li>
                  </ul>
                </div>

                <div className="panel p-5">
                  <h3 className="text-base font-semibold mb-3">Publish settings</h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={saveOpsPolicy}
                      className="w-full h-10 rounded-xl border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary"
                    >
                      Apply admin policy controls
                    </button>
                    <button
                      onClick={() => saveConfig(configDraft)}
                      disabled={savingConfig}
                      className="w-full h-10 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover disabled:opacity-60"
                    >
                      {savingConfig ? 'Saving...' : 'Save all changes'}
                    </button>
                    <button
                      onClick={() => setConfigDraft(siteConfig)}
                      className="w-full h-10 rounded-xl border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary"
                    >
                      Reset unsaved changes
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-text-muted">Changes apply to storefront modules and checkout rules immediately after save.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
