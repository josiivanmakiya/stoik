import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import PixelShirts from '../components/PixelShirts.jsx';
import './configurator.css';

const SETS = [
  { id: 'executive', label: 'The Executive', counts: { white: 5, black: 1, grey: 1 } },
  { id: 'shadow', label: 'The Shadow', counts: { white: 1, black: 3, grey: 3 } },
  { id: 'starter', label: 'The Starter', counts: { white: 1, black: 1, grey: 1 } }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const CADENCE_OPTIONS = [30, 90, 180];
const PRICE_PER_SHIRT = 4500;
const MEMBER_CREDIT = 2500;

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

export default function Configurator() {
  const [selectedSetId, setSelectedSetId] = useState('executive');
  const [neckType, setNeckType] = useState('round');
  const [size, setSize] = useState('L');
  const [cadence, setCadence] = useState(90);
  const [quantity, setQuantity] = useState(1);

  const selectedSet = useMemo(
    () => SETS.find((set) => set.id === selectedSetId) || SETS[0],
    [selectedSetId]
  );

  const totalShirts = useMemo(
    () => Object.values(selectedSet.counts).reduce((sum, count) => sum + Number(count || 0), 0) * quantity,
    [selectedSet, quantity]
  );

  const retailTotal = totalShirts * PRICE_PER_SHIRT;
  const appliedCredit = Math.min(MEMBER_CREDIT, retailTotal);
  const memberTotal = Math.max(0, retailTotal - appliedCredit);
  const cadenceLabel = cadence === 90 ? 'Recommended' : null;

  return (
    <main className="page fade-in configurator">
      <div className="eyebrow">Men&apos;s Inner Wear</div>
      <h1 className="title">Stoik Round and V-neck Set Builder</h1>
      <p className="subtitle">
        Decision-free flow for Nigeria. Pick your preset, set your size, choose cadence, and checkout.
      </p>

      <section className="configurator__layout">
        <div className="configurator__media">
          <PixelShirts width={340} />
        </div>

        <div className="configurator__panel">
          <div className="configurator__price">
            <strong>{formatNaira(memberTotal)}</strong>
            <span>Free delivery in Lagos, Abuja, and Port Harcourt.</span>
          </div>

          <section className="configurator__benefit" aria-label="Verified member benefit">
            <p className="configurator__benefit-label">VERIFIED MEMBER BENEFIT</p>
            <div className="configurator__benefit-row">
              <span>Retail Price</span>
              <strong>{formatNaira(retailTotal)}</strong>
            </div>
            <div className="configurator__benefit-row">
              <span>VVIP Member Price</span>
              <strong>{formatNaira(memberTotal)}</strong>
            </div>
            <p className="configurator__benefit-credit">Stoik Credit Applied: –{formatNaira(appliedCredit)}</p>
            <p className="configurator__benefit-note">Buy-Back Value secured through verified member status.</p>
          </section>

          <ol className="configurator__steps">
            <li className="is-active">Set Selection</li>
            <li className="is-active">Size Selection</li>
            <li className="is-active">Frequency</li>
            <li className="is-active">Checkout</li>
          </ol>

          <div className="configurator__section">
            <h2>1. Set Selection</h2>
            <div className="configurator__set-grid">
              {SETS.map((set) => (
                <button
                  key={set.id}
                  type="button"
                  className={`configurator__chip ${selectedSetId === set.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedSetId(set.id)}
                >
                  <strong>{set.label}</strong>
                  <span>
                    W:{set.counts.white} B:{set.counts.black} G:{set.counts.grey}
                  </span>
                </button>
              ))}
            </div>

            <div className="configurator__row">
              <label>Neck Type</label>
              <div className="configurator__inline">
                <button
                  type="button"
                  className={`configurator__small ${neckType === 'round' ? 'is-selected' : ''}`}
                  onClick={() => setNeckType('round')}
                >
                  Round
                </button>
                <button
                  type="button"
                  className={`configurator__small ${neckType === 'v' ? 'is-selected' : ''}`}
                  onClick={() => setNeckType('v')}
                >
                  V-neck
                </button>
              </div>
            </div>

            <div className="configurator__row">
              <label>Pack Multiplier</label>
              <div className="configurator__inline">
                <button type="button" className="configurator__small" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <span className="configurator__qty">{quantity}</span>
                <button type="button" className="configurator__small" onClick={() => setQuantity((q) => Math.min(6, q + 1))}>+</button>
              </div>
            </div>
          </div>

          <div className="configurator__section">
            <h2>2. Size Selection</h2>
            <div className="configurator__size-grid">
              {SIZES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`configurator__small ${size === item ? 'is-selected' : ''}`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="configurator__section">
            <h2>3. Frequency</h2>
            <div className="configurator__size-grid">
              {CADENCE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`configurator__small ${cadence === option ? 'is-selected' : ''}`}
                  onClick={() => setCadence(option)}
                >
                  {option} days {option === 90 ? '(Recommended)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="configurator__section">
            <h2>4. Checkout Summary</h2>
            <p>
              {selectedSet.label} · {neckType === 'round' ? 'Round neck' : 'V-neck'} · Size {size} · Every {cadence} days
            </p>
            <p>{totalShirts} shirts total · {formatNaira(memberTotal)} {cadenceLabel ? `· ${cadenceLabel}` : ''}</p>
            <p className="configurator__note">Paystack-ready recurring billing. OTP confirmation at checkout.</p>
            <div className="configurator__actions">
              <Link to="/checkout">
                <Button>Proceed to checkout</Button>
              </Link>
              <Link to="/shop">
                <Button variant="ghost">Back to collections</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
