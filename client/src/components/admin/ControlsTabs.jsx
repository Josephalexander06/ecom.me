import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'site', label: 'Site Modules', path: '/admin/controls/site' },
  { key: 'policies', label: 'Ops Policies', path: '/admin/controls/policies' },
  { key: 'settlements', label: 'Settlement Controls', path: '/admin/controls/settlements' },
];

const ControlsTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = location.pathname.includes('/admin/controls/settlements')
    ? 'settlements'
    : location.pathname.includes('/admin/controls/policies')
      ? 'policies'
      : 'site';

  return (
    <div className="panel p-3 md:p-4">
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`h-9 rounded-lg px-3 text-sm font-semibold ${
              active === tab.key
                ? 'bg-brand-primary text-white'
                : 'bg-white border border-border-default text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlsTabs;
