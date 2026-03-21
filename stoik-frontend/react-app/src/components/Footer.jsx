import { Link } from "react-router-dom"
import "./footer.css"

export default function Footer() {
  return (
    <>
      <footer>
        <div>
          <Link to="/" className="ft-logo">Stoik</Link>
          <p className="ft-tag">Inner wear, handled.<br />Lagos-built. Nigeria-wide.<br />The men who know, know.</p>
        </div>
        <div>
          <div className="ft-h">Product</div>
          <ul className="ft-ul">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/configure">Configure</Link></li>
            <li><Link to="/credits">Credits</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
          </ul>
        </div>
        <div>
          <div className="ft-h">Account</div>
          <ul className="ft-ul">
            <li><Link to="/auth">Login</Link></li>
            <li><Link to="/auth?mode=signup">Sign Up</Link></li>
            <li><Link to="/bag">My Bag</Link></li>
            <li><Link to="/billing">Billing</Link></li>
          </ul>
        </div>
        <div>
          <div className="ft-h">Legal</div>
          <ul className="ft-ul">
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </footer>
      <div className="ft-bar">
        <span className="ft-copy">© 2026 Stoik. All rights reserved.</span>
        <span className="ft-copy">Lagos · Nigeria · Est. 2026</span>
      </div>
    </>
  )
}
