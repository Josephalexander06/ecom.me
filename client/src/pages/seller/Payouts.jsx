import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, CalendarClock, IndianRupee, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';
import SellerLayout from '../../components/seller/SellerLayout';
import { API_BASE, authHeaders } from '../../utils/api';
import { defaultAdminOpsControls, readAdminOpsControls } from '../../utils/adminOpsControls';

const Payouts = () => {
  const [orders, setOrders] = useState([]);
  const [ops, setOps] = useState(defaultAdminOpsControls);

  useEffect(() => {
    setOps(readAdminOpsControls());
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/orders/seller`, { headers: authHeaders() });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load seller orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.message);
      }
    };
    load();
  }, []);

  const ledger = useMemo(() => {
    const commissionRate = Number(ops.commissionRatePercent || 0) / 100;
    const reserveRate = Number(ops.settlementReservePercent || 0) / 100;
    const cycleDays = Number(ops.settlementCycleDays || 7);

    return orders
      .map((o) => {
        const gross = Number(o.totalAmount || 0);
        const commission = gross * commissionRate;
        const reserve = gross * reserveRate;
        const net = Math.max(gross - commission - reserve, 0);
        const created = new Date(o.createdAt || Date.now());
        const settlementDate = new Date(created.getTime() + cycleDays * 24 * 60 * 60 * 1000);
        return {
          id: o._id,
          gross,
          commission,
          reserve,
          net,
          status: o.status || 'pending',
          settlementDate,
        };
      })
      .sort((a, b) => b.settlementDate.getTime() - a.settlementDate.getTime());
  }, [orders, ops]);

  const totals = useMemo(() => {
    return ledger.reduce(
      (acc, row) => {
        acc.gross += row.gross;
        acc.commission += row.commission;
        acc.reserve += row.reserve;
        acc.net += row.net;
        return acc;
      },
      { gross: 0, commission: 0, reserve: 0, net: 0 }
    );
  }, [ledger]);

  return (
    <SellerLayout>
      <div className="space-y-6">
        <section className="panel p-5 md:p-6">
          <h1 className="text-2xl font-display font-bold">Payouts & Settlements</h1>
          <p className="text-sm text-text-secondary mt-1">Track settlement cycles, commission deductions and projected payout cashflow.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          <div className="panel p-5"><IndianRupee className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Gross Sales</p><p className="text-2xl font-display font-bold">₹{totals.gross.toLocaleString('en-IN')}</p></div>
          <div className="panel p-5"><BarChart3 className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Commission</p><p className="text-2xl font-display font-bold">₹{totals.commission.toLocaleString('en-IN')}</p></div>
          <div className="panel p-5"><CalendarClock className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Reserve Hold</p><p className="text-2xl font-display font-bold">₹{totals.reserve.toLocaleString('en-IN')}</p></div>
          <div className="panel p-5"><Landmark className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Net Payout</p><p className="text-2xl font-display font-bold text-success">₹{totals.net.toLocaleString('en-IN')}</p></div>
        </div>

        <div className="panel overflow-hidden">
          <div className="p-4 md:p-5 border-b border-border-default">
            <h3 className="text-base font-semibold">Settlement Ledger</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-surface-secondary/70 text-left">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Order</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Gross</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Commission</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Reserve</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Net</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Settlement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {ledger.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-mono font-semibold">#{String(row.id || '').slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-text-muted uppercase">{row.status}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold">₹{row.gross.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-right text-sm">₹{row.commission.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-right text-sm">₹{row.reserve.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-success">₹{row.net.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-sm text-text-secondary">{row.settlementDate.toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
                {ledger.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-sm text-text-muted" colSpan={6}>No settlements yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Payouts;
