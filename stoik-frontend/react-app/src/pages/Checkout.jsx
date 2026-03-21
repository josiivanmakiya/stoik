import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./checkout.css"

const INTERVALS = [
  { value: 1, label: "Every month" },
  { value: 2, label: "Every 2 months" },
  { value: 3, label: "Every 3 months", recommended: true },
  { value: 4, label: "Every 4 months", discount: 5 },
  { value: 5, label: "Every 5 months", discount: 7 },
  { value: 6, label: "Every 6 months", discount: 10 },
]

const STATES = ["Lagos","Abuja","Rivers","Kano","Oyo","Kaduna","Enugu","Delta","Anambra","Ogun","Ondo","Osun","Kwara","Benue","Plateau","Cross River","Akwa Ibom","Imo","Abia","Edo","Ekiti","Kogi","Nasarawa","Niger","Sokoto","Zamfara","Kebbi","Jigawa","Bauchi","Gombe","Adamawa","Taraba","Borno","Yobe","Ebonyi","Bayelsa","FCT"]

export default function Checkout() {
  const navigate = useNavigate()
  const [bag, setBag] = useState([])
  const [interval, setInterval] = useState(3)
  const [autoRenew, setAutoRenew] = useState(true)
  const [applyCredit, setApplyCredit] = useState(false)
  const [creditBalance] = useState(0)
  const [payMethod, setPayMethod] = useState("card")
  const [form, setForm] = useState({ fullName:"", email:"", phone:"", address:"", city:"", state:"Lagos" })
  const revealRefs = useRef([])

  useEffect(() => {
    const saved = localStorage.getItem("stoik_bag")
    if (saved) setBag(JSON.parse(saved))
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target) } }),
      { threshold: .08 }
    )
    revealRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const r = (i) => (el) => { revealRefs.current[i] = el }

  const activeInterval = INTERVALS.find(i => i.value === interval)
  const subtotal = bag.reduce((sum, item) => sum + item.price, 0)
  const discountPct = activeInterval?.discount || 0
  const discountAmt = Math.round(subtotal * discountPct / 100)
  const creditAmt = applyCredit ? Math.min(creditBalance, subtotal - discountAmt) : 0
  const total = Math.max(0, subtotal - discountAmt - creditAmt)

  function upd(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit() {
    if (!form.fullName || !form.email || !form.address || !form.city) {
      alert("Please fill in all required fields.")
      return
    }
    const payload = {
      items: bag.map(item => ({ planId: item.color + "-1", quantity: item.qty, cadenceMonths: interval })),
      cadenceMonths: interval,
      paymentMethod: payMethod === "card" ? "card" : "standard",
      customer: { email: form.email, fullName: form.fullName, phone: form.phone },
      shipping: { address: form.address, city: form.city, state: form.state, country: "NG" },
      applyCredit,
      creditToApply: creditAmt,
      billingPreferences: { automaticRenewal: autoRenew, autoApplyCredits: applyCredit }
    }
    console.log("Checkout payload:", payload)
    alert("Checkout ready — connect Paystack to complete.")
  }

  return (
    <section className="ck-section">
      <div className="reveal" ref={r(0)}>
        <div className="tag">Checkout</div>
        <h2 className="title">Almost done.</h2>
      </div>

      <div className="ck-wrap">
        {/* LEFT */}
        <div className="ck-left">

          {/* Interval */}
          <div className="ck-block reveal" ref={r(1)}>
            <div className="ck-hd">How often do you want a fresh pack?</div>
            <div className="interval-grid">
              {INTERVALS.map(iv => (
                <button
                  key={iv.value}
                  className={`iv-btn ${interval === iv.value ? "on" : ""}`}
                  onClick={() => setInterval(iv.value)}
                >
                  <span className="iv-label">{iv.label}</span>
                  {iv.recommended && <span className="iv-badge">Recommended</span>}
                  {iv.discount && <span className="iv-badge disc">{iv.discount}% off</span>}
                </button>
              ))}
            </div>
            <p className="iv-note">
              {autoRenew ? "Charged automatically on your chosen schedule." : "We'll remind you 24 hours before each cycle."}
            </p>
          </div>

          {/* Billing model */}
          <div className="ck-block reveal" ref={r(2)}>
            <div className="ck-hd">Billing preference</div>
            <div className="model-row">
              <button className={`model-btn ${autoRenew ? "on" : ""}`} onClick={() => setAutoRenew(true)}>
                <div className="model-n">Auto billing</div>
                <div className="model-d">Charged automatically. Nothing to do.</div>
              </button>
              <button className={`model-btn ${!autoRenew ? "on" : ""}`} onClick={() => setAutoRenew(false)}>
                <div className="model-n">Manual approval</div>
                <div className="model-d">We remind you 24 hours before. You approve.</div>
              </button>
            </div>
          </div>

          {/* Payment method */}
          <div className="ck-block reveal" ref={r(3)}>
            <div className="ck-hd">Payment method</div>
            <div className="pay-row">
              {[
                { id:"card",  label:"Debit / Credit Card" },
                { id:"bank",  label:"Bank Transfer" },
                { id:"ussd",  label:"USSD" },
              ].map(p => (
                <button key={p.id} className={`pay-btn ${payMethod === p.id ? "on" : ""}`} onClick={() => setPayMethod(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="ck-block reveal" ref={r(4)}>
            <div className="ck-hd">Contact & delivery</div>
            <div className="form-grid">
              <div className="f-field full"><label className="f-lbl">Full Name</label><input className="f-in" placeholder="Your full name" value={form.fullName} onChange={e => upd("fullName", e.target.value)} /></div>
              <div className="f-field"><label className="f-lbl">Email</label><input className="f-in" type="email" placeholder="you@example.com" value={form.email} onChange={e => upd("email", e.target.value)} /></div>
              <div className="f-field"><label className="f-lbl">Phone</label><input className="f-in" placeholder="080XXXXXXXX" value={form.phone} onChange={e => upd("phone", e.target.value)} /></div>
              <div className="f-field full"><label className="f-lbl">Delivery Address</label><input className="f-in" placeholder="Street address" value={form.address} onChange={e => upd("address", e.target.value)} /></div>
              <div className="f-field"><label className="f-lbl">City</label><input className="f-in" placeholder="City" value={form.city} onChange={e => upd("city", e.target.value)} /></div>
              <div className="f-field">
                <label className="f-lbl">State</label>
                <select className="f-in" value={form.state} onChange={e => upd("state", e.target.value)}>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT — Summary */}
        <div className="ck-right reveal" ref={r(5)}>
          <div className="ck-summary">
            <div className="cs-title">Order Summary</div>

            {bag.length === 0 ? (
              <div className="cs-empty">Your bag is empty. <button onClick={() => navigate("/configure")}>Configure a pack →</button></div>
            ) : (
              bag.map((item, i) => (
                <div className="cs-item" key={i}>
                  <div className="cs-swatch" style={{ background: item.color === "white" ? "#e0dbd0" : item.color === "grey" ? "#4d4d4d" : "#141414" }} />
                  <div className="cs-detail">
                    <div className="cs-name">{item.color.charAt(0).toUpperCase() + item.color.slice(1)} · Size {item.size}</div>
                    <div className="cs-qty">Qty {item.qty}</div>
                  </div>
                  <div className="cs-price">₦{item.price.toLocaleString()}</div>
                </div>
              ))
            )}

            <div className="cs-rows">
              <div className="cs-row"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              {discountAmt > 0 && <div className="cs-row disc"><span>Cycle discount ({discountPct}%)</span><span>−₦{discountAmt.toLocaleString()}</span></div>}
              {creditAmt > 0 && <div className="cs-row disc"><span>Credits applied</span><span>−₦{creditAmt.toLocaleString()}</span></div>}
              <div className="cs-total"><span>Total today</span><span>₦{total.toLocaleString()}</span></div>
            </div>

            {creditBalance > 0 && (
              <div className="cs-credit">
                <div className="cs-credit-top">
                  <span>Stoik Credits — ₦{creditBalance.toLocaleString()} available</span>
                  <button className="cs-credit-toggle" onClick={() => setApplyCredit(a => !a)}>
                    {applyCredit ? "Remove" : "Apply"}
                  </button>
                </div>
              </div>
            )}

            <button className="ck-submit" onClick={handleSubmit}>
              {payMethod === "card" ? "Pay ₦" + total.toLocaleString() + " →" : "Confirm Order →"}
            </button>

            <p className="ck-note">
              {autoRenew ? "Auto-billing active. Cancel anytime from your account." : "Manual approval on. We remind you before each cycle."}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
