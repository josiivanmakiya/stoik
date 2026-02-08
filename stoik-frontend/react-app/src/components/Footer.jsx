import StoikLogo from './StoikLogo.jsx';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wrap">
        <div>
          <div className="footer__logo">
            <StoikLogo size={32} />
            <span>stoik</span>
          </div>
          <p>Reduce mental fatigue.</p>
        </div>
        <div className="footer__col">
          <span>Support</span>
          <a href="/contact.html">Contact</a>
          <a href="/disclosure.html">Disclosure</a>
        </div>
        <div className="footer__col">
          <span>Company</span>
          <a href="/locations.html">Locations</a>
          <a href="/terms.html">Terms</a>
        </div>
      </div>
    </footer>
  );
}
