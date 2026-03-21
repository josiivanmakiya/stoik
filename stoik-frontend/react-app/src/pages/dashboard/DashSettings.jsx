import { useState } from "react"
import "./dashboard.css"

export default function DashSettings() {
  const [form, setForm] = useState({ fullName:"", email:"", phone:"", address:"", city:"", state:"Lagos" })
  const upd = (k,v) => setForm(f => ({...f,[k]:v}))

  return (
    <div>
      <div className="db-page-title">Settings</div>
      <div className="db-page-sub">Your details. Updated anytime.</div>

      <div className="db-card">
        <div className="db-card-title">Personal Info</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            <label style={{fontFamily:"var(--font-mono)",fontSize:"9px",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(244,241,236,0.45)",fontWeight:"700"}}>Full Name</label>
            <input style={{background:"var(--mid)",border:"1px solid var(--border)",padding:"11px 14px",fontFamily:"var(--font-body)",fontSize:"12px",color:"var(--white)",outline:"none",width:"100%"}} value={form.fullName} onChange={e=>upd("fullName",e.target.value)} placeholder="Your name" />
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            <label style={{fontFamily:"var(--font-mono)",fontSize:"9px",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(244,241,236,0.45)",fontWeight:"700"}}>Email</label>
            <input style={{background:"var(--mid)",border:"1px solid var(--border)",padding:"11px 14px",fontFamily:"var(--font-body)",fontSize:"12px",color:"var(--white)",outline:"none",width:"100%"}} value={form.email} onChange={e=>upd("email",e.target.value)} placeholder="you@example.com" />
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            <label style={{fontFamily:"var(--font-mono)",fontSize:"9px",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(244,241,236,0.45)",fontWeight:"700"}}>Phone</label>
            <input style={{background:"var(--mid)",border:"1px solid var(--border)",padding:"11px 14px",fontFamily:"var(--font-body)",fontSize:"12px",color:"var(--white)",outline:"none",width:"100%"}} value={form.phone} onChange={e=>upd("phone",e.target.value)} placeholder="080XXXXXXXX" />
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            <label style={{fontFamily:"var(--font-mono)",fontSize:"9px",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(244,241,236,0.45)",fontWeight:"700"}}>City</label>
            <input style={{background:"var(--mid)",border:"1px solid var(--border)",padding:"11px 14px",fontFamily:"var(--font-body)",fontSize:"12px",color:"var(--white)",outline:"none",width:"100%"}} value={form.city} onChange={e=>upd("city",e.target.value)} placeholder="City" />
          </div>
        </div>
        <button className="db-btn primary" style={{marginTop:"16px"}}>Save changes</button>
      </div>

      <div className="db-card">
        <div className="db-card-title">Identity Verification</div>
        <div className="db-row"><span className="db-row-k">Status</span><span className="db-row-v" style={{color:"#c87878"}}>Not verified</span></div>
        <div className="db-row"><span className="db-row-k">Required for</span><span className="db-row-v">Cash credit withdrawals</span></div>
        <button className="db-btn primary" style={{marginTop:"16px"}}>Verify with NIN or BVN</button>
      </div>

      <div className="db-card">
        <div className="db-card-title">Password</div>
        <button className="db-btn">Change password</button>
      </div>

      <div className="db-card" style={{borderColor:"rgba(200,120,120,.15)"}}>
        <div className="db-card-title" style={{color:"#c87878"}}>Danger Zone</div>
        <button className="db-btn" style={{color:"#c87878",borderColor:"rgba(200,120,120,.25)"}}>Delete account</button>
      </div>
    </div>
  )
}
