import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import './collection.css';

export default function GreyCollection() {
  return (
    <main className="page fade-in collection">
      <div className="collection__hero">
        <div>
          <div className="eyebrow">Grey</div>
          <h1 className="title">Grey resets every 4 months.</h1>
          <p className="subtitle">Quiet, neutral rotation to balance the baseline.</p>
          <Link to="/plans" className="collection__link">View plans</Link>
        </div>
        <div className="collection__swatch collection__swatch--grey"></div>
      </div>

      <section className="grid grid-2 collection__grid">
        <Card title="Cadence" subtitle="Every 4 months">
          Grey ships once per quarter as a controlled refresh.
        </Card>
        <Card title="Use case" subtitle="Soft contrast">
          Grey keeps the uniform subtle without looking washed out.
        </Card>
      </section>

      <section className="collection__ad">
        <div className="collection__ad-label">Sponsored placement</div>
        <div className="collection__ad-slot">Ad slot</div>
      </section>
    </main>
  );
}
