import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card" style={{ transition: 'box-shadow 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <Link to={`/products/${product._id}`} style={{ display: 'block' }}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f9fafb' }}>
          <img src={product.image} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {discount && (
            <span style={{ position: 'absolute', top: 10, left: 10, background: '#dc2626', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Out of Stock</span>
            </div>
          )}
        </div>
        <div style={{ padding: '14px 14px 10px' }}>
          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brand}</p>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>({product.numReviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through' }}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 14px 14px' }}>
        <button className="btn btn-primary btn-block btn-sm" onClick={handleAdd} disabled={product.stock === 0}>
          {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}
