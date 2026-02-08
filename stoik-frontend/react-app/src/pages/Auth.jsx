import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { login, register } from '../services/auth.api.js';
import './auth.css';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Working...');
    let response;
    if (mode === 'login') {
      response = await login({ email: form.email, password: form.password });
    } else {
      response = await register({ email: form.email, fullName: form.fullName, password: form.password });
    }
    localStorage.setItem('stoik_token', response.token);
    localStorage.setItem('stoik_user', JSON.stringify(response.user));
    setStatus('Success. Redirect to dashboard (mock).');
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
