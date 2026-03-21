import "./dashboard.css"

const ORDERS = [
  { id:"ORD-001", date:"12 Dec 2025", items:"2× White · 1× Black", size:"L", status:"Delivered", returned:"2 shirts", credits:"₦500" },
  { id:"ORD-002", date:"12 Sep 2025", items:"2× White · 1× Black", size:"L", status:"Delivered", returned:"2 shirts", credits:"₦500" },
  { id:"ORD-003", date:"12 Jun 2025", items:"2× White · 1× Black", size:"L", status:"Delivered", returned:"—", credits:"—" },
]

export default function DashOrders() {
  return (
    <div>
      <div className="db-page-title">Orders</div>
      <div className="db-page-sub">Every delivery. Every return. Every credit earned.</div>
      {ORDERS.map(o => (
        <div className="db-card" key={o.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
            <div className="db-card-title" style={{margin:0}}>{o.id}</div>
            <span style={{fontFamily:"var(--font-mono)",fontSize:"9px",letterSpacing:".14em",color:"var(--green)",fontWeight:"700"}}>{o.status}</span>
          </div>
          <div className="db-row"><span className="db-row-k">Date</span><span className="db-row-v">{o.date}</span></div>
          <div className="db-row"><span className="db-row-k">Items</span><span className="db-row-v">{o.items}</span></div>
          <div className="db-row"><span className="db-row-k">Size</span><span className="db-row-v">{o.size}</span></div>
          <div className="db-row"><span className="db-row-k">Returned</span><span className="db-row-v">{o.returned}</span></div>
          <div className="db-row"><span className="db-row-k">Credits earned</span><span className="db-row-v" style={{color:"var(--accent)"}}>{o.credits}</span></div>
        </div>
      ))}
    </div>
  )
}
