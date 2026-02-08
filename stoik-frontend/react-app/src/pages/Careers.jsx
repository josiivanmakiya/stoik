import Card from '../components/Card.jsx';
import './careers.css';

export default function Careers() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Careers</div>
      <h1 className="title">Build calm infrastructure.</h1>
      <p className="subtitle">We hire for calm execution and high standards.</p>

      <section className="careers-grid">
        <Card title="Operations" subtitle="Lagos">
          Own fulfillment, vendor management, and delivery quality.
        </Card>
        <Card title="Product design" subtitle="Remote">
          Build a calm interface that makes subscriptions effortless.
        </Card>
      </section>
    </main>
  );
}
