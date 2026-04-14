import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById, getMyOrders, updateProfile } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// ─── Order Success ────────────────────────────────────────────
export function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10, color: '#16a34a' }}>Order Placed!</h1>
      <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Thank you for your purchase.</p>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 30 }}>Order ID: <strong>#{id}</strong></p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={`/orders/${id}`} className="btn btn-primary btn-lg">View Order Details</Link>
        <Link to="/products" className="btn btn-secondary btn-lg">Continue Shopping</Link>
      </div>
    </div>
  );
}

// ─── Order Detail ─────────────────────────────────────────────
export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then(r => setOrder(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' };

  if (loading) return <div className="spinner"><div className="spinner-circle" /></div>;
  if (!order) return <div className="page container"><div className="alert alert-error">Order not found.</div></div>;

  return (
    <div className="page container" style={{ maxWidth: 820 }}>
      <div className="breadcrumb">
        <Link to="/my-orders">My Orders</Link><span>›</span>
        <span>Order #{order._id.slice(-8).toUpperCase()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Order Details</h1>
        <span className={`badge badge-${STATUS_COLORS[order.status] || 'secondary'}`} style={{ fontSize: 13, padding: '5px 14px' }}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[
          ['Order Date', new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
          ['Payment', order.isPaid ? `✅ Paid on ${new Date(order.paidAt).toLocaleDateString()}` : '❌ Not Paid'],
          ['Delivery', order.isDelivered ? `✅ Delivered` : '⏳ Pending'],
          ['Payment Method', order.paymentMethod.toUpperCase()],
        ].map(([label, val]) => (
          <div key={label} className="card" style={{ padding: 16 }}>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</p>
            <p style={{ fontWeight: 600, fontSize: 14 }}>{val}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Shipping Address</h2>
        <p style={{ fontSize: 14, color: '#374151' }}>
          {order.shippingAddress.street}<br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
          {order.shippingAddress.country}
        </p>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Items</h2>
        {order.orderItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: i < order.orderItems.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
            <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <Link to={`/products/${item.product}`} style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{item.name}</Link>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{item.quantity} × ${item.price.toFixed(2)}</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '2px solid #e5e7eb' }}>
          {[['Items', `$${order.itemsPrice.toFixed(2)}`], ['Shipping', `$${order.shippingPrice.toFixed(2)}`], ['Tax', `$${order.taxPrice.toFixed(2)}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280', marginBottom: 6 }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, marginTop: 10, paddingTop: 10, borderTop: '1px solid #e5e7eb' }}>
            <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── My Orders ────────────────────────────────────────────────
export function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' };

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page container">
      <h1 className="section-title" style={{ marginBottom: 24 }}>My Orders</h1>
      {loading ? <div className="spinner"><div className="spinner-circle" /></div>
        : orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Paid</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 13 }}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td style={{ fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontSize: 13 }}>{o.orderItems.length} item{o.orderItems.length > 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 700 }}>${o.totalPrice.toFixed(2)}</td>
                      <td>{o.isPaid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-danger">Unpaid</span>}</td>
                      <td><span className={`badge badge-${STATUS_COLORS[o.status] || 'secondary'}`}>{o.status}</span></td>
                      <td><Link to={`/orders/${o._id}`} className="btn btn-secondary btn-sm">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────
export function Profile() {
  const { user, login: authLogin } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', address: user?.address || {} });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, address: form.address };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      authLogin(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="page container" style={{ maxWidth: 600 }}>
      <h1 className="section-title" style={{ marginBottom: 24 }}>My Profile</h1>
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontWeight: 700 }}>{user?.name}</h2>
            <p style={{ color: '#6b7280', fontSize: 14 }}>{user?.isAdmin ? '👑 Admin' : '👤 Customer'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>New Password <span style={{ color: '#9ca3af', fontWeight: 400 }}>(leave blank to keep current)</span></label>
            <input className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '20px 0 14px' }}>Address</h3>
          <div className="form-group">
            <label>Street</label>
            <input className="form-control" value={form.address.street || ''} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} placeholder="123 Main St" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input className="form-control" value={form.address.city || ''} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input className="form-control" value={form.address.state || ''} onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code</label>
              <input className="form-control" value={form.address.zipCode || ''} onChange={e => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input className="form-control" value={form.address.country || ''} onChange={e => setForm({ ...form, address: { ...form.address, country: e.target.value } })} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/my-orders" className="btn btn-secondary">View My Orders →</Link>
      </div>
    </div>
  );
}

export default MyOrders;
