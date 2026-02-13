import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { login, register, startSocialAuth } from '../services/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './auth.css';

export default function Auth() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const fromPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Working...');

    try {
      let response;
      if (mode === 'login') {
        response = await login({ email: form.email, password: form.password });
      } else {
        response = await register({ email: form.email, fullName: form.fullName, password: form.password });
      }

      auth?.login(response);
      setStatus('Success. Redirecting...');
      navigate(fromPath, { replace: true });
    } catch (error) {
      setStatus(error.message || 'Authentication failed.');
    }
  };

  const handleSocialAuth = async (provider) => {
    setStatus(`Starting ${provider === 'google' ? 'Google' : 'Apple'} sign-in...`);

    try {
      const response = await startSocialAuth(provider);

      if (response?.token && response?.user) {
        auth?.login(response);
        setStatus('Success. Redirecting...');
        navigate(fromPath, { replace: true });
      }
    } catch (error) {
      setStatus(error.message || 'Social sign-in failed.');
    }
  };

  return (
    <main className="page auth fade-in">
      <div className="auth__panel">
        <div className="auth__switch">
          <button onClick={() => setMode('login')} className={mode === 'login' ? 'active' : ''}>
            Sign in
          </button>
          <button onClick={() => setMode('register')} className={mode === 'register' ? 'active' : ''}>
            Create account
          </button>
        </div>
        <h1 className="title">{mode === 'login' ? 'Welcome back.' : 'Create your Stoik account.'}</h1>
        <p className="subtitle">We keep it simple and clean. Quiet confidence, just essentials.</p>

        {location.state?.reason === 'auth' && (
          <div className="auth__status">Please sign in to continue.</div>
        )}

        <div className="auth__social">
          <Button type="button" variant="ghost" onClick={() => handleSocialAuth('google')}>
            Continue with Google
          </Button>
          <Button type="button" variant="ghost" onClick={() => handleSocialAuth('apple')}>
            Continue with Apple
          </Button>
        </div>

        <div className="auth__divider">or continue with email</div>

        <form onSubmit={handleSubmit} className="auth__form">
          {mode === 'register' && (
            <label>
              Full name
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <Button type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</Button>
        </form>

        {status && <div className="auth__status">{status}</div>}

        <div className="auth__foot">
          <span>By continuing, you agree to our</span>
          <Link to="/terms">Terms</Link>
          <span>and</span>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </main>
  );
}
