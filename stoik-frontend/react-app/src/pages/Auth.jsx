import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { login, register as registerAccount, startSocialAuth } from '../services/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './auth.css';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Auth() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [status, setStatus] = useState('');
  const fromPath = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    setStatus('');
    reset((values) => ({
      ...values,
      password: ''
    }));
  }, [mode, reset]);

  const onSubmit = async (values) => {
    setStatus('Working...');

    try {
      let response;
      if (mode === 'login') {
        response = await login({ email: values.email, password: values.password });
      } else {
        response = await registerAccount({
          email: values.email,
          fullName: values.fullName,
          password: values.password
        });
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
          <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'active' : ''}>
            Sign in
          </button>
          <button type="button" onClick={() => setMode('register')} className={mode === 'register' ? 'active' : ''}>
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

        <form onSubmit={handleSubmit(onSubmit)} className="auth__form" noValidate>
          {mode === 'register' && (
            <label>
              Full name
              <input
                type="text"
                className={errors.fullName ? 'auth__input-error' : ''}
                {...register('fullName', {
                  validate: (value) => (
                    mode === 'login' || value.trim().length >= 2 || 'Enter at least 2 characters.'
                  )
                })}
              />
              {errors.fullName && <span className="auth__error">{errors.fullName.message}</span>}
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              className={errors.email ? 'auth__input-error' : ''}
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address.'
                }
              })}
            />
            {errors.email && <span className="auth__error">{errors.email.message}</span>}
          </label>
          <label>
            Password
            <input
              type="password"
              className={errors.password ? 'auth__input-error' : ''}
              {...register('password', {
                required: 'Password is required.',
                pattern: {
                  value: PASSWORD_RULE,
                  message: 'Use 8+ chars with uppercase, lowercase, and number.'
                }
              })}
            />
            {errors.password && <span className="auth__error">{errors.password.message}</span>}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
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
