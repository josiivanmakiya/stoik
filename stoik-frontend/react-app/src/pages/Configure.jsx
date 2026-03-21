import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./configure.css"

const PRICE = 4500
const COLORS = [
  { id: "white", label: "White", bg: "#e0dbd0", text: "#1a1a1a", abbr: "WHT" },
  { id: "grey",  label: "Grey",  bg: "#4d4d4d", text: "#f0ece4", abbr: "GRY" },
  { id: "black", label: "Black", bg: "#141414", text: "#f0ece4", abbr: "BLK" },
]
const SIZES = ["S", "M", "L", "XL", "XXL"]

export default function Configure() {
  const navigate = useNavigate()
  const [qtys, setQtys]   = useState({ white: 0, grey: 0, black: 0 })
  const [size, setSize]   = useState("M")
  const [toast, setToast] = useState(false)
  const revealRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target) }
      }),
      { threshold: .08 }
    )
    revealRefs.current.forEach(el => el && obs.observe(el))
    setTimeout(() => revealRefs.current[0]?.classList.add("in"), 100)
    return () => obs.disconnect()
  }, [])

  const r = (i) => (el) => { revealRefs.current[i] = el }

  const totalPieces = Object.values(qtys).reduce((s, q) => s + q, 0)
  const totalPrice  = totalPieces * PRICE

  function chg(color, delta) {
    setQtys(q => ({ ...q, [color]: Math.max(0, Math.min(12, q[color] + delta)) }))
  }

  function handleCheckout() {
    if (totalPieces === 0) return
    const items = COLORS
      .filter(c => qtys[c.id] > 0)
      .map(c => ({ color: c.id, qty: qtys[c.id], size, price: qtys[c.id] * PRICE }))
    localStorage.setItem("stoik_bag", JSON.stringify(items))
    setToast(true)
    setTimeout(() => { setToast(false); navigate("/checkout") }, 900)
  }

  return (
    <>
      <section className="cfg-section">

        <div className="reveal" ref={r(0)}>
          <div className="tag">Configure</div>
          <h2 className="title">Build your pack.</h2>
          <p className="cfg-sub">Pick how many of each colour. One size for the whole pack.</p>
        </div>

        <div className="cfg-wrap">

          {/* LEFT — colour quantities */}
          <div className="cfg-left">

            <div className="step reveal" ref={r(1)}>
              <div className="step-hd"><span className="sn">01</span>How many of each colour?</div>
              <div className="color-builders">
                {COLORS.map(c => (
                  <div className="cb" key={c.id}>
                    <div className="cb-swatch" style={{
                      background: c.bg,
                      outline: c.id === "black" ? "1px solid rgba(245,242,237,.12)" : "none"
                    }} />
                    <div className="cb-info">
                      <div className="cb-label">{c.label}</div>
                      <div className="cb-price">₦{(qtys[c.id] * PRICE).toLocaleString()}</div>
                    </div>
                    <div className="cb-qty">
                      <button className="q-b" onClick={() => chg(c.id, -1)}>−</button>
                      <div className="q-v">{qtys[c.id]}</div>
                      <button className="q-b" onClick={() => chg(c.id, +1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="step reveal" ref={r(2)}>
              <div className="step-hd"><span className="sn">02</span>Your size</div>
              <div className="sz-row">
                {SIZES.map(s => (
                  <label className="szo" key={s}>
                    <input type="radio" name="size" value={s} checked={size === s} onChange={() => setSize(s)} />
                    <div className={`sz-b ${size === s ? "on" : ""}`}>{s}</div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT — live summary */}
          <div className="cfg-right reveal" ref={r(3)}>
            <div className="cfg-summary">
              <div className="cs-head">Your Pack</div>

              {totalPieces === 0 ? (
                <div className="cs-empty">Add at least one shirt to continue.</div>
              ) : (
                COLORS.filter(c => qtys[c.id] > 0).map(c => (
                  <div className="cs-row" key={c.id}>
                    <div className="cs-dot" style={{ background: c.bg, outline: c.id === "black" ? "1px solid rgba(245,242,237,.15)" : "none" }} />
                    <span>{c.label}</span>
                    <span className="cs-x">×{qtys[c.id]}</span>
                    <span>₦{(qtys[c.id] * PRICE).toLocaleString()}</span>
                  </div>
                ))
              )}

              <div className="cs-divider" />

              <div className="cs-meta">
                <div className="cs-meta-row"><span>Size</span><span>{size}</span></div>
                <div className="cs-meta-row"><span>Total pieces</span><span>{totalPieces}</span></div>
              </div>

              <div className="cs-total-row">
                <span className="cs-tl">Total</span>
                <span className="cs-tp">₦{totalPrice.toLocaleString()}</span>
              </div>

              <button
                className={`ck-btn ${totalPieces === 0 ? "disabled" : ""}`}
                onClick={handleCheckout}
                disabled={totalPieces === 0}
              >
                {totalPieces === 0 ? "Add shirts to continue" : `Go to Checkout →`}
              </button>
            </div>
          </div>

        </div>
      </section>

      <div className={`cfg-toast ${toast ? "show" : ""}`}>Pack saved — taking you to checkout</div>
    </>
  )
}
