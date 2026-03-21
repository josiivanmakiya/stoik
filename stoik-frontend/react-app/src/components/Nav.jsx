import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./nav.css"

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <Link to="/" className="logo">Stoik</Link>
        <ul className="nav-links">
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/configure">Configure</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/credits">Credits</Link></li>
        </ul>
        <div className="nav-r">
          <button className="btn-sm" onClick={() => navigate("/auth")}>Login</button>
          <button className="btn-bag" onClick={() => navigate("/bag")}>Bag 0</button>
          <button className="mob-tog" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        </div>
      </nav>
      {open && (
        <div className="mob-menu">
          <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/configure" onClick={() => setOpen(false)}>Configure</Link>
          <Link to="/how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
          <Link to="/credits" onClick={() => setOpen(false)}>Credits</Link>
          <Link to="/auth" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </>
  )
}
