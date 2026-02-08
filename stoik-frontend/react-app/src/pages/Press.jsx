import Card from '../components/Card.jsx';
import './press.css';

export default function Press() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Press</div>
      <h1 className="title">News and media.</h1>
      <p className="subtitle">Quiet updates, when there is something worth saying.</p>

      <section className="press-list">
        <Card title="Stoik launches in Lagos" subtitle="Feb 2026">
          A calm subscription for white innerwear, built for routine.
        </Card>
      </section>
    </main>
  );
}
