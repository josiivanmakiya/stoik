import { USE_MOCK } from './config.js';
import { apiRequest } from './apiClient.js';

const LEGACY_BAG_KEY = 'stoik_bag';
const BAGS_KEY = 'stoik_bags_state';

const makeBagId = () => `bag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const normalizeCadence = (value) => {
  const parsed = Number(value || 1);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(6, Math.max(1, Math.round(parsed)));
};

const itemRef = (item) => item.itemRef || item.consumableId;
const itemCadence = (item) => normalizeCadence(item?.cadenceMonths || item?.defaultCadenceMonths || 1);

const emptyBag = (name = 'My Bag') => ({
  bagId: makeBagId(),
  name,
  items: [],
  cadenceMonths: 1,
  currency: 'NGN',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const normalizeBag = (bag, fallbackName = 'My Bag') => {
  const items = Array.isArray(bag?.items) ? bag.items : [];
  const normalizedItems = items.map((item) => ({
    ...item,
    itemRef: itemRef(item),
    type: item.type || 'consumable',
    cadenceMonths: itemCadence(item)
  }));

  return {
    ...emptyBag(fallbackName),
    ...bag,
    bagId: String(bag?.bagId || makeBagId()),
    name: String(bag?.name || fallbackName),
    cadenceMonths: normalizeCadence(bag?.cadenceMonths),
    items: normalizedItems,
    updatedAt: new Date().toISOString()
  };
};

const defaultState = () => {
  const first = emptyBag('My Bag');
  return {
    activeBagId: first.bagId,
    selectedBagIds: [first.bagId],
    bags: [first]
  };
};

const migrateLegacyBag = () => {
  try {
    const raw = localStorage.getItem(LEGACY_BAG_KEY);
    if (!raw) return null;
    const legacy = JSON.parse(raw);
    if (!legacy || !Array.isArray(legacy.items)) return null;
    return normalizeBag({
      name: 'My Bag',
      items: legacy.items,
      cadenceMonths: legacy.cadenceMonths
    }, 'My Bag');
  } catch (error) {
    return null;
  }
};

const loadBagsState = () => {
  try {
    const raw = localStorage.getItem(BAGS_KEY);
    if (!raw) {
      const migrated = migrateLegacyBag();
      if (!migrated) return defaultState();
      return {
        activeBagId: migrated.bagId,
        selectedBagIds: [migrated.bagId],
        bags: [migrated]
      };
    }

    const parsed = JSON.parse(raw);
    const bags = (Array.isArray(parsed?.bags) ? parsed.bags : [])
      .map((bag, index) => normalizeBag(bag, `Bag ${index + 1}`));

    if (!bags.length) return defaultState();

    const activeBagId = bags.some((bag) => bag.bagId === parsed?.activeBagId)
      ? parsed.activeBagId
      : bags[0].bagId;

    const selectedBagIds = (Array.isArray(parsed?.selectedBagIds) ? parsed.selectedBagIds : [])
      .filter((bagId) => bags.some((bag) => bag.bagId === bagId));

    return {
      activeBagId,
      selectedBagIds: selectedBagIds.length ? selectedBagIds : [activeBagId],
      bags
    };
  } catch (error) {
    return defaultState();
  }
};

const saveBagsState = (state) => {
  const normalizedBags = (Array.isArray(state?.bags) ? state.bags : [])
    .map((bag, index) => normalizeBag(bag, `Bag ${index + 1}`));

  const safeState = normalizedBags.length
    ? {
        activeBagId: normalizedBags.some((bag) => bag.bagId === state?.activeBagId)
          ? state.activeBagId
          : normalizedBags[0].bagId,
        selectedBagIds: (Array.isArray(state?.selectedBagIds) ? state.selectedBagIds : [])
          .filter((bagId) => normalizedBags.some((bag) => bag.bagId === bagId)),
        bags: normalizedBags
      }
    : defaultState();

  if (!safeState.selectedBagIds.length) {
    safeState.selectedBagIds = [safeState.activeBagId];
  }

  localStorage.setItem(BAGS_KEY, JSON.stringify(safeState));
  return safeState;
};

const getActiveBagFromState = (state) => {
  const active = state.bags.find((bag) => bag.bagId === state.activeBagId);
  return active || state.bags[0] || emptyBag('My Bag');
};

const updateActiveBag = (state, updater) => {
  const nextBags = state.bags.map((bag) => {
    if (bag.bagId !== state.activeBagId) return bag;
    const updated = updater(bag);
    return normalizeBag({ ...updated, bagId: bag.bagId, name: updated.name || bag.name }, bag.name);
  });
  return saveBagsState({ ...state, bags: nextBags });
};

export const getBagCollections = async () => {
  return loadBagsState();
};

export const createNamedBag = async (name = '') => {
  const state = loadBagsState();
  const bagName = String(name || '').trim() || `Bag ${state.bags.length + 1}`;
  const nextBag = emptyBag(bagName);
  return saveBagsState({
    ...state,
    activeBagId: nextBag.bagId,
    selectedBagIds: [...state.selectedBagIds, nextBag.bagId],
    bags: [...state.bags, nextBag]
  });
};

export const renameBag = async (bagId, name) => {
  const trimmed = String(name || '').trim();
  if (!trimmed) return loadBagsState();
  const state = loadBagsState();
  const nextBags = state.bags.map((bag) => (
    bag.bagId === bagId ? { ...bag, name: trimmed, updatedAt: new Date().toISOString() } : bag
  ));
  return saveBagsState({ ...state, bags: nextBags });
};

export const switchActiveBag = async (bagId) => {
  const state = loadBagsState();
  if (!state.bags.some((bag) => bag.bagId === bagId)) return state;
  return saveBagsState({ ...state, activeBagId: bagId });
};

export const deleteBag = async (bagId) => {
  const state = loadBagsState();
  if (state.bags.length <= 1) {
    const only = normalizeBag({ ...state.bags[0], items: [] }, 'My Bag');
    return saveBagsState({
      activeBagId: only.bagId,
      selectedBagIds: [only.bagId],
      bags: [only]
    });
  }

  const nextBags = state.bags.filter((bag) => bag.bagId !== bagId);
  const activeBagId = state.activeBagId === bagId ? nextBags[0].bagId : state.activeBagId;
  const selectedBagIds = state.selectedBagIds.filter((id) => id !== bagId);
  return saveBagsState({
    activeBagId,
    selectedBagIds: selectedBagIds.length ? selectedBagIds : [activeBagId],
    bags: nextBags
  });
};

export const toggleBagSubscription = async (bagId, selected) => {
  const state = loadBagsState();
  if (!state.bags.some((bag) => bag.bagId === bagId)) return state;

  const set = new Set(state.selectedBagIds);
  if (selected) set.add(bagId);
  else set.delete(bagId);

  if (!set.size) set.add(state.activeBagId);

  return saveBagsState({
    ...state,
    selectedBagIds: Array.from(set)
  });
};

export const setSelectedBagsForSubscription = async (bagIds = []) => {
  const state = loadBagsState();
  const allowed = new Set(state.bags.map((bag) => bag.bagId));
  const filtered = bagIds.filter((id) => allowed.has(id));
  return saveBagsState({
    ...state,
    selectedBagIds: filtered.length ? filtered : [state.activeBagId]
  });
};

export const getSelectedBagsForSubscription = async () => {
  const state = loadBagsState();
  const set = new Set(state.selectedBagIds);
  return state.bags.filter((bag) => set.has(bag.bagId));
};

export const getBag = async () => {
  const state = loadBagsState();
  return getActiveBagFromState(state);
};

export const setBag = async (items, cadenceMonths = 1) => {
  const state = loadBagsState();
  const normalizedItems = (items || []).map((item) => ({
    ...item,
    itemRef: itemRef(item),
    type: item.type || 'consumable',
    cadenceMonths: itemCadence(item)
  }));

  const nextState = updateActiveBag(state, (bag) => ({
    ...bag,
    items: normalizedItems,
    cadenceMonths: normalizeCadence(cadenceMonths),
    updatedAt: new Date().toISOString()
  }));

  if (!USE_MOCK && localStorage.getItem('stoik_token')) {
    try {
      await apiRequest('/bag', {
        method: 'PUT',
        body: JSON.stringify({ items: normalizedItems, cadenceMonths: normalizeCadence(cadenceMonths) })
      });
    } catch (error) {
      // Keep local bag as source of truth for multi-bag flow.
    }
  }

  return getActiveBagFromState(nextState);
};

export const addConsumableToBag = async (consumable, quantity = 1) => {
  if (!consumable?.consumableId) return getBag();

  const active = await getBag();
  const ref = consumable.consumableId;
  const nextItems = [...active.items];
  const index = nextItems.findIndex((item) => itemRef(item) === ref);

  if (index >= 0) {
    const existing = nextItems[index];
    nextItems[index] = {
      ...existing,
      quantity: Math.max(1, Number(existing.quantity || 1) + Number(quantity || 1))
    };
  } else {
    nextItems.push({
      type: 'consumable',
      itemRef: consumable.consumableId,
      consumableId: consumable.consumableId,
      name: consumable.name,
      category: consumable.category,
      tooltip: consumable.tooltip,
      unitPrice: consumable.unitPrice,
      quantity: Math.max(1, Number(quantity) || 1),
      cadenceMonths: itemCadence(consumable)
    });
  }

  return setBag(nextItems, active.cadenceMonths);
};

export const addManyConsumablesToBag = async (consumables = []) => {
  const list = (Array.isArray(consumables) ? consumables : []).filter((item) => item?.consumableId);
  if (!list.length) return getBag();

  const active = await getBag();
  const nextItems = [...active.items];

  list.forEach((consumable) => {
    const ref = consumable.consumableId;
    const index = nextItems.findIndex((item) => itemRef(item) === ref);

    if (index >= 0) {
      const existing = nextItems[index];
      nextItems[index] = {
        ...existing,
        quantity: Math.max(1, Number(existing.quantity || 1) + 1),
        cadenceMonths: itemCadence(consumable)
      };
      return;
    }

    nextItems.push({
      type: 'consumable',
      itemRef: consumable.consumableId,
      consumableId: consumable.consumableId,
      name: consumable.name,
      category: consumable.category,
      tooltip: consumable.tooltip,
      unitPrice: consumable.unitPrice,
      quantity: 1,
      cadenceMonths: itemCadence(consumable)
    });
  });

  return setBag(nextItems, active.cadenceMonths);
};

export const updateBagItem = async (ref, quantity) => {
  const active = await getBag();
  const normalizedRef = String(ref || '');

  const next = active.items.map((item) => {
    const currentRef = String(itemRef(item) || '');
    if (currentRef !== normalizedRef) return item;

    return {
      ...item,
      quantity: Math.max(1, Number(quantity) || 1),
      cadenceMonths: itemCadence(item)
    };
  });

  return setBag(next, active.cadenceMonths);
};

export const updateBagItemCadence = async (ref, cadenceMonths) => {
  const active = await getBag();
  const normalizedRef = String(ref || '');
  const next = active.items.map((item) => {
    const currentRef = String(itemRef(item) || '');
    if (currentRef !== normalizedRef) return item;
    return {
      ...item,
      cadenceMonths: normalizeCadence(cadenceMonths)
    };
  });
  return setBag(next, active.cadenceMonths);
};

export const removeFromBag = async (ref) => {
  const active = await getBag();
  const normalizedRef = String(ref || '');
  const next = active.items.filter((item) => String(itemRef(item) || '') !== normalizedRef);
  return setBag(next, active.cadenceMonths);
};

export const updateBagCadence = async (cadenceMonths) => {
  const active = await getBag();
  return setBag(active.items, normalizeCadence(cadenceMonths));
};

export const clearBag = async () => {
  const active = await getBag();
  return setBag([], active.cadenceMonths);
};

export const clearSelectedBags = async () => {
  const state = loadBagsState();
  const selected = new Set(state.selectedBagIds);
  const nextBags = state.bags.map((bag) => (
    selected.has(bag.bagId) ? normalizeBag({ ...bag, items: [] }, bag.name) : bag
  ));
  saveBagsState({ ...state, bags: nextBags });
  return getActiveBagFromState(loadBagsState());
};

export const getBagTotal = (bag) => {
  if (!bag || !Array.isArray(bag.items)) return 0;
  return bag.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

export const getBagMonthlyEquivalentTotal = (bag) => {
  if (!bag || !Array.isArray(bag.items)) return 0;
  return bag.items.reduce((sum, item) => {
    const cadenceMonths = itemCadence(item);
    return sum + ((item.unitPrice * item.quantity) / cadenceMonths);
  }, 0);
};

export const initiateCheckout = async ({ items, cadenceMonths, customer, shipping, paymentMethod = 'card', bags = [] }) => {
  if (USE_MOCK) {
    return {
      authorization_url: '/success?reference=mock_ref_123',
      reference: 'mock_ref_123',
      bags
    };
  }
  return apiRequest('/checkout/initialize', {
    method: 'POST',
    body: JSON.stringify({ items, cadenceMonths, customer, shipping, paymentMethod, bags })
  });
};

export const verifyCheckout = async (reference) => {
  if (USE_MOCK) {
    return { status: 'success', reference };
  }
  return apiRequest(`/checkout/verify/${reference}`);
};
