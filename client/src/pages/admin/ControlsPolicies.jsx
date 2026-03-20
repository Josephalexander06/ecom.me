import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import ControlsTabs from '../../components/admin/ControlsTabs';
import { defaultAdminOpsControls, readAdminOpsControls, writeAdminOpsControls } from '../../utils/adminOpsControls';

const ControlsPolicies = () => {
  const [ops, setOps] = useState(defaultAdminOpsControls);

  useEffect(() => {
    setOps(readAdminOpsControls());
  }, []);

  const toggle = (key) => {
    setOps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const policyHealth = useMemo(() => {
    let score = 100;
    if (!ops.strictCatalogModeration) score -= 15;
    if (ops.allowGuestCheckout) score -= 8;
    if (ops.autoApproveSellers) score -= 20;
    if (!ops.returnsEnabled) score -= 10;
    return Math.max(score, 20);
  }, [ops]);

  const apply = () => {
    writeAdminOpsControls(ops);
    toast.success('Operational policy controls applied');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="panel p-4 md:p-5">
          <h1 className="text-xl font-display font-bold text-text-primary">Operations Policy Controls</h1>
          <p className="text-sm text-text-secondary mt-1">Define admin-only guardrails for checkout, sellers, returns and moderation.</p>
        </div>

        <ControlsTabs />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <Shield size={16} className="text-brand-primary" />
                Admin policy matrix
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                  <span>Allow Cash on Delivery</span>
                  <input type="checkbox" checked={Boolean(ops.allowCashOnDelivery)} onChange={() => toggle('allowCashOnDelivery')} />
                </label>
                <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                  <span>Allow Guest Checkout</span>
                  <input type="checkbox" checked={Boolean(ops.allowGuestCheckout)} onChange={() => toggle('allowGuestCheckout')} />
                </label>
                <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                  <span>Auto-approve Sellers</span>
                  <input type="checkbox" checked={Boolean(ops.autoApproveSellers)} onChange={() => toggle('autoApproveSellers')} />
                </label>
                <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                  <span>Strict Catalog Moderation</span>
                  <input type="checkbox" checked={Boolean(ops.strictCatalogModeration)} onChange={() => toggle('strictCatalogModeration')} />
                </label>
                <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                  <span>Allow Seller Self-Onboarding</span>
                  <input type="checkbox" checked={Boolean(ops.allowSellerSelfOnboarding)} onChange={() => toggle('allowSellerSelfOnboarding')} />
                </label>
                <label className="inline-flex items-center justify-between rounded-lg border border-border-default bg-white px-3 py-2 text-text-secondary">
                  <span>Returns Enabled</span>
                  <input type="checkbox" checked={Boolean(ops.returnsEnabled)} onChange={() => toggle('returnsEnabled')} />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <label className="text-sm text-text-secondary">
                  <span className="block mb-1">Max Products / Seller</span>
                  <input
                    type="number"
                    min="1"
                    value={ops.maxProductsPerSeller}
                    onChange={(e) => setOps((prev) => ({ ...prev, maxProductsPerSeller: Number(e.target.value || 1) }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
                <label className="text-sm text-text-secondary">
                  <span className="block mb-1">Max Items / Order</span>
                  <input
                    type="number"
                    min="1"
                    value={ops.maxOrderItems}
                    onChange={(e) => setOps((prev) => ({ ...prev, maxOrderItems: Number(e.target.value || 1) }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
                <label className="text-sm text-text-secondary">
                  <span className="block mb-1">Escalation SLA (hours)</span>
                  <input
                    type="number"
                    min="1"
                    value={ops.supportEscalationHours}
                    onChange={(e) => setOps((prev) => ({ ...prev, supportEscalationHours: Number(e.target.value || 1) }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-3 inline-flex items-center gap-2">
                <AlertTriangle size={16} className="text-warning" />
                Policy health
              </h3>
              <p className={`text-3xl font-display font-bold ${policyHealth >= 85 ? 'text-success' : policyHealth >= 60 ? 'text-warning' : 'text-danger'}`}>
                {policyHealth}%
              </p>
              <div className="mt-3 h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div
                  className={`${policyHealth >= 85 ? 'bg-success' : policyHealth >= 60 ? 'bg-warning' : 'bg-danger'} h-full`}
                  style={{ width: `${policyHealth}%` }}
                />
              </div>
              <button
                onClick={apply}
                className="mt-4 w-full h-10 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover"
              >
                Apply policy controls
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ControlsPolicies;
