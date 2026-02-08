import Card from '../components/Card.jsx';
import './settings.css';

export default function Settings() {
  return (
    <main className="page fade-in">
      <div className="eyebrow">Settings</div>
      <h1 className="title">Account settings.</h1>
      <p className="subtitle">Minimal controls for a clean experience.</p>

      <section className="grid grid-2 settings-grid">
        <Card title="Notifications" subtitle="Email updates">
          Monthly shipment reminders: On
        </Card>
        <Card title="Security" subtitle="Password">
          Last updated: Jan 2026
        </Card>
      </section>
    </main>
  );
}
