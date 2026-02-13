import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import ColorCollectionsNav from '../components/ColorCollectionsNav.jsx';
import './collection.css';

export default function BlackCollection() {
  return (
    <main className="page fade-in collection">
      <div className="collection__hero">
        <div>
          <div className="eyebrow">Black</div>
          <h1 className="title">Black resets every 4 months.</h1>
          <p className="subtitle">Deep, deliberate, and slow. A measured rotation.</p>
          <Link to="/essentials" className="collection__link">See our other services</Link>
        </div>
        <div className="collection__swatch collection__swatch--black"></div>
      </div>

      <section className="grid grid-2 collection__grid">
        <Card title="Cadence" subtitle="Every 4 months">
          Black ships once per quarter for controlled longevity.
        </Card>
        <Card title="Collections" subtitle="Quick switch">
          <ColorCollectionsNav className="collection__color-nav" />
        </Card>
      </section>

      <section className="collection__ad">
        <div className="collection__ad-label">Sponsored placement</div>
        <div className="collection__ad-slot">Ad slot</div>
      </section>
    </main>
  );
}
