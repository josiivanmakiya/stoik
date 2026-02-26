import { Link } from 'react-router-dom';
import StoikLogo from './StoikLogo.jsx';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <section className="footer__trust">
        <h3>The Stoik Standard</h3>
        <div className="footer__trust-grid">
          <article>
            <h4>Priority Dispatch</h4>
            <p>
              Timed delivery around your cadence across Nigeria. Track every loop
              from dispatch to doorstep.
            </p>
          </article>
          <article>
            <h4>Stoik ID Verification</h4>
            <p>
              NIN or BVN verification protects your account and ensures credits
              are tied to one verified member.
            </p>
          </article>
          <article>
            <h4>Buy-Back Guarantee</h4>
            <p>
              Return worn Stoik garments during delivery pickup. Credits apply
              automatically to your next billing cycle.
            </p>
          </article>
        </div>
      </section>

      <div className="footer__wrap">
        <div>
          <div className="footer__logo">
            <StoikLogo size={32} />
            <span>stoik</span>
          </div>
          <p>Decision-free wardrobe utility.</p>
        </div>

        <div className="footer__col">
          <span>Product</span>
          <Link to="/configure">The Playlist</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/credit">Stoik Credits</Link>
        </div>

        <div className="footer__col">
          <span>Utility</span>
          <Link to="/configure">The 90-Day Loop</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/bag">Member Bag</Link>
        </div>

        <div className="footer__col">
          <span>Official</span>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/disclosure">Sustainability</Link>
        </div>
      </div>

      <div className="footer__legal">© 2026 Stoik Utility. All rights reserved.</div>
    </footer>
  );
}
