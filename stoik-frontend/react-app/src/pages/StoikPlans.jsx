import { useState } from 'react';
import { initializePaystackSubscription } from '../services/paystack.api.js';
import './stoik-settings.css';

export default function StoikPlans() {
  const [status, setStatus] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('stoik_user') || 'null');

  const subscribe = async () => {
    if (!storedUser?._id) {
      setStatus('Sign in to activate subscriptions.');
      return;
    }

    try {
      setStatus('Initializing subscription...');
      const res = await initializePaystackSubscription({
        userId: storedUser._id,
        planCode: 'PLN_STOIK_PREMIUM'
      });
      const redirect = res?.data?.authorization_url;
      if (redirect) window.location.href = redirect;
      else setStatus('Unable to start checkout. Please try again.');
    } catch (error) {
      setStatus(error?.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <section className="stoik-settings">
      <div className="column">
        <h2>Stoik account</h2>
        <div className="item">Reset password</div>
        <div className="item">Update email address</div>
        <div className="item">Update billing address</div>
        <div className="item">Update payment method</div>
        <div className="item">Find invoice</div>
      </div>

      <div className="column">
        <h2>Stoik subscriptions</h2>
        <div className="item" onClick={subscribe} role="button" tabIndex={0}>
          Subscribe to Stoik Premium
        </div>
        <div className="item">Pause or cancel subscription</div>
        <div className="item">Update next charge date</div>
        <div className="item">Update delivery frequency</div>
        {status ? <p className="stoik-status">{status}</p> : null}
      </div>
    </section>
  );
}
