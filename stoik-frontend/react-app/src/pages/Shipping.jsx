import Card from '../components/Card.jsx';
import './shipping.css';

export default function Shipping() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Shipping</div>
      <h1 className="title">Delivery details.</h1>
      <p className="subtitle">Keep your address current and precise.</p>

      <section className="grid grid-2 shipping-grid">
        <Card title="Primary address" subtitle="Default for shipments">
          <div className="shipping__line">12 Aba Street, Lekki Phase 1</div>
          <div className="shipping__line">Lagos, NG</div>
        </Card>
        <Card title="Delivery preferences" subtitle="Quiet options">
          <div className="shipping__line">Leave at door: Enabled</div>
          <div className="shipping__line">Delivery window: Morning</div>
        </Card>
      </section>
    </main>
  );
}
