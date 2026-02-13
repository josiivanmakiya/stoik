import Card from '../components/Card.jsx';
import './about.css';

export default function About() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">About</div>
      <h1 className="title">Stoik in one sentence.</h1>
      <p className="subtitle">
        We replace daily basics before you notice they are gone. Calm infrastructure for daily life.
      </p>

      <section className="grid grid-2 about-grid">
        <Card title="The promise" subtitle="Quiet reliability">
          No trend cycles. No excess. Just essentials on a consistent cadence.
        </Card>
        <Card title="The system" subtitle="Fit, cadence, deliver">
          Measure once, select a cadence, and let the loop run in the background.
        </Card>
      </section>
    </main>
  );
}
