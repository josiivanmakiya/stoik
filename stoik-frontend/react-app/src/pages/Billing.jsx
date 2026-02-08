import Card from '../components/Card.jsx';
import './billing.css';

export default function Billing() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Billing</div>
      <h1 className="title">Payment and invoices.</h1>
      <p className="subtitle">Keep your billing simple and current.</p>

      <section className="grid grid-2 billing-grid">
        <Card title="Payment method" subtitle="Primary card">
          <div className="billing__row">
            <span>Card</span>
            <strong>•••• 4219</strong>
          </div>
          <div className="billing__row">
            <span>Expiry</span>
            <strong>04/28</strong>
          </div>
        </Card>
        <Card title="Invoices" subtitle="Recent billing">
          <div className="billing__row">
            <span>Feb 2026</span>
            <strong>₦9,800</strong>
          </div>
          <div className="billing__row">
            <span>Jan 2026</span>
            <strong>₦9,800</strong>
          </div>
        </Card>
      </section>
    </main>
  );
}
