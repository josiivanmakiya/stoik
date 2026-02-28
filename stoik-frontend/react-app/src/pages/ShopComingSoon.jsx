import { Link } from 'react-router-dom';
import './shop.css';

export default function ShopComingSoon() {
  return (
    <main className="page fade-in shop-page">
      <section className="shop-page__hero">
        <h1>Three Essentials.</h1>
        <p>Image-led drop preview for STOIK.</p>
        <img
          className="shop-page__hero-image"
          src="/images/shop-reference-board.png"
          alt="STOIK shop visual board reference"
          loading="eager"
        />
      </section>

      <div className="shop-page__foot">
        <Link to="/configure">Open Configurator</Link>
      </div>
    </main>
  );
}
