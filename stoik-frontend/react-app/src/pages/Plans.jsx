import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { getPlans } from '../services/plans.api.js';
import './plans.css';

export default function Plans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans().then(setPlans);
  }, []);

  return (
    <main className="page fade-in">
      <div className="eyebrow">Plans</div>
      <h1 className="title">Choose a cadence that matches your life.</h1>
      <p className="subtitle">Each plan ships clean whites on a monthly rhythm. Pause anytime.</p>

      <section className="plans__note">
        <div>
          <strong>All plans include:</strong>
          <ul>
            <li>One fit profile on file</li>
            <li>Quiet monthly delivery</li>
            <li>Pause or switch anytime</li>
          </ul>
        </div>
        <div>
          <strong>Colors:</strong>
          <div className="plans__colors">
            <Link className="color-swatch color-white" title="White" to="/white"></Link>
            <Link className="color-swatch color-grey" title="Grey" to="/grey"></Link>
            <Link className="color-swatch color-black" title="Black" to="/black"></Link>
            <span className="color-label">Available</span>
          </div>
          <div className="plans__cadence">
            White ships monthly. Black and grey ship every 4 months so future credit redemptions can ship faster across more items.
          </div>
        </div>
      </section>

      <section className="grid grid-3 plans">
        {plans.map((plan) => (
          <Card key={plan.planId} title={plan.name} subtitle={`${plan.unitsPerMonth} shirt(s)/month`}>
            <div className="plan__price">₦{plan.monthlyPrice.toLocaleString()}</div>
            <p className="plan__desc">{plan.description}</p>
            <div className="plan__actions">
              <Link to="/checkout">
                <Button variant="accent">Select {plan.name}</Button>
              </Link>
              <Link to="/size-guide" className="plan__link">Size guide</Link>
            </div>
          </Card>
        ))}
      </section>

      <section className="plans__footnote">
        Billing renews monthly. You can pause or cancel without penalties.
      </section>
    </main>
  );
}
