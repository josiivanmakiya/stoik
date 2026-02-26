import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { clearBag, getBag, getBagTotal, removeFromBag, setBag as saveBag } from '../services/bag.api.js';
import './cart.css';

const formatCurrency = (value) => `₦${Number(value || 0).toLocaleString('en-NG')}`;
const ALLOWED_COLORS = new Set(['white', 'black', 'grey']);

const getItemRef = (item) => item.itemRef || item.planId;

export default function Bag() {
  const [bag, setBagState] = useState({ items: [], cadenceMonths: 1 });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const activeBag = await getBag();
    const cleanItems = (activeBag.items || []).filter((item) => ALLOWED_COLORS.has(item.color));

    if (cleanItems.length !== (activeBag.items || []).length) {
      const cleanedBag = await saveBag(cleanItems, activeBag.cadenceMonths || 1);
      setBagState(cleanedBag);
    } else {
      setBagState(activeBag);
    }

    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const hasItems = (bag.items || []).length > 0;
  const total = useMemo(() => getBagTotal(bag), [bag]);

  const handleRemove = async (ref) => {
    await removeFromBag(ref);
    refresh();
  };

  const handleQuantity = async (ref, value) => {
    const parsed = Number(value);
    const quantity = Number.isFinite(parsed) ? Math.min(99, Math.max(1, Math.round(parsed))) : 1;
    const nextItems = (bag.items || []).map((item) => {
      const currentRef = getItemRef(item);
      if (currentRef !== ref) return item;
      return { ...item, quantity };
    });
    await saveBag(nextItems, bag.cadenceMonths || 1);
    refresh();
  };

  const handleClear = async () => {
    await clearBag();
    refresh();
  };

  return (
    <main className="page fade-in cart">
      <section>
        <div className="eyebrow">Bag</div>
        <h1 className="title">Black. White. Grey.</h1>
        <p className="subtitle">Only STOIK undershirts in your bag.</p>

        <Card title="Your bag items" subtitle="Minimal drop only">
          {loading ? <div className="cart__row">Loading bag...</div> : null}

          {!loading && !hasItems ? (
            <div className="cart__empty">
              <p>Your bag is empty.</p>
              <Link to="/shop" className="cart__link">Go to shop</Link>
            </div>
          ) : null}

          {!loading && hasItems
            ? bag.items.map((item) => {
                const ref = getItemRef(item);
                return (
                  <article className="cart__item" key={ref}>
                    <div className={`cart__chip cart__chip--${item.color || 'grey'}`} />
                    <div>
                      <p className="cart__item-name">{item.name}</p>
                      <p className="cart__item-meta">Undershirt</p>
                    </div>
                    <div className="cart__qty">
                      <label htmlFor={`qty-${ref}`}>Qty</label>
                      <input
                        id={`qty-${ref}`}
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity || 1}
                        onChange={(event) => handleQuantity(ref, event.target.value)}
                      />
                    </div>
                    <strong>{formatCurrency((item.unitPrice || 0) * (item.quantity || 1))}</strong>
                    <button type="button" onClick={() => handleRemove(ref)}>Remove</button>
                  </article>
                );
              })
            : null}
        </Card>
      </section>

      <aside className="cart__side">
        <Card title="Order total" subtitle="Three-color essentials">
          <div className="cart__summary-row">
            <span>Items</span>
            <strong>{(bag.items || []).length}</strong>
          </div>
          <div className="cart__summary-row">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </Card>

        <Link to="/checkout">
          <Button disabled={!hasItems}>Checkout</Button>
        </Link>
        <Button type="button" variant="ghost" onClick={handleClear} disabled={!hasItems}>
          Clear Bag
        </Button>
        <Link to="/shop" className="cart__link">Back to shop</Link>
      </aside>
    </main>
  );
}
