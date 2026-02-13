import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import {
  About,
  Auth,
  Bag,
  Billing,
  BlackCollection,
  Cancel,
  Careers,
  Checkout,
  Contact,
  Dashboard,
  Disclosure,
  ErrorPage,
  Essentials,
  Faq,
  FitProfile,
  GreyCollection,
  Landing,
  Locations,
  NotFound,
  Orders,
  Press,
  Privacy,
  Profile,
  Returns,
  Settings,
  Shipping,
  SizeGuide,
  StoikCredit,
  Support,
  Success,
  Terms,
  WhiteCollection
} from './pages/index.js';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/white" element={<WhiteCollection />} />
        <Route path="/grey" element={<GreyCollection />} />
        <Route path="/black" element={<BlackCollection />} />
        <Route path="/essentials" element={<Essentials />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fit" element={<FitProfile />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/cart" element={<Navigate to="/bag" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/disclosure" element={<Disclosure />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/credit" element={<StoikCredit />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<About />} />
        <Route path="/press" element={<Press />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
