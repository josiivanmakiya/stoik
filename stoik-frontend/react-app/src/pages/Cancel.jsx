import { Link } from 'react-router-dom';
import './cancel.css';

export default function Cancel() {
  return (
    <main className="page fade-in cancel">
      <div>
        <div className="eyebrow">Cancel</div>
        <h1 className="title">Subscription cancelled.</h1>
        <p className="subtitle">You will not be billed again unless you resubscribe.</p>
        <Link to="/essentials" className="cancel__link">Browse essentials</Link>
      </div>
    </main>
  );
}
