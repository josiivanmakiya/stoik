import './stoik-credit.css';

export default function StoikCredit() {
  return (
    <main className="page fade-in credit-page">
      <section className="credit-page__content">
        <div className="eyebrow">Stoik Credit</div>
        <h1 className="title">Turn old clothes into credit.</h1>
        <p className="subtitle">
          Recycle used garments and apply the value toward future Stoik shipments.
        </p>
        <blockquote className="credit__quote">
          "What you wear every day should build your world, not cost it. At Stoik, every thread returned is a credit earned for the future."
          <span className="credit__quote-author">- Stoik CEO J.V Maks</span>
        </blockquote>
        <p className="subtitle"><strong>Coming soon.</strong></p>
      </section>
    </main>
  );
}
