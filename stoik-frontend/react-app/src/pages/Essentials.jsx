import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { addConsumableToBag, removeFromBag } from '../services/bag.api.js';
import { getConsumables } from '../services/consumables.api.js';
import './essentials.css';

const CATEGORY_LABELS = {
  'personal-care-hygiene': 'Personal Care & Hygiene',
  'clothing-accessories': 'Clothing & Accessories',
  'household-cleaning-paper': 'Household Cleaning & Paper',
  'pet-care': 'Pet Care',
  'food-kitchen-staples': 'Food & Kitchen Staples',
  'office-misc': 'Office & Misc Essentials',
  'luxe-novelty': 'Luxe / Novelty'
};

export default function Essentials() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getConsumables()
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      const category = item.category || 'other';
      if (!map.has(category)) map.set(category, []);
      map.get(category).push(item);
    });
    return Array.from(map.entries());
  }, [items]);

  const toggleItem = async (item) => {
    const consumableId = item.consumableId;
    const nextChecked = !selected[consumableId];
    setSelected((prev) => ({
      ...prev,
      [consumableId]: nextChecked
    }));
    if (nextChecked) {
      await addConsumableToBag(item, 1);
      setStatus(`${item.name} added to bag.`);
      navigate('/bag');
      return;
    }
    await removeFromBag(consumableId);
    setStatus(`${item.name} removed from bag.`);
  };

  return (
    <main className="page fade-in">
      <div className="eyebrow">Essentials</div>
      <h1 className="title">Stoik essentials.</h1>
      <p className="subtitle">Select items and add to bag.</p>

      <section className="essentials-toolbar">
        <Link to="/bag">
          <Button variant="ghost">Go to bag</Button>
        </Link>
      </section>
      {status ? <p className="essentials-status">{status}</p> : null}

      <section className="essentials-list">
        {loading ? <p>Loading consumables...</p> : null}
        {!loading && grouped.map(([category, categoryItems]) => (
          <div key={category} className="essentials-block">
            <h2>{CATEGORY_LABELS[category] || category}</h2>
            <div className="essentials-table">
              <div className="essentials-head">
                <span>Item</span>
              </div>
              {categoryItems.map((item) => (
                <div key={item.consumableId} className="essentials-row">
                  <div className="essentials-item-row">
                    <label className="essentials-item">
                      <input
                        type="checkbox"
                        checked={Boolean(selected[item.consumableId])}
                        onChange={() => { toggleItem(item); }}
                      />
                      <svg
                        className="essentials-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        aria-hidden="true"
                      >
                        <rect x="1.5" y="1.5" width="15" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5.2 9.1h7.6M9 5.3v7.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      <span>{item.name}</span>
                    </label>
                    <button
                      type="button"
                      className="essentials-info"
                      aria-label={`What ${item.name} does`}
                    >
                      i
                      <span className="essentials-tooltip" role="tooltip">
                        {Boolean(selected[item.consumableId])
                          ? 'Click to remove this essential from your bag.'
                          : 'Click to add this essential to your bag.'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
