import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { getCreditBalance, setAutoApplyCreditsPreference } from '../services/credits.api.js';
import { loadBillingPreferences, saveBillingPreferences } from '../services/billingPreferences.js';
import './billing.css';

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

export default function Billing() {
  const [prefs, setPrefs] = useState(loadBillingPreferences());
  const [vaultBalance, setVaultBalance] = useState(12500);

  useEffect(() => {
    getCreditBalance().then((credit) => {
      setVaultBalance(Number(credit?.balance || 0));
      const merged = saveBillingPreferences({
        ...loadBillingPreferences(),
        autoApplyCredits: typeof credit?.autoApplyCredits === 'boolean' ? credit.autoApplyCredits : true
      });
      setPrefs(merged);
    });
  }, []);

  const toggleAutoApply = async () => {
    const nextValue = !prefs.autoApplyCredits;
    const next = saveBillingPreferences({ ...prefs, autoApplyCredits: nextValue });
    setPrefs(next);

    try {
      await setAutoApplyCreditsPreference(nextValue);
    } catch (error) {
      const rollback = saveBillingPreferences({ ...prefs, autoApplyCredits: prefs.autoApplyCredits });
      setPrefs(rollback);
    }
  };

  const toggleAutomaticRenewal = () => {
    const next = saveBillingPreferences({ ...prefs, automaticRenewal: !prefs.automaticRenewal });
    setPrefs(next);
  };

  return (
    <main className="page fade-in billing-page">
      <div className="eyebrow">Billing Settings</div>
      <h1 className="title">Billing Preferences</h1>
      <p className="subtitle">Your Loop, Your Terms. Manage how credits and renewals are handled.</p>

      <section className="billing-card">
        <div className="billing-row">
          <div>
            <h2>Apply Credits Automatically</h2>
            <p>
              When enabled, your available Vault balance will be used to discount your next loop.
              When disabled, your credits will continue to accumulate.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.autoApplyCredits}
            className={`billing-toggle ${prefs.autoApplyCredits ? 'is-on' : ''}`}
            onClick={toggleAutoApply}
          >
            <span />
          </button>
        </div>

        <div className="billing-row">
          <div>
            <h2>Automatic Renewal</h2>
            <p>
              When disabled, Stoik will send a WhatsApp/Email invoice reminder 48 hours before cadence date instead of auto-charging.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.automaticRenewal}
            className={`billing-toggle ${prefs.automaticRenewal ? 'is-on' : ''}`}
            onClick={toggleAutomaticRenewal}
          >
            <span />
          </button>
        </div>
      </section>

      <section className="billing-vault-note">
        <p className="billing-vault-label">The Vault</p>
        {prefs.autoApplyCredits ? (
          <h3>{formatNaira(vaultBalance)} Available Credit</h3>
        ) : (
          <h3>{formatNaira(vaultBalance)} Reserved</h3>
        )}
        <p>
          These credits are secured in your Vault and will not expire. You can apply them to any future loop or special Stoik drops.
        </p>
      </section>

      <div className="billing-actions">
        <Link to="/checkout">
          <Button>Return to Checkout</Button>
        </Link>
        <Link to="/bag" className="billing-link">Back to dashboard</Link>
      </div>
    </main>
  );
}
