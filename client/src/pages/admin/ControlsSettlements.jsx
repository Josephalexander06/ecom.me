import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import ControlsTabs from '../../components/admin/ControlsTabs';
import { API_BASE, authHeaders } from '../../utils/api';
import { defaultAdminOpsControls, readAdminOpsControls, writeAdminOpsControls } from '../../utils/adminOpsControls';

const ControlsSettlements = () => {
  const [ops, setOps] = useState(defaultAdminOpsControls);
  const [dashboardRevenue, setDashboardRevenue] = useState(0);

  useEffect(() => {
    setOps(readAdminOpsControls());
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/admin/dashboard`, { headers: authHeaders() });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load dashboard');
        setDashboardRevenue(Number(data.totalRevenue || 0));
      } catch (error) {
        toast.error(error.message);
      }
    };
    load();
  }, []);

  const preview = useMemo(() => {
    const commissionAmount = (dashboardRevenue * Number(ops.commissionRatePercent || 0)) / 100;
    const reserveAmount = (dashboardRevenue * Number(ops.settlementReservePercent || 0)) / 100;
    const netSellerPayout = Math.max(dashboardRevenue - commissionAmount - reserveAmount, 0);
    return { commissionAmount, reserveAmount, netSellerPayout };
  }, [dashboardRevenue, ops.commissionRatePercent, ops.settlementReservePercent]);

  const apply = () => {
    writeAdminOpsControls(ops);
    toast.success('Settlement controls applied');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="panel p-4 md:p-5">
          <h1 className="text-xl font-display font-bold text-text-primary">Commission & Settlement Controls</h1>
          <p className="text-sm text-text-secondary mt-1">Manage commission, reserve hold, payout cycle and seller settlement policy.</p>
        </div>

        <ControlsTabs />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <BarChart3 size={16} className="text-brand-primary" />
                Settlement policy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm text-text-secondary">
                  <span className="block mb-1">Commission rate (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={ops.commissionRatePercent}
                    onChange={(e) => setOps((prev) => ({ ...prev, commissionRatePercent: Number(e.target.value || 0) }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
                <label className="text-sm text-text-secondary">
                  <span className="block mb-1">Settlement cycle (days)</span>
                  <input
                    type="number"
                    min="1"
                    value={ops.settlementCycleDays}
                    onChange={(e) => setOps((prev) => ({ ...prev, settlementCycleDays: Number(e.target.value || 1) }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
                <label className="text-sm text-text-secondary">
                  <span className="block mb-1">Settlement reserve (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={ops.settlementReservePercent}
                    onChange={(e) => setOps((prev) => ({ ...prev, settlementReservePercent: Number(e.target.value || 0) }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
                <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary text-sm">
                  <span>Auto seller payouts</span>
                  <input type="checkbox" checked={Boolean(ops.autoPayoutEnabled)} onChange={() => setOps((prev) => ({ ...prev, autoPayoutEnabled: !prev.autoPayoutEnabled }))} />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-3 inline-flex items-center gap-2">
                <Shield size={16} className="text-brand-primary" />
                Settlement preview
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
                <p>Gross Revenue</p>
                <p className="text-right font-semibold text-text-primary">₹{dashboardRevenue.toLocaleString('en-IN')}</p>
                <p>Commission</p>
                <p className="text-right font-semibold text-text-primary">₹{preview.commissionAmount.toLocaleString('en-IN')}</p>
                <p>Reserve Hold</p>
                <p className="text-right font-semibold text-text-primary">₹{preview.reserveAmount.toLocaleString('en-IN')}</p>
                <p>Net Seller Payout</p>
                <p className="text-right font-semibold text-success">₹{preview.netSellerPayout.toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={apply}
                className="mt-4 w-full h-10 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover"
              >
                Apply settlement controls
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ControlsSettlements;
