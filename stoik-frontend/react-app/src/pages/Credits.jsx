import "./credits.css"

const STEPS = [
  { n:"01", title:"Hand them to the courier", desc:"At the door. Same visit as your delivery." },
  { n:"02", title:"Credited in 24 hours", desc:"Verified and added to your account. You see the exact amount." },
  { n:"03", title:"Next bill is lower", desc:"Applied automatically. Nothing to do on your end." },
]

export default function Credits() {
  return (
    <section className="cr-section">
      <div className="tag">Stoik Credits</div>
      <h2 className="title">Old accessories<br />pay for<br />new ones.</h2>

      <div className="cr-wrap">
        <div className="ledger">
          <div className="led-title">One cycle — example</div>
          <div className="led-row"><div className="led-d">4 White Shirts returned</div><div className="led-a p">+₦2,000</div></div>
          <div className="led-row"><div className="led-d">2 Grey Shirts returned</div><div className="led-a p">+₦1,000</div></div>
          <div className="led-row"><div className="led-d">1 Black Shirt returned</div><div className="led-a p">+₦500</div></div>
          <div className="led-row"><div className="led-d" style={{color:"var(--grey)"}}>Applied to next cycle</div><div className="led-a n">−₦3,500</div></div>
          <div className="led-net"><div className="led-nl">Saved</div><div className="led-nv">₦3,500</div></div>

          <div className="cash-note">
            <div className="cash-note-inner">
              <div className="cash-icon">🏦</div>
              <div className="cash-text">
                <strong>Prefer cash?</strong>
                <span>Verified members can withdraw credits directly to any Nigerian bank account. Takes 1–2 business days.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cr-text">
          <h3 className="title" style={{marginBottom:"16px"}}>Every piece<br />has a second<br />life.</h3>
          <p className="cr-body">Return worn Stoik shirts when your new pack arrives. The credit goes straight to your account. No codes. No forms. Off your next bill before you think about it.</p>

          <div className="cr-redeem">
            <div className="cr-redeem-row">
              <div className="cr-redeem-opt active">
                <div className="cr-redeem-title">Apply to order</div>
                <div className="cr-redeem-desc">Instant. Comes off your next bill automatically.</div>
              </div>
              <div className="cr-redeem-opt">
                <div className="cr-redeem-title">Cash to bank <span className="verified-tag">Verified</span></div>
                <div className="cr-redeem-desc">Withdraw to your bank account. Available to NIN or BVN verified members.</div>
              </div>
            </div>
          </div>

          <div className="cr-steps">
            {STEPS.map(s => (
              <div className="cr-st" key={s.n}>
                <div className="cr-sn">{s.n}</div>
                <div>
                  <div className="cr-st-t">{s.title}</div>
                  <div className="cr-st-d">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
