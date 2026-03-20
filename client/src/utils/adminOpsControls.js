export const ADMIN_OPS_KEY = 'ecomme_admin_ops_controls';

export const defaultAdminOpsControls = {
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

export const readAdminOpsControls = () => {
  try {
    const raw = localStorage.getItem(ADMIN_OPS_KEY);
    if (!raw) return defaultAdminOpsControls;
    return { ...defaultAdminOpsControls, ...JSON.parse(raw) };
  } catch {
    return defaultAdminOpsControls;
  }
};

export const writeAdminOpsControls = (value) => {
  localStorage.setItem(ADMIN_OPS_KEY, JSON.stringify(value));
};
