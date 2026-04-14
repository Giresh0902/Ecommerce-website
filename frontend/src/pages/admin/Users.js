import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllUsers, deleteUser, toggleAdminRole } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useAuth();

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (id === currentUser._id) return toast.error("You can't delete yourself");
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  const handleToggleAdmin = async (id, name) => {
    if (id === currentUser._id) return toast.error("You can't change your own role");
    try {
      const { data } = await toggleAdminRole(id);
      toast.success(data.message);
      fetchUsers();
    } catch { toast.error('Update failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <div style={{ marginBottom: 16 }}>
        <input className="form-control" style={{ maxWidth: 300 }} placeholder="Search users..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="spinner"><div className="spinner-circle" /></div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.isAdmin ? '#7c3aed' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: '#374151' }}>{u.email}</td>
                    <td>
                      {u.isAdmin
                        ? <span className="badge badge-info">👑 Admin</span>
                        : <span className="badge badge-secondary">👤 Customer</span>}
                    </td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => handleToggleAdmin(u._id, u.name)}
                          disabled={u._id === currentUser._id}>
                          {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={u._id === currentUser._id}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>No users found</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
