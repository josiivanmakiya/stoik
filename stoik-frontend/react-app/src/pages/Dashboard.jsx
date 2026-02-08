import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import PixelShirts from '../components/PixelShirts.jsx';
import { getMySubscriptions } from '../services/subscriptions.api.js';
import './dashboard.css';

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getMySubscriptions().then(setSubscriptions);
  }, []);

  return (
    <main className="page fade-in">
      <div className="eyebrow">Account</div>
      <h1 className="title">Your Stoik rhythm</h1>
      <p className="subtitle">Status, shipments, and fit profile in one place.</p>

      <section className="grid grid-2 dashboard">
        <Card title="Active subscription" subtitle="Your current plan">
          {subscriptions.length === 0 ? (
            <p>No active subscription yet.</p>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub.id} className="dash__row">
                <div>
                  <strong>{sub.planId.toUpperCase()}</strong>
                  <div className="dash__meta">{sub.status}</div>
                </div>
                <div className="dash__meta">Next bill: {sub.nextBillingDate}</div>
              </div>
            ))
          )}
          <Link to="/plans">
            <Button variant="ghost">Manage plan</Button>
          </Link>
        </Card>

        <Card title="Active colors" subtitle="White · Grey · Black">
          <div className="dash__row">
            <span>White</span>
            <strong className="dash__pill dash__pill--active">Active (monthly)</strong>
          </div>
          <div className="dash__row">
            <span>Grey</span>
            <strong className="dash__pill">Active (every 4 months)</strong>
          </div>
          <div className="dash__row">
            <span>Black</span>
            <strong className="dash__pill">Active (every 4 months)</strong>
          </div>
          <Link to="/grey" className="dash__link">View grey details</Link>
          <Link to="/black" className="dash__link">View black details</Link>
        </Card>

        <Card title="Fit profile" subtitle="Measurements on file">
          <div className="dash__row">
            <div>
              <strong>Chest</strong>
              <div className="dash__meta">102 cm</div>
            </div>
            <div>
              <strong>Size</strong>
              <div className="dash__meta">L</div>
            </div>
          </div>
          <Link to="/fit">
            <Button variant="accent">Update fit</Button>
          </Link>
        </Card>
      </section>

      <section className="dash__strip">
        <PixelShirts width={260} />
        <div>
          <div className="eyebrow">Next shipment</div>
          <h2 className="dash__title">Scheduled for March 1, 2026</h2>
          <p className="dash__meta">
            Core plan · 1 shirt · Delivering to your primary address.
          </p>
          <div className="dash__actions">
            <Link to="/orders">
              <Button variant="ghost">View orders</Button>
            </Link>
            <Link to="/shipping">
              <Button variant="primary">Edit delivery</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
