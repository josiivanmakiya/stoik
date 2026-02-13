import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ColorCollectionsNav from '../components/ColorCollectionsNav.jsx';
import PixelShirts from '../components/PixelShirts.jsx';
import './landing.css';

export default function Landing() {
  return (
    <main className="page landing fade-in">
      <section className="hero">
        <div>
          <div className="eyebrow">Stoik Utility</div>
          <h1 className="title">White innerwear that shows up before you notice it’s gone.</h1>
          <p className="subtitle">
            Stoik replaces consumables on a steady, reliable cadence. It delivers quiet confidence
            in the best possible way: your basics, always ready.
          </p>
          <div className="hero__actions">
            <Link to="/essentials">
              <Button>Shop essentials</Button>
            </Link>
            <Link to="/essentials">
              <Button variant="ghost">Browse essentials</Button>
            </Link>
          </div>
          <div className="hero__note">Set it once. Adjust anytime. Quiet confidence, maintained.</div>
        </div>
        <div className="hero__panel">
          <PixelShirts width={300} />
          <div className="hero__stat">
            <span>Monthly refresh</span>
            <strong>1–3 shirts</strong>
          </div>
          <div className="hero__stat">
            <span>Fit confidence</span>
            <strong>Size profile</strong>
          </div>
          <div className="hero__stat">
            <span>Simple delivery</span>
            <strong>Always on time</strong>
          </div>
        </div>
      </section>

      <section className="grid grid-3 section">
        <Card
          title="Predictable basics"
          subtitle="No closet panic. No surprise gaps."
        >
          Set it once. Stoik handles the rotation and replenishment without noise.
        </Card>
        <Card title="Clean fit data" subtitle="Built for your profile.">
          A minimal size profile ensures every shipment feels exact.
        </Card>
        <Card title="Quiet confidence" subtitle="Utility that feels premium.">
          You get consistency, not clutter.
        </Card>
      </section>

      <section className="section flow">
        <div className="flow__intro">
          <div className="eyebrow">How it works</div>
          <h2 className="title">A steady monthly loop.</h2>
          <p className="subtitle">
            Pick a cadence, set your fit, and let Stoik maintain the baseline. No browsing. No reorders.
          </p>
          <ColorCollectionsNav className="flow__color-nav" />
        </div>
        <div className="grid grid-3">
          <Card title="1. Choose cadence" subtitle="Monthly or quarterly">
            Decide how often you want a reset. You can pause or switch anytime.
          </Card>
          <Card title="2. Set your fit" subtitle="One size profile">
            Add measurements once. We use it for every shipment.
          </Card>
          <Card title="3. Receive reliably" subtitle="Just the essentials">
            Your drawer stays ready without you thinking about it.
          </Card>
        </div>
      </section>
    </main>
  );
}
