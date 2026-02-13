import { Link } from 'react-router-dom';
import PixelShirts from '../components/PixelShirts.jsx';
import Card from '../components/Card.jsx';
import ColorCollectionsNav from '../components/ColorCollectionsNav.jsx';
import './collection.css';

export default function WhiteCollection() {
  return (
    <main className="page fade-in collection">
      <div className="collection__hero">
        <div>
          <div className="eyebrow">White</div>
          <h1 className="title">White is the baseline.</h1>
          <p className="subtitle">Monthly delivery. Always clean. Always ready.</p>
          <Link to="/essentials" className="collection__link">See our other services</Link>
        </div>
        <PixelShirts width={260} />
      </div>

      <section className="grid grid-2 collection__grid">
        <Card title="Cadence" subtitle="Monthly">
          White ships every month as the core Stoik uniform.
        </Card>
        <Card title="Collections" subtitle="Quick switch">
          <ColorCollectionsNav className="collection__color-nav" />
        </Card>
      </section>
    </main>
  );
}
