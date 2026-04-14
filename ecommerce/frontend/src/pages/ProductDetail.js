import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, createReview } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProductById(id).then(r => setProduct(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createReview(id, { rating, comment });
      toast.success('Review submitted!');
      setComment(''); setRating(5);
      const r = await getProductById(id);
      setProduct(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="spinner"><div className="spinner-circle" /></div>;
  if (!product) return <div className="page container"><div className="alert alert-error">Product not found.</div></div>;

  return (
    <div className="page container">
      <div className="breadcrumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/products">Products</Link><span>›</span>
        <span>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
        <div>
          <img src={product.image} alt={product.name}
            style={{ width: '100%', borderRadius: 12, border: '1px solid #e5e7eb', objectFit: 'cover', maxHeight: 420 }} />
        </div>
        <div>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 6, textTransform: 'uppercase' }}>{product.brand} · {product.category}</p>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 14, lineHeight: 1.3 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className="stars" style={{ fontSize: 18 }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a' }}>${product.price.toFixed(2)}</span>
            {product.originalPrice && <span style={{ fontSize: 18, color: '#9ca3af', textDecoration: 'line-through' }}>${product.originalPrice.toFixed(2)}</span>}
            {product.originalPrice && <span className="badge badge-danger">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>}
          </div>
          <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>
          <div style={{ marginBottom: 20 }}>
            <span style={{ color: product.stock > 0 ? '#16a34a' : '#dc2626', fontWeight: 600, fontSize: 14 }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
            </span>
          </div>
          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Qty:</label>
              <select className="form-control" value={qty} onChange={e => setQty(Number(e.target.value))}
                style={{ width: 80 }}>
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}
          <button className="btn btn-primary btn-lg btn-block" onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            {product.reviews.map(r => (
              <div key={r._id} style={{ padding: 16, background: '#f9fafb', borderRadius: 8, borderLeft: '3px solid #2563eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <strong style={{ fontSize: 14 }}>{r.name}</strong>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="stars" style={{ marginBottom: 6 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p style={{ fontSize: 14, color: '#374151' }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
        {user ? (
          <form onSubmit={handleReview}>
            <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Write a Review</h3>
            <div className="form-group">
              <label>Rating</label>
              <select className="form-control" value={rating} onChange={e => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★ - {['Excellent', 'Good', 'Average', 'Poor', 'Terrible'][5 - n]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea className="form-control" rows={3} value={comment} onChange={e => setComment(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p style={{ color: '#6b7280' }}><Link to="/login" style={{ color: '#2563eb' }}>Login</Link> to write a review.</p>
        )}
      </div>
    </div>
  );
}
