import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORY_ICONS = { Electronics: '💻', Clothing: '👕', Footwear: '👟', Sports: '🏋️', Kitchen: '🍳', Accessories: '👜', Office: '🗂️' };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getFeaturedProducts().then(r => setFeatured(r.data)).catch(() => {});
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${search.trim()}`);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#fff', padding: '70px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 14, letterSpacing: '-1px' }}>Shop Everything You Love</h1>
        <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 32 }}>Discover thousands of products at unbeatable prices</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: 520, margin: '0 auto', gap: 0 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ flex: 1, padding: '13px 18px', fontSize: 15, border: 'none', borderRadius: '8px 0 0 8px', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0', padding: '0 24px' }}>Search</button>
        </form>
      </div>

      {/* Categories */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${cat}`}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#f3f4f6', borderRadius: 30, fontSize: 14, fontWeight: 500, color: '#374151', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#374151'; }}>
                <span>{CATEGORY_ICONS[cat] || '📦'}</span> {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="page container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-sub">Hand-picked top deals just for you</p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-sm">View All →</Link>
        </div>
        <div className="product-grid">
          {featured.map(p => <ProductCard key={p._id} product={p} />)}
        </div>

        {/* Promo banner */}
        <div style={{ marginTop: 50, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', borderRadius: 12, padding: '40px 30px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Free Shipping on Orders Over $50</h2>
            <p style={{ opacity: 0.85 }}>Shop more and save more. Limited time offer!</p>
          </div>
          <Link to="/products" className="btn" style={{ background: '#fff', color: '#2563eb', fontWeight: 700, padding: '12px 28px' }}>
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
