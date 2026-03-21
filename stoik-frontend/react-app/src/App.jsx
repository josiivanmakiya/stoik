import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Landing from "./pages/Landing"
import Shop from "./pages/Shop"
import Configure from "./pages/Configure"
import HowItWorks from "./pages/HowItWorks"
import Credits from "./pages/Credits"
import Auth from "./pages/Auth"
import Bag from "./pages/Bag"
import Checkout from "./pages/Checkout"
import NotFound from "./pages/NotFound"
import Dashboard from "./pages/dashboard/Dashboard"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="shop" element={<Shop />} />
        <Route path="configure" element={<Configure />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="credits" element={<Credits />} />
        <Route path="auth" element={<Auth />} />
        <Route path="bag" element={<Bag />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  )
}
