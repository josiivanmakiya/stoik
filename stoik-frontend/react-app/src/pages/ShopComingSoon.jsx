import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { getBag, setBag } from '../services/bag.api.js';
import './shop.css';

const PRICE = 28500;

const ITEMS = [
  { id: 'stoik-white', name: 'STOIK White', tone: 'white' },
  { id: 'stoik-black', name: 'STOIK Black', tone: 'black' },
  { id: 'stoik-grey', name: 'STOIK Grey', tone: 'grey' }
];

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString('en-NG')}`;

export default function ShopComingSoon() {
  const [status, setStatus] = useState('');
  const [quantities, setQuantities] = useState(
    ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const handleQuantityChange = (itemId, value) => {
    const parsed = Number(value);
    const safe = Number.isFinite(parsed) ? Math.min(99, Math.max(1, Math.round(parsed))) : 1;
    setQuantities((prev) => ({ ...prev, [itemId]: safe }));
  };

  const handleAddToBag = async (item) => {
    const currentBag = await getBag();
    const currentItems = Array.isArray(currentBag?.items) ? currentBag.items : [];
    const selectedQty = quantities[item.id] || 1;

    const existingIndex = currentItems.findIndex((entry) => (entry.planId || entry.itemRef) === item.id);
    const nextItems = [...currentItems];

    if (existingIndex >= 0) {
      const existing = nextItems[existingIndex];
      nextItems[existingIndex] = {
        ...existing,
        quantity: Number(existing.quantity || 1) + selectedQty
      };
    } else {
      nextItems.push({
        type: 'plan',
        planId: item.id,
        itemRef: item.id,
        name: item.name,
        unitPrice: PRICE,
        quantity: selectedQty,
        cadenceMonths: 1,
        color: item.tone
      });
    }

    await setBag(nextItems, currentBag?.cadenceMonths || 1);
    setStatus(`${item.name} x${selectedQty} added to bag.`);
  };

  return (
    <main className="page fade-in shop-page">
      <section className="shop-page__hero">
        <h1>Three Essentials.</h1>
      </section>

      <section className="shop-page__products" aria-label="STOIK product drop">
        {ITEMS.map((item) => (
          <article key={item.id} className="shop-page__card">
            <div className={`shop-page__swatch shop-page__swatch--${item.tone}`} />
            <p className="shop-page__title">{item.name}</p>
            <p className="shop-page__price">{formatNaira(PRICE)}</p>
            <label className="shop-page__qty">
              Qty
              <input
                type="number"
                min="1"
                max="99"
                value={quantities[item.id] || 1}
                onChange={(event) => handleQuantityChange(item.id, event.target.value)}
              />
            </label>
            <Button type="button" onClick={() => handleAddToBag(item)}>
              Add to Bag
            </Button>
          </article>
        ))}
      </section>

      <div className="shop-page__foot">
        <Link to="/bag">Open Bag</Link>
      </div>

      {status ? <p className="shop-page__status">{status}</p> : null}
    </main>
  );
}
