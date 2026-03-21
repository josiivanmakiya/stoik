import "./howitworks.css"

const STEPS = [
  { n:"01", title:"Choose your colours", body:"Pick how many of each. Set how often you want a fresh pack — monthly, every three months, every six. Adjust anytime." },
  { n:"02", title:"Your size is stored", body:"Enter it once. Applied to every delivery after that. You never fill in a form again." },
  { n:"03", title:"Pack arrives", body:"On schedule. Across Nigeria. One message when it leaves. One when it arrives. That's all you hear until next cycle." },
  { n:"04", title:"Hand back the old ones", body:"Give them to the courier at the door. Credits are in your account within 24 hours. Off your next bill automatically." },
]

export default function HowItWorks() {
  return (
    <section className="hiw-section">
      <div className="tag">How It Works</div>
      <h2 className="title">Four steps.<br />Then nothing.</h2>
      <div className="hiw-grid">
        {STEPS.map(s => (
          <div className="hiw-card" key={s.n}>
            <div className="hiw-n">{s.n}</div>
            <div className="hiw-title">{s.title}</div>
            <div className="hiw-body">{s.body}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
