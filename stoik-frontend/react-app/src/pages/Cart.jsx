import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import PixelShirts from '../components/PixelShirts.jsx';
import './cart.css';

export default function Cart() {
  return (
    <main className="page fade-in cart">
      <div>
        <div className="eyebrow">Cart</div>
        <h1 className="title">Review your subscription.</h1>
        <p className="subtitle">One plan, one cadence. Clean and predictable.</p>

        <Card title="Premium plan" subtitle="2 shirts per month">
          <div className="cart__row">
            <span>Monthly total</span>
            <strong>₦9,800</strong>
          </div>
          <div className="cart__row">
            <span>First shipment</span>
            <strong>March 1, 2026</strong>
          </div>
          <div className="cart__row">
            <span>Fit profile</span>
            <strong>Saved</strong>
          </div>
        </Card>
      </div>

      <aside className="cart__side">
        <PixelShirts width={260} />
        <Card title="Shipping" subtitle="Primary address">
          <div className="cart__address">
            12 Aba Street, Lekki Phase 1
            <br />
            Lagos, NG
          </div>
          <Link to="/shipping" className="cart__link">Edit address</Link>
        </Card>
        <Link to="/checkout">
          <Button>Continue to checkout</Button>
        </Link>
        <Link to="/plans" className="cart__link">Back to plans</Link>
      </aside>
    </main>
  );
}
