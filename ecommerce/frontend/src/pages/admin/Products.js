import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getProducts, deleteProduct } from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    getProducts({ limit: 100 }).then(r => setProducts(r.data.products)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Products">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <input className="form-control" style={{ maxWidth: 280 }} placeholder="Search products..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {loading ? <div className="spinner"><div className="spinner-circle" /></div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} /></td>
                    <td style={{ maxWidth: 200 }}>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#6b7280' }}>{p.brand}</p>
                    </td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'danger'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>⭐ {p.rating.toFixed(1)} ({p.numReviews})</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/products/${p._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>No products found</div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
