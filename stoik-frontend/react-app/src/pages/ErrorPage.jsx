import { Link } from 'react-router-dom';
import './error.css';

export default function ErrorPage() {
  return (
    <main className="page fade-in error">
      <div>
        <div className="eyebrow">Error</div>
      <h1 className="title">Something went wrong.</h1>
        <p className="subtitle">Try again or return to your dashboard.</p>
        <Link to="/dashboard" className="error__link">Back to dashboard</Link>
      </div>
    </main>
  );
}
