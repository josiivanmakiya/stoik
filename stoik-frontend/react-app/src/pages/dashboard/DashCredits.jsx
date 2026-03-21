import { useState } from "react"
import "./dashboard.css"

const LEDGER = [
  { date:"12 Dec 2025", desc:"2 shirts returned", amount:"+₦500",  type:"credit" },
  { date:"12 Dec 2025", desc:"Applied to order",  amount:"−₦500",  type:"debit"  },
  { date:"12 Sep 2025", desc:"2 shirts returned", amount:"+₦500",  type:"credit" },
  { date:"12 Sep 2025", desc:"Applied to order",  amount:"−₦500",  type:"debit"  },
  { date:"12 Jun 2025", desc:"2 shirts returned", amount:"+₦1,500",type:"credit" },
]

const BANKS = [
  "Access Bank","Zenith Bank","GTBank","First Bank","UBA",
  "Stanbic IBTC","Fidelity Bank","Sterling Bank","Wema Bank",
  "Kuda Bank","Opay","Palmpay"
]

const BALANCE = 1500

export default function DashCredits() {
  const [mode, setMode]           = useState(null) // null | "order" | "bank"
  const [applied, setApplied]     = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // bank form
  const [bank, setBank]       = useState("")
  const [acctNum, setAcctNum] = useState("")
  const [acctName, setAcctName] = useState("Adewale Ogunleye") // pre-filled from settings
  const [amount, setAmount]   = useState("")

  function handleApplyOrder() {
    setApplied(true)
    setMode("order")
  }

  function handleWithdraw() {
    if (!bank || !acctNum || !amount) {
      alert("Please fill all fields.")
      return
    }
    setSubmitted(true)
  }

  return (
    <div>
      <div className="db-page-title">Credits</div>
      <div className="db-page-sub">Every shirt returned. Every naira earned.</div>

      <div className="db-grid" style={{gridTemplateColumns:"1fr 1fr",marginBottom:"32px"}}>
        <div className="db-stat">
          <div className="db-stat-v" style={{color:"var(--accent)"}}>₦{BALANCE.toLocaleString()}</div>
          <div className="db-stat-l">Available balance</div>
        </div>
        <div className="db-stat">
          <div className="db-stat-v">₦3,000</div>
          <div className="db-stat-l">Total earned all time</div>
        </div>
      </div>

      {/* REDEEM CARD */}
      <div className="db-card" style={{marginBottom:"24px"}}>
        <div className="db-card-title">Redeem credits</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom: mode ? "20px" : "0"}}>
          <button
            className={`db-btn ${mode === "order" ? "primary" : ""}`}
            onClick={handleApplyOrder}
          >
            Apply to next order
          </button>
          <button
            className={`db-btn ${mode === "bank" ? "primary" : ""}`}
            style={{borderColor:"rgba(201,169,110,.4)", color: mode === "bank" ? "var(--black)" : "var(--accent)"}}
            onClick={() => { setMode("bank"); setSubmitted(false) }}
          >
            Cash to bank account
          </button>
        </div>

        {/* Apply to order — confirmation */}
        {mode === "order" && (
          <div style={{borderTop:"1px solid var(--border)",paddingTop:"20px"}}>
            {!applied ? null : (
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <div style={{fontFamily:"var(--font-display)",fontSize:"28px",color:"var(--green)"}}>Done.</div>
                <p style={{fontSize:"12px",color:"rgba(244,241,236,0.6)",fontWeight:"500"}}>
                  ₦{BALANCE.toLocaleString()} will be applied automatically to your next order. You'll see it in the order summary at checkout.
                </p>
                <button className="db-btn" style={{width:"fit-content"}} onClick={() => setMode(null)}>Close</button>
              </div>
            )}
          </div>
        )}

        {/* Cash to bank */}
        {mode === "bank" && !submitted && (
          <div style={{borderTop:"1px solid var(--border)",paddingTop:"20px",display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"9px",letterSpacing:".2em",textTransform:"uppercase",color:"var(--accent)",fontWeight:"700"}}>
              Withdraw to bank account
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              <label className="cr-label">Bank</label>
              <select className="cr-input" value={bank} onChange={e => setBank(e.target.value)}>
                <option value="">Select bank</option>
                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              <label className="cr-label">Account Number</label>
              <input className="cr-input" placeholder="0123456789" maxLength={10} value={acctNum} onChange={e => setAcctNum(e.target.value)} />
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              <label className="cr-label">Account Name</label>
              <input className="cr-input" value={acctName} onChange={e => setAcctName(e.target.value)} style={{color:"rgba(244,241,236,0.5)"}} />
              <span style={{fontSize:"9px",color:"rgba(244,241,236,0.3)",letterSpacing:".04em",fontWeight:"500"}}>Pre-filled from your profile. Edit in Settings if wrong.</span>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              <label className="cr-label">Amount to withdraw (₦)</label>
              <input className="cr-input" placeholder={`Max ₦${BALANCE.toLocaleString()}`} value={amount} onChange={e => setAmount(e.target.value)} />
            </div>

            <div style={{display:"flex",gap:"10px",marginTop:"4px"}}>
              <button className="db-btn primary" onClick={handleWithdraw}>Confirm withdrawal</button>
              <button className="db-btn" onClick={() => setMode(null)}>Cancel</button>
            </div>

            <p style={{fontSize:"10px",color:"rgba(244,241,236,0.3)",letterSpacing:".03em",lineHeight:"1.75",fontWeight:"500"}}>
              Withdrawals take 1–2 business days. Verified Members only.
            </p>
          </div>
        )}

        {mode === "bank" && submitted && (
          <div style={{borderTop:"1px solid var(--border)",paddingTop:"20px",display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:"28px",color:"var(--green)"}}>Request sent.</div>
            <p style={{fontSize:"12px",color:"rgba(244,241,236,0.6)",fontWeight:"500"}}>
              ₦{amount} will arrive in your {bank} account ({acctNum}) within 1–2 business days.
            </p>
            <button className="db-btn" style={{width:"fit-content"}} onClick={() => { setMode(null); setSubmitted(false) }}>Done</button>
          </div>
        )}
      </div>

      {/* LEDGER */}
      <div className="db-card">
        <div className="db-card-title">Full Ledger</div>
        {LEDGER.map((l,i) => (
          <div className="db-row" key={i}>
            <span className="db-row-k">{l.date}</span>
            <span className="db-row-v" style={{flex:1,paddingLeft:"16px"}}>{l.desc}</span>
            <span style={{fontFamily:"var(--font-display)",fontSize:"22px",color:l.type==="credit"?"var(--green)":"#c87878"}}>{l.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
