import "./dashboard.css"

export default function DashHome() {
  return (
    <div>
      <div className="db-page-title">Overview</div>
      <div className="db-page-sub">Everything in one place.</div>

      <div className="db-grid">
        <div className="db-stat">
          <div className="db-stat-v">3</div>
          <div className="db-stat-l">Active shirts</div>
        </div>
        <div className="db-stat">
          <div className="db-stat-v">₦1,500</div>
          <div className="db-stat-l">Credits balance</div>
        </div>
        <div className="db-stat">
          <div className="db-stat-v">14</div>
          <div className="db-stat-l">Days to next delivery</div>
        </div>
      </div>

      <div className="db-card">
        <div className="db-card-title">Active Subscription</div>
        <div className="db-row"><span className="db-row-k">Colours</span><span className="db-row-v">2× White · 1× Black</span></div>
        <div className="db-row"><span className="db-row-k">Size</span><span className="db-row-v">L</span></div>
        <div className="db-row"><span className="db-row-k">Cadence</span><span className="db-row-v">Every 3 months</span></div>
        <div className="db-row"><span className="db-row-k">Next delivery</span><span className="db-row-v">27 March 2026</span></div>
        <div className="db-row"><span className="db-row-k">Status</span><span className="db-row-v" style={{color:"var(--green)"}}>Active</span></div>
      </div>

      <div className="db-card">
        <div className="db-card-title">Credits</div>
        <div className="db-row"><span className="db-row-k">Balance</span><span className="db-row-v" style={{color:"var(--accent)"}}>₦1,500</span></div>
        <div className="db-row"><span className="db-row-k">Last earned</span><span className="db-row-v">₦500 · 2 shirts returned</span></div>
        <div className="db-row"><span className="db-row-k">Cash out</span><span className="db-row-v">Verify identity to unlock</span></div>
        <div style={{marginTop:"16px",display:"flex",gap:"10px"}}>
          <button className="db-btn primary">Apply to next order</button>
          <button className="db-btn">View ledger</button>
        </div>
      </div>
    </div>
  )
}
