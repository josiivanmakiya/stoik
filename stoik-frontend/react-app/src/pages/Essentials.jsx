import './essentials.css';

export default function Essentials() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Essentials</div>
      <h1 className="title">Stoik essentials.</h1>
      <p className="subtitle">
        A calm inventory of repeatable daily goods.
      </p>

      <section className="essentials-list">
        <div className="essentials-block">
          <h2>Now</h2>
          <p>Core basics with predictable wear and easy recycling.</p>
          <ul>
            <li><strong>White inner shirts</strong> — Monthly baseline.</li>
            <li><strong>Grey inner shirts</strong> — Every 4 months.</li>
            <li><strong>Black inner shirts</strong> — Every 4 months.</li>
            <li><strong>Plain cotton socks</strong> — Elastic fatigue, fast cycle.</li>
            <li><strong>Basic cotton underwear</strong> — Hygiene cadence.</li>
            <li><strong>Cotton pillowcases</strong> — Oil + wash wear.</li>
            <li><strong>Basic towels + washcloths</strong> — Thinning + staining.</li>
          </ul>
        </div>

        <div className="essentials-block">
          <h2>Next</h2>
          <p>Home + hygiene essentials with high repeat logic.</p>
          <ul>
            <li><strong>Bed sheets</strong> — Sleep reset cadence.</li>
            <li><strong>Deodorant</strong> — Clinical neutral refill.</li>
            <li><strong>Oral care</strong> — Brush heads + floss.</li>
            <li><strong>Basic skincare</strong> — Cleanser, moisturizer, SPF.</li>
            <li><strong>Shower essentials</strong> — Body wash + bar.</li>
            <li><strong>Laundry pods</strong> — Measured refills.</li>
            <li><strong>Hand wash</strong> — Routine restock.</li>
            <li><strong>Paper towels</strong> — Utility restock.</li>
            <li><strong>Trash bags</strong> — Predictable cycle.</li>
            <li><strong>Dish pods</strong> — No-guess replenishment.</li>
          </ul>
        </div>

        <div className="essentials-block">
          <h2>Later</h2>
          <p>Luxury and comfort upgrades for higher tiers.</p>
          <ul>
            <li><strong>Razor blades</strong> — Calm replenishment.</li>
            <li><strong>Shave balm</strong> — Skin-safe daily care.</li>
            <li><strong>Fabric shaver</strong> — Extend garment life.</li>
            <li><strong>Pillow inserts</strong> — Sleep quality refresh.</li>
            <li><strong>Water filters</strong> — Replace before quality drops.</li>
            <li><strong>Air filters</strong> — Quiet replacement cycle.</li>
            <li><strong>Candles</strong> — Low-scent minimal glow.</li>
            <li><strong>Room spray</strong> — Subtle reset.</li>
            <li><strong>Bed throws</strong> — Seasonal refresh.</li>
            <li><strong>Sleep mask</strong> — Elastic fade replacement.</li>
            <li><strong>Herbal tea</strong> — Evening ritual.</li>
            <li><strong>Magnesium sachets</strong> — Night routine.</li>
            <li><strong>Satin pillowcase</strong> — Skin-friendly upgrade.</li>
            <li><strong>Shoe care</strong> — Wipes + polish.</li>
            <li><strong>Travel kits</strong> — Ready-to-go essentials.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
