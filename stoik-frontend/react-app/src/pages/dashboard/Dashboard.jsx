import { Routes, Route, NavLink, useNavigate } from "react-router-dom"
import "./dashboard.css"
import DashHome from "./DashHome"
import DashOrders from "./DashOrders"
import DashCredits from "./DashCredits"
import DashSubscription from "./DashSubscription"
import DashSettings from "./DashSettings"

export default function Dashboard() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem("stoik_user")
    navigate("/auth")
  }

  return (
    <div className="db-wrap">
      <aside className="db-side">
        <div className="db-logo" onClick={() => navigate("/")}>Stoik</div>
        <div className="db-member">
          <div className="db-m-label">Member</div>
          <div className="db-m-num">006</div>
        </div>
        <nav className="db-nav">
          <NavLink to="/dashboard" end className={({isActive}) => isActive ? "db-link on" : "db-link"}>Overview</NavLink>
          <NavLink to="/dashboard/subscription" className={({isActive}) => isActive ? "db-link on" : "db-link"}>Subscription</NavLink>
          <NavLink to="/dashboard/orders" className={({isActive}) => isActive ? "db-link on" : "db-link"}>Orders</NavLink>
          <NavLink to="/dashboard/credits" className={({isActive}) => isActive ? "db-link on" : "db-link"}>Credits</NavLink>
          <NavLink to="/dashboard/settings" className={({isActive}) => isActive ? "db-link on" : "db-link"}>Settings</NavLink>
        </nav>
        <button className="db-logout" onClick={logout}>Log out</button>
      </aside>

      <main className="db-main">
        <Routes>
          <Route index element={<DashHome />} />
          <Route path="subscription" element={<DashSubscription />} />
          <Route path="orders" element={<DashOrders />} />
          <Route path="credits" element={<DashCredits />} />
          <Route path="settings" element={<DashSettings />} />
        </Routes>
      </main>
    </div>
  )
}
