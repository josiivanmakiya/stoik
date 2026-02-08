import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import PixelShirts from '../components/PixelShirts.jsx';
import './checkout.css';

export default function Checkout() {
  return (
    <main className="page fade-in checkout">
      <div>
        <div className="eyebrow">Checkout</div>
        <h1 className="title">Confirm and subscribe.</h1>
        <p className="subtitle">Quiet, predictable replenishment. No noise.</p>

        <Card title="Your details" subtitle="Contact + delivery">
          <form className="checkout__form">
            <label>
              Full name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@stoik.com" />
            </label>
            <label>
              Phone
              <input type="tel" placeholder="+234" />
            </label>
            <label>
              Address
              <input type="text" placeholder="Street address" />
            </label>
            <div className="checkout__two">
              <label>
                City
                <input type="text" placeholder="City" />
              </label>
              <label>
                State
                <input type="text" placeholder="State" />
              </label>
            </div>
          </form>
        </Card>

        <Card title="Plan summary" subtitle="Premium · 2 shirts/month">
          <div className="checkout__row">
            <span>Monthly total</span>
            <strong>₦9,800</strong>
          </div>
          <div className="checkout__row">
            <span>Next renewal</span>
            <strong>March 1, 2026</strong>
          </div>
          <div className="checkout__row">
            <span>Shipping</span>
            <strong>Included</strong>
          </div>
        </Card>

        <Card title="Delivery details" subtitle="Primary address">
          <div className="checkout__address">
            12 Aba Street, Lekki Phase 1
            <br />
            Lagos, NG
          </div>
          <Link to="/shipping" className="checkout__link">Edit address</Link>
        </Card>
      </div>

      <aside className="checkout__side">
        <PixelShirts width={260} />
        <Card title="Payment method" subtitle="Card ending 4219">
          <div className="checkout__row">
            <span>Card</span>
            <strong>•••• 4219</strong>
          </div>
          <Link to="/billing" className="checkout__link">Update payment</Link>
        </Card>

        <Link to="/success">
          <Button>Confirm subscription</Button>
        </Link>
        <Link to="/plans" className="checkout__link">Back to plans</Link>
      </aside>
    </main>
  );
}
