import Card from '../components/Card.jsx';
import './locations.css';

export default function Locations() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Locations</div>
      <h1 className="title">Quiet delivery hubs.</h1>
      <p className="subtitle">Current service regions and delivery timing.</p>

      <section className="grid grid-2 locations-grid">
        <Card title="Lagos" subtitle="2–3 business days">
          Lekki, Victoria Island, Ikoyi.
        </Card>
        <Card title="Abuja" subtitle="3–5 business days">
          Central districts with standard delivery.
        </Card>
      </section>
    </main>
  );
}
