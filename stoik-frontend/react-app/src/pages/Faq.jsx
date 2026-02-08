import Card from '../components/Card.jsx';
import './faq.css';

export default function Faq() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">FAQ</div>
      <h1 className="title">Short answers, no noise.</h1>
      <p className="subtitle">The essentials, kept brief.</p>

      <section className="faq-grid">
        <Card title="Can I pause?" subtitle="Yes, anytime.">
          Pause without penalties. Your next shipment resumes when you decide.
        </Card>
        <Card title="What if sizing is off?" subtitle="We adjust.">
          Update your fit profile and your next shipment will follow.
        </Card>
        <Card title="How does billing work?" subtitle="Monthly cadence.">
          Billing runs once per month. You’ll see the date before checkout.
        </Card>
      </section>
    </main>
  );
}
