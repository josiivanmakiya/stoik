import { Link } from 'react-router-dom';
import PixelShirts from '../components/PixelShirts.jsx';
import Card from '../components/Card.jsx';
import './collection.css';

export default function WhiteCollection() {
  return (
    <main className="page fade-in collection">
      <div className="collection__hero">
        <div>
          <div className="eyebrow">White</div>
          <h1 className="title">White is the baseline.</h1>
          <p className="subtitle">Monthly delivery. Always clean. Always ready.</p>
          <Link to="/plans" className="collection__link">View plans</Link>
        </div>
        <PixelShirts width={260} />
      </div>

      <section className="grid grid-2 collection__grid">
        <Card title="Cadence" subtitle="Monthly">
          White ships every month as the core Stoik uniform.
        </Card>
        <Card title="Fabric" subtitle="Daily wear">
          Soft, durable, breathable. Built for rotation.
        </Card>
      </section>
    </main>
  );
}
