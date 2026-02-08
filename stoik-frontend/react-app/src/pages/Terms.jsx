import Card from '../components/Card.jsx';
import './terms.css';

export default function Terms() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Terms</div>
      <h1 className="title">Subscription terms.</h1>
      <p className="subtitle">Clear terms for billing, renewal, and cancellation.</p>

      <section className="terms-grid">
        <Card title="Billing cadence" subtitle="Monthly renewal">
          Your plan renews monthly on the date shown at checkout.
        </Card>
        <Card title="Cancellation" subtitle="No penalties">
          Cancel anytime before your next billing date.
        </Card>
      </section>
    </main>
  );
}
