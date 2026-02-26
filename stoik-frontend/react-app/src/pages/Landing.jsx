import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import './landing.css';

export default function Landing() {
  return (
    <main className="page landing fade-in">
      <section className="stoik-hero">
        <div>
          <p className="eyebrow">Stoik Utility</p>
          <h1 className="stoik-hero__title">The Freshness Loop.</h1>
          <p className="stoik-hero__subtitle">
            Premium inner shirts for professionals. Pick your palette,
            set your cadence, and keep your drawer decision-free.
          </p>
          <div className="stoik-hero__actions">
            <Link to="/configure">
              <Button>Start Your Loop</Button>
            </Link>
            <Link to="/shop">
              <Button variant="ghost">View the Palette</Button>
            </Link>
          </div>
        </div>

        <div className="stoik-hero__visual stoik-card">
          <img className="stoik-hero__photo" src="/images/fulda.jpeg" alt="Stoik hero" />
        </div>
      </section>

      <section className="section stoik-cycle">
        <p className="eyebrow">The 90-Day Cycle</p>
        <h2 className="stoik-cycle__title">Logistics on autopilot.</h2>
        <div className="stoik-cycle__grid">
          <article className="stoik-step">
            <span>01</span>
            <h3>Set Selection</h3>
            <p>Choose your baseline pack. Adjust the ratio anytime.</p>
          </article>
          <article className="stoik-step">
            <span>02</span>
            <h3>Set Fit</h3>
            <p>Store your size profile once for every delivery cycle.</p>
          </article>
          <article className="stoik-step">
            <span>03</span>
            <h3>Earn Credit</h3>
            <p>Courier pickup for old garments. Credits auto-apply next billing.</p>
          </article>
        </div>
      </section>

      <section className="section stoik-vault stoik-card">
        <p className="stoik-label">Stoik Credits</p>
        <h2>Trade-in value, visible.</h2>
        <p className="stoik-muted">
          Every verified return creates credit for your next charge. No coupon
          codes. Auto-applied at billing.
        </p>
        <div className="stoik-vault__ledger">
          <div>
            <span>+ ₦2,000</span>
            <strong>Recycled 4 White Shirts</strong>
          </div>
          <div>
            <span>+ ₦500</span>
            <strong>Recycled 1 Grey Shirt</strong>
          </div>
          <div>
            <span>- ₦2,500</span>
            <strong>Applied to Next 90-Day Loop</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

