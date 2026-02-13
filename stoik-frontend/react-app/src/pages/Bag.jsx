import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import PixelShirts from '../components/PixelShirts.jsx';
import {
  createNamedBag,
  deleteBag,
  getBag,
  getBagCollections,
  getBagMonthlyEquivalentTotal,
  getBagTotal,
  removeFromBag,
  renameBag,
  switchActiveBag,
  toggleBagSubscription,
  updateBagItem,
  updateBagItemCadence
} from '../services/bag.api.js';
import './cart.css';

const formatCurrency = (value) => `₦${Number(value || 0).toLocaleString()}`;

const getItemRef = (item) => item.itemRef || item.consumableId;

export default function Bag() {
  const [bag, setBag] = useState({ items: [], cadenceMonths: 1, name: 'My Bag', bagId: '' });
  const [bagsState, setBagsState] = useState({ bags: [], activeBagId: '', selectedBagIds: [] });
  const [loading, setLoading] = useState(true);
  const [newBagName, setNewBagName] = useState('');

  const refresh = async () => {
    const [active, collections] = await Promise.all([getBag(), getBagCollections()]);
    setBag(active);
    setBagsState(collections);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const total = getBagTotal(bag);
  const monthlyEquivalent = getBagMonthlyEquivalentTotal(bag);
  const hasItems = bag.items && bag.items.length > 0;
  const selectedSet = useMemo(() => new Set(bagsState.selectedBagIds || []), [bagsState.selectedBagIds]);
  const selectedBags = (bagsState.bags || []).filter((entry) => selectedSet.has(entry.bagId));
  const selectedItemsCount = selectedBags.reduce((count, entry) => count + (entry.items?.length || 0), 0);

  const handleRemove = async (ref) => {
    await removeFromBag(ref);
    refresh();
  };

  const handleQuantity = async (ref, quantity) => {
    await updateBagItem(ref, quantity);
    refresh();
  };

  const handleItemCadence = async (ref, cadenceMonths) => {
    await updateBagItemCadence(ref, cadenceMonths);
    refresh();
  };

  const handleCreateBag = async () => {
    await createNamedBag(newBagName);
    setNewBagName('');
    refresh();
  };

  const handleSwitchBag = async (bagId) => {
    await switchActiveBag(bagId);
    refresh();
  };

  const handleRenameBag = async (entry) => {
    const nextName = window.prompt('Name this bag', entry.name || 'My Bag');
    if (!nextName || !nextName.trim()) return;
    await renameBag(entry.bagId, nextName.trim());
    refresh();
  };

  const handleDeleteBag = async (bagId) => {
    await deleteBag(bagId);
    refresh();
  };

  const handleToggleSubscribe = async (bagId, checked) => {
    await toggleBagSubscription(bagId, checked);
    refresh();
  };

  return (
    <main className="page fade-in cart">
      <div>
        <div className="eyebrow">Bag</div>
        <h1 className="title">Save as many named bags as you want.</h1>
        <p className="subtitle">No payment required to save. Pick one or many bags later to subscribe.</p>

        <Card title="My bags" subtitle="Create, name, and choose subscription bags">
          <div className="cart__bags-create">
            <input
              type="text"
              placeholder="New bag name"
              value={newBagName}
              onChange={(event) => setNewBagName(event.target.value)}
            />
            <Button type="button" onClick={handleCreateBag}>Create bag</Button>
          </div>

          {(bagsState.bags || []).map((entry) => (
            <div className={`cart__bag-row ${entry.bagId === bagsState.activeBagId ? 'is-active' : ''}`} key={entry.bagId}>
              <label className="cart__bag-select">
                <input
                  type="radio"
                  name="activeBag"
                  checked={entry.bagId === bagsState.activeBagId}
                  onChange={() => handleSwitchBag(entry.bagId)}
                />
                <span>{entry.name}</span>
              </label>
              <span className="cart__bag-meta">{entry.items?.length || 0} item(s)</span>
              <label className="cart__bag-subscribe">
                <input
                  type="checkbox"
                  checked={selectedSet.has(entry.bagId)}
                  onChange={(event) => handleToggleSubscribe(entry.bagId, event.target.checked)}
                />
                <span>Subscribe</span>
              </label>
              <button type="button" onClick={() => handleRenameBag(entry)}>Rename</button>
              <button type="button" onClick={() => handleDeleteBag(entry.bagId)}>Delete</button>
            </div>
          ))}
        </Card>

        <Card title={`Active bag: ${bag.name || 'My Bag'}`} subtitle="Subscription items">
          {loading && <div className="cart__row">Loading bag...</div>}
          {!loading && !hasItems && (
            <div className="cart__row">
              <span>Your bag is empty.</span>
              <Link to="/essentials" className="cart__link">Browse essentials</Link>
            </div>
          )}
          {!loading && hasItems && bag.items.map((item) => {
            const ref = getItemRef(item);
            return (
              <div key={ref} className="cart__row">
                <span>{item.name}</span>
                <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
                <div>
                  <label>
                    Qty
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => handleQuantity(ref, event.target.value)}
                    />
                  </label>
                  <label>
                    Every
                    <select
                      value={item.cadenceMonths || 1}
                      onChange={(event) => handleItemCadence(ref, event.target.value)}
                    >
                      <option value="1">1 month</option>
                      <option value="2">2 months</option>
                      <option value="3">3 months</option>
                      <option value="4">4 months</option>
                      <option value="5">5 months</option>
                      <option value="6">6 months</option>
                    </select>
                  </label>
                  <button type="button" onClick={() => handleRemove(ref)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          {hasItems && (
            <>
              <div className="cart__row">
                <span>Next box total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              <div className="cart__row">
                <span>Monthly equivalent</span>
                <strong>{formatCurrency(monthlyEquivalent)}</strong>
              </div>
            </>
          )}
        </Card>
      </div>

      <aside className="cart__side">
        <PixelShirts width={260} />
        <Card title="Subscription selection" subtitle="You can subscribe one bag or all">
          <div className="cart__address">
            {selectedBags.length} bag(s) selected with {selectedItemsCount} total item(s).
          </div>
        </Card>
        <Link to="/checkout?mode=once">
          <Button variant="ghost" disabled={selectedItemsCount < 1}>Buy once</Button>
        </Link>
        <Link to="/checkout">
          <Button disabled={selectedItemsCount < 1}>Continue to checkout</Button>
        </Link>
        <Link to="/essentials" className="cart__link">Back to essentials</Link>
      </aside>
    </main>
  );
}
