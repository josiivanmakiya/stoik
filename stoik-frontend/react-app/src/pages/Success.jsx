import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import './success.css';

export default function Success() {
  return (
    <main className="page fade-in success">
      <div>
        <div className="eyebrow">Success</div>
        <h1 className="title">Subscription confirmed.</h1>
        <p className="subtitle">Your first shipment is scheduled. You’re done.</p>
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
