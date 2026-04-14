import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await login(form);
      authLogin(data);
      toast.success('Welcome back!');
      navigate(data.isAdmin ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 36 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>Welcome Back</h1>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 28, fontSize: 14 }}>Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 500 }}>Sign up</Link>
        </p>
        <div style={{ marginTop: 20, padding: 14, background: '#f0f9ff', borderRadius: 8, fontSize: 13 }}>
          <strong>Demo:</strong><br />
          Admin: admin@ecommerce.com / admin123<br />
          User: john@example.com / user123
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { data } = await register(form);
      authLogin(data);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420, padding: 36 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>Create Account</h1>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 28, fontSize: 14 }}>Join ShopEase today</p>
        <form onSubmit={handleSubmit}>
          {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'you@example.com'], ['password', 'Password', 'password', '••••••••'], ['confirmPassword', 'Confirm Password', 'password', '••••••••']].map(([field, label, type, ph]) => (
            <div className="form-group" key={field}>
              <label>{label}</label>
              <input className="form-control" type={type} required value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={ph} />
            </div>
          ))}
          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
