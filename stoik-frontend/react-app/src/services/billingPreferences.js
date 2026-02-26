const BILLING_PREFS_KEY = 'stoik_billing_preferences';

const DEFAULT_PREFERENCES = {
  autoApplyCredits: true,
  automaticRenewal: true
};

export const loadBillingPreferences = () => {
  try {
    const raw = localStorage.getItem(BILLING_PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw);
    return {
      autoApplyCredits: parsed?.autoApplyCredits !== false,
      automaticRenewal: parsed?.automaticRenewal !== false
    };
  } catch (error) {
    return { ...DEFAULT_PREFERENCES };
  }
};

export const saveBillingPreferences = (next) => {
  const current = loadBillingPreferences();
  const merged = {
    autoApplyCredits: next?.autoApplyCredits !== undefined ? Boolean(next.autoApplyCredits) : current.autoApplyCredits,
    automaticRenewal: next?.automaticRenewal !== undefined ? Boolean(next.automaticRenewal) : current.automaticRenewal
  };

  localStorage.setItem(BILLING_PREFS_KEY, JSON.stringify(merged));
  return merged;
};
