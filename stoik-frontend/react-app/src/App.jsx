import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import {
  Auth,
  Bag,
  Billing,
  Cancel,
  Checkout,
  Contact,
  Configurator,
  Disclosure,
  Landing,
  Privacy,
  ShopComingSoon,
  StoikCredit,
  Success,
  Terms
} from './pages/index.js';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/configure" element={<Configurator />} />
        <Route path="/shop" element={<ShopComingSoon />} />
        <Route path="/cart" element={<Navigate to="/bag" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/credit" element={<StoikCredit />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/disclosure" element={<Disclosure />} />
        <Route path="/billing" element={<Billing />} />

        <Route path="/white" element={<Navigate to="/configure" replace />} />
        <Route path="/grey" element={<Navigate to="/configure" replace />} />
        <Route path="/black" element={<Navigate to="/configure" replace />} />
        <Route path="/dashboard" element={<Navigate to="/bag" replace />} />
        <Route path="/fit" element={<Navigate to="/configure" replace />} />
        <Route path="/profile" element={<Navigate to="/bag" replace />} />
        <Route path="/orders" element={<Navigate to="/bag" replace />} />
        <Route path="/settings" element={<Navigate to="/billing" replace />} />
        <Route path="/shipping" element={<Navigate to="/checkout" replace />} />
        <Route path="/locations" element={<Navigate to="/" replace />} />
        <Route path="/faq" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="/press" element={<Navigate to="/" replace />} />
        <Route path="/careers" element={<Navigate to="/" replace />} />
        <Route path="/error" element={<Navigate to="/" replace />} />
        <Route path="/support" element={<Navigate to="/" replace />} />
        <Route path="/returns" element={<Navigate to="/" replace />} />
        <Route path="/size-guide" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
