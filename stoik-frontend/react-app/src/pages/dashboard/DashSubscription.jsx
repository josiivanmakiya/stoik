import { useState } from "react"
import "./dashboard.css"

const COLORS = [
  { id:"white", label:"White", bg:"#e0dbd0", text:"#1a1a1a" },
  { id:"grey",  label:"Grey",  bg:"#4d4d4d", text:"#f0ece4" },
  { id:"black", label:"Black", bg:"#141414", text:"#f0ece4" },
]
const SIZES = ["S","M","L","XL","XXL"]

export default function DashSubscription() {
  const [qtys, setQtys] = useState({ white:2, grey:0, black:1 })
  const [size, setSize] = useState("L")
  const [cadence, setCadence] = useState(3)

  function chg(c, d) { setQtys(q => ({...q, [c]: Math.max(0, q[c]+d)})) }

  return (
    <div>
      <div className="db-page-title">Subscription</div>
      <div className="db-page-sub">Edit your pack anytime. Changes apply from next cycle.</div>

      <div className="db-card">
        <div className="db-card-title">Colours</div>
        {COLORS.map(c => (
          <div className="db-row" key={c.id}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",flex:1}}>
              <div style={{width:"28px",height:"28px",background:c.bg,outline:c.id==="black"?"1px solid rgba(245,242,237,.12)":"none",flexShrink:0}} />
              <span className="db-row-v">{c.label}</span>
            </div>
            <div style={{display:"flex",alignItems:"center"}}>
              <button className="db-btn" style={{width:"36px",height:"36px",padding:0,fontSize:"16px"}} onClick={() => chg(c.id,-1)}>−</button>
              <span style={{width:"40px",textAlign:"center",fontFamily:"var(--font-display)",fontSize:"24px",color:"#ffffff"}}>{qtys[c.id]}</span>
              <button className="db-btn" style={{width:"36px",height:"36px",padding:0,fontSize:"16px"}} onClick={() => chg(c.id,+1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="db-card">
        <div className="db-card-title">Size</div>
        <div style={{display:"flex",gap:"8px"}}>
          {SIZES.map(s => (
            <button key={s} className={`db-btn ${size===s?"primary":""}`} style={{width:"46px",height:"46px",padding:0}} onClick={() => setSize(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="db-card">
        <div className="db-card-title">Delivery Cadence</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
          {[1,2,3,4,5,6].map(n => (
            <button key={n} className={`db-btn ${cadence===n?"primary":""}`} onClick={() => setCadence(n)}>
              Every {n} {n===1?"month":"months"}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:"12px",marginTop:"8px"}}>
        <button className="db-btn primary">Save changes</button>
        <button className="db-btn" style={{color:"#c87878",borderColor:"rgba(200,120,120,.25)"}}>Pause subscription</button>
        <button className="db-btn" style={{color:"rgba(244,241,236,0.3)"}}>Cancel</button>
      </div>
    </div>
  )
}
