import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const STATUS_OPTS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAllOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout title="Orders">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...STATUS_OPTS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}>
            {s} {s === 'all' ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner"><div className="spinner-circle" /></div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Paid</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o._id}>
                    <td>
                      <Link to={`/orders/${o._id}`} style={{ fontFamily: 'monospace', fontSize: 12, color: '#2563eb' }}>
                        #{o._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      <p style={{ fontWeight: 500 }}>{o.user?.name}</p>
                      <p style={{ fontSize: 11, color: '#6b7280' }}>{o.user?.email}</p>
                    </td>
                    <td style={{ fontSize: 13 }}>{o.orderItems?.length} items</td>
                    <td style={{ fontWeight: 700 }}>${o.totalPrice?.toFixed(2)}</td>
                    <td>{o.isPaid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-danger">Unpaid</span>}</td>
                    <td><span className={`badge badge-${STATUS_COLORS[o.status] || 'secondary'}`}>{o.status}</span></td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select className="form-control" style={{ fontSize: 12, padding: '4px 8px', width: 130 }}
                        value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)}>
                        {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>No orders found</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
