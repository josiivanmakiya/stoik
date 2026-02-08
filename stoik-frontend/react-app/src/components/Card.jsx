import './card.css';

export default function Card({ title, subtitle, children }) {
  return (
    <div className="card">
      <div className="card__title">{title}</div>
      {subtitle && <p className="card__subtitle">{subtitle}</p>}
      <div className="card__body">{children}</div>
    </div>
  );
}
