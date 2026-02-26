import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { clearSelectedBags, verifyCheckout } from '../services/bag.api.js';
import './success.css';

const LOYALTY_DEDUCTION = 2500;
const formatNaira = (value) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

export default function Success() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (!reference) {
      setStatus('missing');
      setMessage('Missing payment reference.');
      return;
    }

    verifyCheckout(reference)
      .then(async (result) => {
        if (result.status === 'success') {
          await clearSelectedBags();
          setStatus('success');
          setMessage('Subscription confirmed. You are all set.');
        } else {
          setStatus('failed');
          setMessage('Payment verification failed.');
        }
      })
      .catch(() => {
        setStatus('failed');
        setMessage('Payment verification failed.');
      });
  }, [reference]);

  return (
    <main className="page fade-in success">
      <div>
        <div className="eyebrow">Success</div>
        <h1 className="title">{status === 'success' ? 'Subscription confirmed.' : 'Payment pending.'}</h1>
        <p className="subtitle">{message}</p>

        {status === 'success' ? (
          <section className="success__receipt" aria-label="Receipt summary">
            <p className="success__receipt-label">Receipt</p>
            <div className="success__receipt-row">
              <span>Loyalty Deduction</span>
              <strong>-{formatNaira(LOYALTY_DEDUCTION)}</strong>
            </div>
          </section>
        ) : null}

        <div className="success__actions">
          <Link to="/bag">
            <Button>Go to dashboard</Button>
          </Link>
          <Link to="/configure" className="success__link">Update fit</Link>
        </div>
      </div>
    </main>
  );
}
