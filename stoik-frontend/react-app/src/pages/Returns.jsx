import Card from '../components/Card.jsx';
import './returns.css';

export default function Returns() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Returns</div>
      <h1 className="title">Returns and replacements.</h1>
      <p className="subtitle">Simple rules, no friction.</p>

      <section className="grid grid-2 returns-grid">
        <Card title="Replacement window" subtitle="Fit issues">
          Contact us within 7 days. We will replace the item once.
        </Card>
        <Card title="Hygiene policy" subtitle="Unworn items only">
          Unused items can be replaced. Worn items are not eligible.
        </Card>
      </section>
    </main>
  );
}
