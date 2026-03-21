import { useNavigate } from "react-router-dom"
import "./notfound.css"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <section className="nf-section">
      <div className="nf-inner">
        <div className="tag">Lost</div>
        <div className="nf-num">404</div>
        <h2 className="title">This page<br />does not exist.</h2>
        <p className="nf-body">The men who know, know where to go.</p>
        <div className="nf-btns">
          <button className="nf-home" onClick={() => navigate("/")}>Back to Stoik →</button>
          <button className="nf-shop" onClick={() => navigate("/configure")}>Build a pack →</button>
        </div>
      </div>
    </section>
  )
}
