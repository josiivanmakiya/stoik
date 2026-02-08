import Card from '../components/Card.jsx';
import './disclosure.css';

export default function Disclosure() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Disclosure</div>
      <h1 className="title">Clear terms, no noise.</h1>
      <p className="subtitle">Product details and subscription disclosures.</p>

      <section className="grid grid-2 disclosure-grid">
        <Card title="Materials" subtitle="Fabric care">
          Cotton blend. Wash cold, dry low to maintain fit and color.
        </Card>
        <Card title="Subscription" subtitle="Recurring delivery">
          You will be billed monthly unless paused or cancelled before renewal.
        </Card>
      </section>
    </main>
  );
}
