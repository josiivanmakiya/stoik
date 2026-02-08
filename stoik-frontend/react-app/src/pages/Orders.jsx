import Card from '../components/Card.jsx';
import './orders.css';

export default function Orders() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Orders</div>
      <h1 className="title">Order history.</h1>
      <p className="subtitle">A calm record of every shipment.</p>

      <section className="orders">
        <Card title="March 2026 shipment" subtitle="In transit">
          <div className="orders__row">
            <span>Plan</span>
            <strong>Core</strong>
          </div>
          <div className="orders__row">
            <span>Tracking</span>
            <strong>STK-28491</strong>
          </div>
          <div className="orders__row">
            <span>Estimated arrival</span>
            <strong>Mar 3, 2026</strong>
          </div>
        </Card>
      </section>
    </main>
  );
}
