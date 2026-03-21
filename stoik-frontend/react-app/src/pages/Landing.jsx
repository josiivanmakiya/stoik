import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./landing.css"

export default function Landing() {
  const navigate = useNavigate()
  const revealRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target) } }),
      { threshold: .08 }
    )
    revealRefs.current.forEach(el => el && obs.observe(el))
    setTimeout(() => revealRefs.current[0]?.classList.add("in"), 100)
    return () => obs.disconnect()
  }, [])

  const r = (i) => (el) => { revealRefs.current[i] = el }

  return (
    <>
      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-l" ref={r(0)}>
          <div className="hero-tag">Est. Lagos · Inner Wear</div>
          <h1 className="hero-h">
            The drawer<br />
            <em>has always</em><br />
            been handled.
          </h1>
          <p className="hero-p">
            <strong>White. Grey. Black.</strong> Delivered on your schedule.
            Returned for credit. The men who know, know.
          </p>
          <div className="hero-btns">
            <button className="btn-main" onClick={() => navigate("/configure")}>Get Your Pack</button>
            <button className="btn-line" onClick={() => navigate("/shop")}>The collection</button>
          </div>
          <div className="hero-nums">
            <div className="h-n"><div className="h-nv">3</div><div className="h-nl">Colours</div></div>
            <div className="h-n"><div className="h-nv">₦4,500</div><div className="h-nl">Per piece</div></div>
            <div className="h-n"><div className="h-nv">0</div><div className="h-nl">Decisions after setup</div></div>
          </div>
        </div>
        <div className="hero-r">
          <div className="stack">
            <div className="sw sw-b"><div className="sw-l">BLK</div><div className="sw-s">Crew Neck</div></div>
            <div className="sw sw-g"><div className="sw-l">GRY</div><div className="sw-s">Crew Neck</div></div>
            <div className="sw sw-w"><div className="sw-l">WHT</div><div className="sw-s">Crew Neck</div></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="t-tr">
          {[1,2].map(i => (
            <div className="t-i" key={i}>
              White<span className="t-d"></span>Grey<span className="t-d"></span>Black<span className="t-d"></span>
              Since Day One<span className="t-d"></span>Nigeria-Wide<span className="t-d"></span>
              Returned for Credit<span className="t-d"></span>Your Schedule<span className="t-d"></span>S to XXL<span className="t-d"></span>
            </div>
          ))}
        </div>
      </div>

      {/* WHY */}
      <section className="why" ref={r(1)}>
        <div className="reveal" ref={r(2)}>
          <div className="tag">Members say</div>
          <blockquote className="why-quote">
            "I didn't realise how much mental space this was taking up. <span>Now it's just handled."</span>
          </blockquote>
          <div className="why-attr">Ugochukwu · Member 001</div>
        </div>
        <div className="reveal" ref={r(3)}>
          <p className="why-body">
            Some things in life deserve thought. Your inner wear is not one of them.
            <strong> The men who have figured this out all arrived at the same place.</strong>
            Three colours. One system. Nothing to decide.
          </p>
          <div className="why-list">
            <div className="wl-item"><div className="wl-icon">⏱</div><div className="wl-text"><strong>The drawer costs more than you think.</strong> Small decisions at the start of the day drain the same energy you need for bigger ones.</div></div>
            <div className="wl-item"><div className="wl-icon">🔄</div><div className="wl-text"><strong>Most men replace things badly.</strong> Wrong size. Poor quality. Last minute. A system ends that.</div></div>
            <div className="wl-item"><div className="wl-icon">💧</div><div className="wl-text"><strong>The white inner wear trick.</strong> Wear it under your main shirt. Layer your fragrance on it. It holds longer. Nobody can place it.</div></div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="outcome" ref={r(4)}>
        <div className="reveal" ref={r(5)}>
          <div className="tag">The difference</div>
          <h2 className="title">You'll notice it<br />within a week.</h2>
        </div>
        <div className="ba reveal" ref={r(6)}>
          <div className="ba-col bf">
            <div className="ba-lbl">Before</div>
            {["Standing at the drawer. Same decision. Every morning.","Buying replacements last minute. Always the wrong thing.","Shirts that wear out faster than they should.","Fragrance gone by noon.","Spending more, getting less."].map((t,i) => (
              <div className="ba-item" key={i}><div className="ba-ic">—</div><div className="ba-tx">{t}</div></div>
            ))}
          </div>
          <div className="ba-col af">
            <div className="ba-lbl">After</div>
            {["Open the drawer. Take a shirt. Go.","Fresh pack arrives. You never run out.","Same quality. Every cycle. No surprises.","Fragrance on the inner wear. Controlled. Lasts all day.","Old shirts returned. Credit on your next bill."].map((t,i) => (
              <div className="ba-item" key={i}><div className="ba-ic">✓</div><div className="ba-tx">{t}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN */}
      <div className="join reveal" ref={r(7)}>
        <div className="join-h">The drawer<br /><span>has been waiting.</span></div>
        <div className="join-r">
          <p className="join-sub">Set it once. Fresh pack on your schedule. Old ones returned for credit. Nothing to think about after that.</p>
          <button className="join-btn" onClick={() => navigate("/configure")}>Get Your Pack →</button>
        </div>
      </div>
    </>
  )
}
