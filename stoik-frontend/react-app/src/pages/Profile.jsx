import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import './profile.css';

export default function Profile() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Profile</div>
      <h1 className="title">Your Stoik profile.</h1>
      <p className="subtitle">One place for details, fit, and delivery.</p>

      <section className="grid grid-2 profile-grid">
        <Card title="Personal info" subtitle="Account details">
          <div className="profile__row">
            <span>Full name</span>
            <strong>Stoik Member</strong>
          </div>
          <div className="profile__row">
            <span>Email</span>
            <strong>member@stoik.com</strong>
          </div>
          <Link to="/settings" className="profile__link">Edit profile</Link>
        </Card>

        <Card title="Fit profile" subtitle="Saved measurements">
          <div className="profile__row">
            <span>Size label</span>
            <strong>L</strong>
          </div>
          <div className="profile__row">
            <span>Last updated</span>
            <strong>Feb 8, 2026</strong>
          </div>
          <Link to="/fit" className="profile__link">Update fit</Link>
        </Card>
      </section>
    </main>
  );
}
