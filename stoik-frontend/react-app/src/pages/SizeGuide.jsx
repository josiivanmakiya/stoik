import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import './size-guide.css';

export default function SizeGuide() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Size Guide</div>
      <h1 className="title">Find your fit.</h1>
      <p className="subtitle">Measure once. Save forever. We keep it simple.</p>

      <section className="grid grid-2 size-grid">
        <Card title="How to measure" subtitle="Chest, waist, hips, height">
          Use a soft tape. Keep it snug, not tight. Measure over a thin tee.
        </Card>
        <Card title="Size mapping" subtitle="Based on chest + waist">
          XS: chest 92 / waist 78
          <br />
          S: chest 96 / waist 82
          <br />
          M: chest 100 / waist 86
          <br />
          L: chest 105 / waist 91
          <br />
          XL: chest 110 / waist 96
          <br />
          XXL: above
        </Card>
      </section>

      <Link to="/fit" className="size-guide__cta">Set fit profile</Link>
    </main>
  );
}
