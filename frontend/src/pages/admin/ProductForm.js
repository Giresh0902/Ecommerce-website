import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { createProduct, updateProduct, getProductById } from '../../utils/api';
import { toast } from 'react-toastify';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Sports', 'Kitchen', 'Accessories', 'Office', 'Books', 'Toys', 'Beauty'];

const INITIAL = { name: '', description: '', price: '', originalPrice: '', category: 'Electronics', brand: '', stock: '', image: '', featured: false };

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getProductById(id).then(r => {
        const p = r.data;
        setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '', category: p.category, brand: p.brand, stock: p.stock, image: p.image, featured: p.featured });
      }).catch(() => toast.error('Failed to load product'));
    }
  }, [id]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image || !form.stock)
      return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined };
      if (isEdit) await updateProduct(id, payload);
      else await createProduct(payload);
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
    setLoading(false);
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add New Product'}>
      <div style={{ maxWidth: 700 }}>
        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Wireless Headphones" required />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input className="form-control" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Sony" />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detailed product description..." required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input className="form-control" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="29.99" required />
              </div>
              <div className="form-group">
                <label>Original Price ($) <span style={{ color: '#9ca3af', fontWeight: 400 }}>(for discount)</span></label>
                <input className="form-control" type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="49.99" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input className="form-control" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="100" required />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL *</label>
              <input className="form-control" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." required />
              {form.image && (
                <img src={form.image} alt="preview" style={{ marginTop: 10, height: 100, width: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} onError={e => e.target.style.display = 'none'} />
              )}
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16 }} />
                <span>Feature this product on homepage</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => navigate('/admin/products')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
