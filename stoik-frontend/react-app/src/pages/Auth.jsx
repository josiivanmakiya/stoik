import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { login, register as registerAccount } from '../services/auth.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './auth.css';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Auth() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode === 'register' ? 'register' : 'login');
  const [status, setStatus] = useState('');
  const fromPath = location.state?.from?.pathname || '/bag';

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
    reset((values) => ({ ...values, password: '' }));
  }, [mode, reset]);

  const onSubmit = async (values) => {
    setStatus('Working...');

    try {
      const response = mode === 'login'
        ? await login({ email: values.email, password: values.password })
        : await registerAccount({
            email: values.email,
            fullName: values.fullName,
            password: values.password
          });

      auth?.login(response);
      setStatus('Success. Redirecting...');
      navigate(fromPath, { replace: true });
    } catch (error) {
      setStatus(error.message || 'Authentication failed.');
    }
  };

  return (
    <main className="page auth fade-in">
      <section className="auth__card">
        <h1 className="auth__title">{mode === 'login' ? 'Login' : 'Create account'}</h1>
        <p className="auth__subtitle">
          {mode === 'login' ? 'Sign in to your Stoik account.' : 'Create your Stoik account in seconds.'}
        </p>

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
                validate: (value) => (
                  mode === 'login' || PASSWORD_RULE.test(value) || 'Use 8+ chars with uppercase, lowercase, and number.'
                )
              })}
            />
            {errors.password && <span className="auth__error">{errors.password.message}</span>}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </Button>
        </form>

        {status && <div className="auth__status">{status}</div>}

        <div className="auth__mode-note">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('register')}>Create account</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')}>Login</button>
            </>
          )}
        </div>

        <div className="auth__foot">
          <span>By continuing, you agree to our</span>
          <Link to="/terms">Terms</Link>
          <span>and</span>
          <Link to="/privacy">Privacy</Link>
        </div>
      </section>
    </main>
  );
}

