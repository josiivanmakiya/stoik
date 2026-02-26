import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { getBag, getSelectedBagsForSubscription, initiateCheckout } from '../services/bag.api.js';
import { getCreditBalance } from '../services/credits.api.js';
import { loadBillingPreferences, saveBillingPreferences } from '../services/billingPreferences.js';
import './checkout.css';

const MEMBER_CREDIT_CAP = 2500;
const formatNaira = (value) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bag, setBag] = useState({ items: [], cadenceMonths: 1 });
  const [selectedBags, setSelectedBags] = useState([]);
  const [interval, setInterval] = useState(1);
  const [method, setMethod] = useState('card');
  const [purchaseType, setPurchaseType] = useState('recurring');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [vaultBalance, setVaultBalance] = useState(12500);
  const [billingPrefs, setBillingPrefs] = useState(loadBillingPreferences());
  const [applyCredit, setApplyCredit] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'NG',
    cardHolderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    standardBankName: '',
    standardAccountName: '',
    standardAccountNumber: '',
    standardReference: ''
  });

  useEffect(() => {
    Promise.all([getBag(), getSelectedBagsForSubscription(), getCreditBalance()]).then(([activeBag, pickedBags, credit]) => {
      setBag(activeBag);
      setSelectedBags(Array.isArray(pickedBags) ? pickedBags : []);
      setInterval(Number(activeBag?.cadenceMonths) || 1);
      setVaultBalance(Number(credit?.balance || 0));

      const stored = loadBillingPreferences();
      const merged = saveBillingPreferences({
        ...stored,
        autoApplyCredits: typeof credit?.autoApplyCredits === 'boolean' ? credit.autoApplyCredits : stored.autoApplyCredits
      });
      setBillingPrefs(merged);
      setApplyCredit(merged.autoApplyCredits);
    });

    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'once') {
      setPurchaseType('once');
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('stoik_user') || 'null');
      if (storedUser) {
        setForm((prev) => ({
          ...prev,
          fullName: storedUser.fullName || prev.fullName,
          email: storedUser.email || prev.email
        }));
      }
    } catch (error) {
      // ignore
    }
  }, []);

  const checkoutBags = selectedBags.length ? selectedBags : [bag];
  const checkoutItems = checkoutBags.flatMap((entry) => (
    Array.isArray(entry?.items) ? entry.items.map((item) => ({ ...item, bagId: entry.bagId })) : []
  ));
  const hasItems = checkoutItems.length > 0;
  const subtotal = checkoutItems.reduce((sum, item) => sum + (Number(item?.unitPrice || 0) * Number(item?.quantity || 1)), 0);
  const availableCredit = Math.min(MEMBER_CREDIT_CAP, vaultBalance, subtotal);
  const appliedCredit = applyCredit ? availableCredit : 0;
  const totalDue = Math.max(0, subtotal - appliedCredit);

  const cardDetailsReady = Boolean(
    form.cardNumber.trim() &&
    form.cardExpiry.trim() &&
    form.cardCvc.trim() &&
    form.cardHolderName.trim()
  );
  const bankDetailsReady = Boolean(
    form.standardAccountName.trim() &&
    form.standardBankName.trim() &&
    form.standardAccountNumber.trim()
  );
  const ussdDetailsReady = Boolean(form.phone.trim());
  const paymentDetailsReady = method === 'card'
    ? cardDetailsReady
    : method === 'bank'
      ? bankDetailsReady
      : ussdDetailsReady;
  const contactReady = Boolean(form.fullName.trim() && form.email.trim() && form.address.trim());
  const canContinue = hasItems && !submitting && paymentDetailsReady && contactReady;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchManualApproval = (event) => {
    event.preventDefault();
    const next = saveBillingPreferences({ ...billingPrefs, automaticRenewal: false });
    setBillingPrefs(next);
    navigate('/billing');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasItems) {
      setStatus('Your bag is empty.');
      return;
    }
    if (!contactReady) {
      setStatus('Complete full name, email, and address before continuing.');
      return;
    }
    if (!paymentDetailsReady) {
      setStatus('Complete payment details for the selected method.');
      return;
    }

    const normalizedMethod = method === 'card' ? 'card' : 'standard';

    setSubmitting(true);
    setStatus(normalizedMethod === 'card' ? 'Initializing card checkout...' : 'Creating your subscription box...');

    try {
      const payload = {
        items: checkoutItems.map((item) => ({
          ...item,
          cadenceMonths: interval
        })),
        cadenceMonths: interval,
        applyCredit,
        creditToApply: appliedCredit,
        billingPreferences: {
          autoApplyCredits: billingPrefs.autoApplyCredits,
          automaticRenewal: billingPrefs.automaticRenewal
        },
        bags: checkoutBags.map((entry) => ({
          bagId: entry.bagId,
          name: entry.name,
          cadenceMonths: entry.cadenceMonths,
          items: entry.items
        })),
        paymentMethod: normalizedMethod,
        paymentDetails: method === 'card'
          ? {
              method,
              cardHolderName: form.cardHolderName,
              cardNumber: form.cardNumber,
              cardExpiry: form.cardExpiry,
              cardCvc: form.cardCvc
            }
          : {
              method,
              bankName: form.standardBankName,
              accountName: form.standardAccountName,
              accountNumber: form.standardAccountNumber,
              reference: form.standardReference
            },
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone
        },
        shipping: {
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country
        }
      };

      const response = await initiateCheckout(payload);
      window.location.href = response.authorization_url;
    } catch (error) {
      setStatus('Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page fade-in checkout-page">
      <div className="checkout-shell">
        <section className="checkout-panel checkout-panel--dark">
          <div>
            <div className="checkout-brand">Stoik</div>
          </div>

          <div className="checkout-interval-card">
            <label htmlFor="checkout-interval" className="checkout-label">Contribution interval</label>
            <select
              id="checkout-interval"
              value={interval}
              onChange={(event) => setInterval(Number(event.target.value))}
              className="checkout-select checkout-select--dark"
              disabled={purchaseType === 'once'}
            >
              {[1, 2, 3, 4, 5, 6].map((months) => (
                <option key={months} value={months}>
                  Every {months} month{months > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <p className="checkout-muted">
              {purchaseType === 'once'
                ? 'This is a one-time purchase.'
                : 'You will be charged automatically based on the interval you choose.'}
            </p>
          </div>

          <div className="checkout-summary">
            <div className="checkout-summary-row">
              <span>Items in bag</span>
              <strong>{checkoutItems.length}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Bags selected</span>
              <strong>{checkoutBags.length}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Selected interval</span>
              <strong>Every {interval} month{interval > 1 ? 's' : ''}</strong>
            </div>
            <div className="checkout-summary-row">
              <span>Contribution model</span>
              <strong>{purchaseType === 'once' ? 'One-time' : 'Recurring'}</strong>
            </div>
          </div>

        </section>

        <section className="checkout-panel checkout-panel--light">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-mode" role="group" aria-label="Purchase mode">
              <button
                type="button"
                className={`checkout-mode__btn ${purchaseType === 'once' ? 'is-active' : ''}`}
                onClick={() => setPurchaseType('once')}
              >
                Buy once
              </button>
              <button
                type="button"
                className={`checkout-mode__btn ${purchaseType === 'recurring' ? 'is-active' : ''}`}
                onClick={() => setPurchaseType('recurring')}
              >
                Subscribe
              </button>
            </div>

            <h2 className="checkout-title">Payment method</h2>

            <div
              className={`checkout-method ${method === 'card' ? 'is-active' : ''}`}
              onClick={() => setMethod('card')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') setMethod('card');
              }}
              role="button"
              tabIndex={0}
            >
              <label className="checkout-method-label">
                <input type="radio" checked={method === 'card'} readOnly />
                Debit / Credit Card
              </label>
              {method === 'card' && (
                <div className="checkout-method-fields">
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="Card number"
                    autoComplete="cc-number"
                  />
                  <div className="checkout-grid-2">
                    <input
                      name="cardExpiry"
                      value={form.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM / YY"
                      autoComplete="cc-exp"
                    />
                    <input
                      name="cardCvc"
                      value={form.cardCvc}
                      onChange={handleChange}
                      placeholder="CVC"
                      autoComplete="cc-csc"
                    />
                  </div>
                  <input
                    name="cardHolderName"
                    value={form.cardHolderName}
                    onChange={handleChange}
                    placeholder="Cardholder name"
                    autoComplete="cc-name"
                  />
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="checkout-select"
                  >
                    <option value="NG">Nigeria</option>
                  </select>
                </div>
              )}
            </div>

            <div
              className={`checkout-method ${method === 'bank' ? 'is-active' : ''}`}
              onClick={() => setMethod('bank')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') setMethod('bank');
              }}
              role="button"
              tabIndex={0}
            >
              <label className="checkout-method-label">
                <input type="radio" checked={method === 'bank'} readOnly />
                Bank Transfer
              </label>
              {method === 'bank' && (
                <div className="checkout-method-fields">
                  <input
                    name="standardAccountName"
                    value={form.standardAccountName}
                    onChange={handleChange}
                    placeholder="Full name"
                  />
                  <input
                    name="standardBankName"
                    value={form.standardBankName}
                    onChange={handleChange}
                    placeholder="Bank name"
                  />
                  <input
                    name="standardAccountNumber"
                    value={form.standardAccountNumber}
                    onChange={handleChange}
                    placeholder="Account number"
                  />
                </div>
              )}
            </div>

            <div
              className={`checkout-method ${method === 'ussd' ? 'is-active' : ''}`}
              onClick={() => setMethod('ussd')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') setMethod('ussd');
              }}
              role="button"
              tabIndex={0}
            >
              <label className="checkout-method-label">
                <input type="radio" checked={method === 'ussd'} readOnly />
                USSD
              </label>
              {method === 'ussd' && (
                <p className="checkout-ussd-note">
                  You will be shown a USSD code to approve this {purchaseType === 'once' ? 'one-time' : 'recurring'} payment.
                </p>
              )}
            </div>

            <h3 className="checkout-subtitle">Contact and delivery</h3>
            <div className="checkout-contact-grid">
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" type="tel" />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
              <div className="checkout-grid-2">
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
              </div>
              <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip code" />
            </div>

            <section className="checkout-payment-breakdown" aria-label="Pre-payment summary">
              <div className="checkout-breakdown-row">
                <span>The Executive Playlist</span>
                <strong>{formatNaira(subtotal)}</strong>
              </div>
              <div className="checkout-breakdown-row checkout-breakdown-row--credit-entry">
                <span>Available Credit ({formatNaira(availableCredit)})</span>
                <label className="checkout-credit-check">
                  <input
                    type="checkbox"
                    checked={applyCredit}
                    onChange={(event) => setApplyCredit(event.target.checked)}
                  />
                  <span>Apply to this order</span>
                </label>
              </div>
              <div className="checkout-breakdown-divider" />
              <div className="checkout-breakdown-row checkout-breakdown-row--credit">
                <span>Member Credit Applied</span>
                <strong>-{formatNaira(appliedCredit)}</strong>
              </div>
              <p className="checkout-loop-discount">Loop Discount: {formatNaira(appliedCredit)}</p>
              <p className="checkout-loop-note">
                {applyCredit
                  ? 'Refining your next cycle with your Buy-Back credit.'
                  : 'Buy-Back Value remains reserved in your Vault.'}
              </p>
              <div className="checkout-breakdown-row checkout-breakdown-row--due">
                <span>Total Today</span>
                <strong>{formatNaira(totalDue)}</strong>
              </div>
            </section>

            <section className="checkout-transparency" aria-label="Billing choice">
              <h4>Your Loop, Your Terms.</h4>
              <p>
                Stoik is built for your convenience. While we offer auto-billing for seamless freshness, you can toggle
                <strong> Manual Approval </strong>
                in your settings. We&apos;ll simply send you a 24-hour reminder before your next shipment.
              </p>
              <a href="/billing" onClick={handleSwitchManualApproval}>Switch to Manual Approval</a>
            </section>

            <Button type="submit" disabled={!canContinue}>
              Confirm &amp; Pay
            </Button>

            {status ? <p className="checkout-status">{status}</p> : null}

            <p className="checkout-legal">
              {purchaseType === 'once'
                ? 'By continuing, you authorize Stoik to charge you once for this order.'
                : 'By continuing, you authorize Stoik to charge you automatically based on your selected interval until you cancel.'}
            </p>

            <div className="checkout-links">
              <Link to="/bag">Back to bag</Link>
              <Link to="/shop">Back to collections</Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
