import Card from '../components/Card.jsx';
import './support.css';

export default function Support() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Support</div>
      <h1 className="title">We respond with clarity.</h1>
      <p className="subtitle">Choose the path that fits your issue.</p>

      <section className="grid grid-2 support-grid">
        <Card title="Account help" subtitle="Login, billing, fit">
          Visit FAQ or contact support for account-level issues.
        </Card>
        <Card title="Order issues" subtitle="Shipping and delivery">
          Track your order or update delivery preferences.
        </Card>
      </section>
    </main>
  );
}
