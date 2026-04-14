import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getDashboardStats } from '../../utils/api';

const StatCard = ({ label, value, icon, color }) => (
  <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{icon}</div>
    <div>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{value}</p>
    </div>
  </div>
);

const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="spinner"><div className="spinner-circle" /></div></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Revenue" value={`$${(stats?.revenue || 0).toFixed(2)}`} icon="💰" color="#16a34a" />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} icon="🧾" color="#2563eb" />
        <StatCard label="Products" value={stats?.totalProducts || 0} icon="📦" color="#7c3aed" />
        <StatCard label="Customers" value={stats?.totalUsers || 0} icon="👥" color="#f59e0b" />
      </div>

      {/* Monthly Sales */}
      {stats?.monthlySales?.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Monthly Sales</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {stats.monthlySales.map((m, i) => {
              const maxSales = Math.max(...stats.monthlySales.map(x => x.sales));
              const height = maxSales > 0 ? (m.sales / maxSales) * 100 : 10;
              const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>${Math.round(m.sales)}</span>
                  <div style={{ width: '100%', height: `${height}%`, background: '#2563eb', borderRadius: '4px 4px 0 0', minHeight: 4, opacity: 0.8 }} />
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{months[m._id.month - 1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Orders</h2>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map(o => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{o._id.slice(-8).toUpperCase()}</td>
                  <td style={{ fontSize: 13 }}>{o.user?.name}</td>
                  <td style={{ fontWeight: 700 }}>${o.totalPrice.toFixed(2)}</td>
                  <td><span className={`badge badge-${STATUS_COLORS[o.status] || 'secondary'}`}>{o.status}</span></td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
