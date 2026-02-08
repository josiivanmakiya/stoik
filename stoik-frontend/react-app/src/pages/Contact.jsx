import Card from '../components/Card.jsx';
import './contact.css';

export default function Contact() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Contact</div>
      <h1 className="title">We keep support direct and clear.</h1>
      <p className="subtitle">Clear routes. Fast replies.</p>

      <section className="grid grid-2 contact-grid">
        <Card title="Email" subtitle="Support inbox">
          support@stoik.com
        </Card>
        <Card title="Response time" subtitle="Business hours">
          Typically within 24 hours.
        </Card>
      </section>
    </main>
  );
}
