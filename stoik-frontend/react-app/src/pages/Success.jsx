import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { clearSelectedBags, verifyCheckout } from '../services/bag.api.js';
import './success.css';

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
        <div className="success__actions">
          <Link to="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link to="/fit" className="success__link">Update fit</Link>
        </div>
      </div>
    </main>
  );
}
