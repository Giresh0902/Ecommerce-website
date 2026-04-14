import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ search: searchParams.get('search') || '', category, page, limit: 12 })
      .then(r => { setProducts(r.data.products); setPagination(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {}; if (search) p.search = search; if (category) p.category = category;
    setSearchParams(p);
  };

  const setCategory = (cat) => {
    const p = {}; if (cat) p.category = cat; if (searchParams.get('search')) p.search = searchParams.get('search');
    setSearchParams(p);
  };

  const setPage = (pg) => {
    const p = Object.fromEntries(searchParams);
    setSearchParams({ ...p, page: pg });
  };

  return (
    <div className="page container">
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <aside style={{ width: 200, flexShrink: 0 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button onClick={() => setCategory('')}
                style={{ textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none', background: !category ? '#dbeafe' : 'transparent', color: !category ? '#1d4ed8' : '#374151', fontWeight: !category ? 600 : 400, fontSize: 14, cursor: 'pointer' }}>
                All Products
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none', background: category === cat ? '#dbeafe' : 'transparent', color: category === cat ? '#1d4ed8' : '#374151', fontWeight: category === cat ? 600 : 400, fontSize: 14, cursor: 'pointer' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <input className="form-control" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..." style={{ flex: 1 }} />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: '#6b7280' }}>{pagination.total || 0} products found</p>
            {category && <span className="badge badge-info">{category} ✕ <span style={{ cursor: 'pointer' }} onClick={() => setCategory('')}></span></span>}
          </div>

          {loading ? (
            <div className="spinner"><div className="spinner-circle" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {pagination.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pg => (
                    <button key={pg} className={`page-btn ${pg === page ? 'active' : ''}`} onClick={() => setPage(pg)}>{pg}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
