import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register, login, saveSession } from "../services/auth.api"
import "./auth.css"

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function Auth() {
  const navigate        = useNavigate()
  const [mode, setMode] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")
  const [showPw, setShowPw]   = useState(false)
  const [form, setForm]       = useState({ firstName:"", lastName:"", email:"", password:"" })
  const upd = (k,v) => setForm(f => ({...f, [k]:v}))

  async function handleSubmit() {
    setError("")
    setLoading(true)
    try {
      const result = mode === "signup" ? await register(form) : await login(form)
      saveSession(result.token, result.user)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-box">
        <div className="auth-logo" onClick={() => navigate("/")}>Stoik</div>

        <div className="auth-tabs">
          <button className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setError("") }}>Login</button>
          <button className={mode === "signup" ? "on" : ""} onClick={() => { setMode("signup"); setError("") }}>Sign Up</button>
        </div>

        {mode === "login"
          ? <><div className="auth-h">Good to have you back.</div><div className="auth-sub">Your account.</div></>
          : <><div className="auth-h">About time.</div><div className="auth-sub">Create your member account.</div></>
        }

        <div className="social-wrap">
          <button className="social-btn" onClick={() => alert("Google auth — coming soon.")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button className="social-btn" onClick={() => alert("Apple auth — coming soon.")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
          <button className="social-btn" onClick={() => alert("Microsoft auth — coming soon.")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022"/>
              <path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00"/>
              <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF"/>
              <path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900"/>
            </svg>
            Continue with Microsoft
          </button>
        </div>

        <div className="auth-divider"><span>or</span></div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          {mode === "signup" && (
            <div className="auth-2">
              <div className="f-field">
                <label className="f-lbl">First Name</label>
                <input className="f-in" placeholder="First" value={form.firstName} onChange={e => upd("firstName", e.target.value)} />
              </div>
              <div className="f-field">
                <label className="f-lbl">Last Name</label>
                <input className="f-in" placeholder="Last" value={form.lastName} onChange={e => upd("lastName", e.target.value)} />
              </div>
            </div>
          )}

          <div className="f-field">
            <label className="f-lbl">Email</label>
            <input className="f-in" type="email" placeholder="you@example.com" value={form.email} onChange={e => upd("email", e.target.value)} />
          </div>

          <div className="f-field">
            <label className="f-lbl">Password</label>
            <div className="pw-wrap">
              <input
                className="f-in pw-in"
                type={showPw ? "text" : "password"}
                placeholder="Min 8 chars · 1 uppercase · 1 number"
                value={form.password}
                onChange={e => upd("password", e.target.value)}
              />
              <button className="pw-eye" type="button" onClick={() => setShowPw(s => !s)}>
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>

          <div className="auth-switch">
            {mode === "login"
              ? <><span style={{color:"rgba(244,241,236,0.5)"}}>No account? </span><span onClick={() => setMode("signup")}>Sign up</span></>
              : <><span style={{color:"rgba(244,241,236,0.5)"}}>Already a member? </span><span onClick={() => setMode("login")}>Log in</span></>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
