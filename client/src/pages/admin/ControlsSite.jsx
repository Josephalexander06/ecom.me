import React, { useEffect, useState } from 'react';
import { Megaphone, Settings2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import ControlsTabs from '../../components/admin/ControlsTabs';
import { defaultSiteConfig, fetchSiteConfig, updateSiteConfig } from '../../utils/siteConfig';

const ControlsSite = () => {
  const [saving, setSaving] = useState(false);
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);
  const [draft, setDraft] = useState(defaultSiteConfig);

  useEffect(() => {
    const load = async () => {
      try {
        const cfg = await fetchSiteConfig();
        setSiteConfig(cfg);
        setDraft(cfg);
      } catch (error) {
        toast.error(error.message);
      }
    };
    load();
  }, []);

  const setDraftFlag = (key) => {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        ...draft,
        freeShippingThreshold: Number(draft.freeShippingThreshold || 0),
        defaultShippingCharge: Number(draft.defaultShippingCharge || 0),
      };
      const saved = await updateSiteConfig(payload);
      setSiteConfig(saved);
      setDraft(saved);
      toast.success('Site module settings saved');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="panel p-4 md:p-5">
          <h1 className="text-xl font-display font-bold text-text-primary">Site Module Controls</h1>
          <p className="text-sm text-text-secondary mt-1">Manage storefront modules, announcement bar and commerce rules.</p>
        </div>

        <ControlsTabs />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <Megaphone size={16} className="text-brand-primary" />
                Global announcement
              </h3>
              <div className="space-y-3">
                <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.globalAnnouncementEnabled)}
                    onChange={() => setDraftFlag('globalAnnouncementEnabled')}
                  />
                  Enable announcement bar on home page
                </label>
                <input
                  value={draft.globalAnnouncementText || ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, globalAnnouncementText: e.target.value }))}
                  className="w-full h-10 rounded-xl border border-border-default bg-white px-3 text-sm"
                  placeholder="Announcement text"
                />
              </div>
            </div>

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
                      <input type="checkbox" checked={Boolean(draft[key])} onChange={() => setDraftFlag(key)} />
                    </label>
                  ))}
              </div>
            </div>

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
                    value={draft.freeShippingThreshold}
                    onChange={(e) => setDraft((prev) => ({ ...prev, freeShippingThreshold: e.target.value }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
                <label className="text-sm text-text-secondary">
                  <span className="block mb-1">Default shipping charge (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={draft.defaultShippingCharge}
                    onChange={(e) => setDraft((prev) => ({ ...prev, defaultShippingCharge: e.target.value }))}
                    className="w-full h-10 rounded-xl border border-border-default bg-white px-3"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-3">Publish settings</h3>
              <div className="space-y-2.5">
                <button
                  onClick={save}
                  disabled={saving}
                  className="w-full h-10 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save site settings'}
                </button>
                <button
                  onClick={() => setDraft(siteConfig)}
                  className="w-full h-10 rounded-xl border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary"
                >
                  Reset unsaved changes
                </button>
              </div>
              <p className="mt-3 text-xs text-text-muted">These changes are persisted to site config.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ControlsSite;
