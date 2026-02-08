import Card from '../components/Card.jsx';
import './privacy.css';

export default function Privacy() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Privacy</div>
      <h1 className="title">Your data, minimal and protected.</h1>
      <p className="subtitle">We collect only what we need to fulfill your subscription.</p>

      <section className="grid grid-2 privacy-grid">
        <Card title="What we store" subtitle="Only essentials">
          Contact details, delivery address, and fit profile.
        </Card>
        <Card title="What we never sell" subtitle="No data resale">
          We do not sell personal data. Ever.
        </Card>
      </section>
    </main>
  );
}
