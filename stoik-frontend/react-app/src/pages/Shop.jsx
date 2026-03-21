import { useNavigate } from "react-router-dom"
import "./shop.css"

const SHIRTS = [
  { id: "white", label: "White", bg: "#e0dbd0", text: "#1a1a1a", desc: "The everyday layer. Works under anything." },
  { id: "grey",  label: "Grey",  bg: "#4d4d4d", text: "#f0ece4", desc: "The utility piece. Stands on its own." },
  { id: "black", label: "Black", bg: "#141414", text: "#f0ece4", desc: "The essential. Clean every time." },
]

export default function Shop() {
  const navigate = useNavigate()
  return (
    <section className="shop-section">
      <div className="shop-head">
        <div>
          <div className="tag">The Collection</div>
          <h2 className="title">Three colours.<br />That's all.</h2>
        </div>
        <div className="shop-note">One price.<br />One quality.<br />Three colours.</div>
      </div>
      <div className="shop-grid">
        {SHIRTS.map(s => (
          <div className="pc" key={s.id}>
            <div className="pc-bg" style={{ background: s.bg }}>
              <div className="pc-n" style={{ color: s.text }}>{s.label.toUpperCase()}</div>
              <div className="pc-t" style={{ color: s.text }}>Crew Neck</div>
            </div>
            <div className="pc-ov">
              <div className="pc-pr">₦4,500</div>
              <div className="pc-sz">S · M · L · XL · XXL</div>
              <div className="pc-desc">{s.desc}</div>
              <button className="pc-btn" onClick={() => navigate("/configure")}>Configure & Buy</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
