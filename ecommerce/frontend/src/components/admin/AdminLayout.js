import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/admin', label: '📊 Dashboard', exact: true },
  { to: '/admin/products', label: '📦 Products' },
  { to: '/admin/orders', label: '🧾 Orders' },
  { to: '/admin/users', label: '👥 Users' },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#1e293b', flexShrink: 0, padding: '24px 0' }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #334155', marginBottom: 12 }}>
          <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</p>
        </div>
        {NAV.map(({ to, label, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link key={to} to={to} style={{ display: 'block', padding: '11px 20px', fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#fff' : '#94a3b8', background: active ? '#2563eb' : 'transparent', borderLeft: active ? '3px solid #60a5fa' : '3px solid transparent', transition: 'all 0.15s' }}>
              {label}
            </Link>
          );
        })}
        <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid #334155', marginTop: 20 }}>
          <Link to="/" style={{ color: '#94a3b8', fontSize: 13 }}>← Back to Store</Link>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '32px 32px', overflow: 'auto' }}>
        {title && <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24, color: '#111' }}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}
