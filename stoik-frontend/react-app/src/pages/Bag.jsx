import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./bag.css"

const PRICE = 4500
const COLORS = {
  white: { bg: "#e0dbd0", text: "#1a1a1a" },
  grey:  { bg: "#4d4d4d", text: "#f0ece4" },
  black: { bg: "#141414", text: "#f0ece4" },
}
const SIZES = ["S", "M", "L", "XL", "XXL"]

export default function Bag() {
  const navigate  = useNavigate()
  const [bag, setBag] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("stoik_bag")
    if (saved) setBag(JSON.parse(saved))
  }, [])

  function save(updated) {
    setBag(updated)
    localStorage.setItem("stoik_bag", JSON.stringify(updated))
  }

  function changeQty(index, delta) {
    const updated = bag.map((item, i) => {
      if (i !== index) return item
      const newQty = Math.max(1, item.qty + delta)
      return { ...item, qty: newQty, price: newQty * PRICE }
    })
    save(updated)
  }

  function changeSize(index, size) {
    const updated = bag.map((item, i) => i === index ? { ...item, size } : item)
    save(updated)
  }

  function changeColor(index, color) {
    const updated = bag.map((item, i) => i === index ? { ...item, color } : item)
    save(updated)
  }

  function remove(index) {
    save(bag.filter((_, i) => i !== index))
  }

  function clear() {
    setBag([])
    localStorage.removeItem("stoik_bag")
  }

  const total       = bag.reduce((s, i) => s + i.price, 0)
  const totalPieces = bag.reduce((s, i) => s + i.qty,   0)

  return (
    <section className="bag-section">
      <div className="tag">Your Bag</div>
      <h2 className="title">{bag.length === 0 ? "Nothing here yet." : "Your pack."}</h2>

      {bag.length === 0 ? (
        <div className="bag-empty">
          <p>You haven't configured a pack yet.</p>
          <button className="bag-cta" onClick={() => navigate("/configure")}>Build your pack →</button>
        </div>
      ) : (
        <div className="bag-wrap">

          {/* ITEMS */}
          <div className="bag-items">
            {bag.map((item, i) => (
              <div className="bi" key={i}>

                {/* Swatch + colour picker */}
                <div className="bi-left">
                  <div className="bi-swatch" style={{ background: COLORS[item.color]?.bg, outline: item.color === "black" ? "1px solid rgba(245,242,237,.15)" : "none" }}>
                    <span style={{ color: COLORS[item.color]?.text }}>{item.color.slice(0,3).toUpperCase()}</span>
                  </div>
                  <div className="bi-colors">
                    {Object.keys(COLORS).map(c => (
                      <button
                        key={c}
                        className={`bi-col ${item.color === c ? "on" : ""}`}
                        style={{ background: COLORS[c].bg, outline: c === "black" ? "1px solid rgba(245,242,237,.12)" : "none" }}
                        onClick={() => changeColor(i, c)}
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="bi-detail">
                  <div className="bi-name">{item.color.charAt(0).toUpperCase() + item.color.slice(1)} Crew Neck</div>

                  {/* Size selector */}
                  <div className="bi-sizes">
                    {SIZES.map(s => (
                      <button key={s} className={`bi-sz ${item.size === s ? "on" : ""}`} onClick={() => changeSize(i, s)}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* Qty + price */}
                <div className="bi-right">
                  <div className="bi-qty">
                    <button className="q-b" onClick={() => changeQty(i, -1)}>−</button>
                    <div className="q-v">{item.qty}</div>
                    <button className="q-b" onClick={() => changeQty(i, +1)}>+</button>
                  </div>
                  <div className="bi-price">₦{item.price.toLocaleString()}</div>
                  <button className="bi-remove" onClick={() => remove(i)}>✕</button>
                </div>

              </div>
            ))}

            <div className="bag-actions">
              <button className="bag-clear" onClick={clear}>Clear bag</button>
              <button className="bag-add" onClick={() => navigate("/configure")}>+ Add more</button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bag-summary">
            <div className="bs-title">Summary</div>
            <div className="bs-row"><span>Pieces</span><span>{totalPieces}</span></div>
            <div className="bs-row"><span>Price per piece</span><span>₦{PRICE.toLocaleString()}</span></div>
            <div className="bs-total"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
            <button className="bs-checkout" onClick={() => navigate("/checkout")}>Checkout →</button>
            <p className="bs-note">Delivery schedule and billing set at checkout.</p>
          </div>

        </div>
      )}
    </section>
  )
}
