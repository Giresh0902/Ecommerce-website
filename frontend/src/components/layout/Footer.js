import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a1a', color: '#9ca3af', marginTop: 60, padding: '40px 20px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>🛍 ShopEase</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Your one-stop destination for quality products at great prices.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <Link to="/products" style={{ color: '#9ca3af' }}>All Products</Link>
              <Link to="/products?category=Electronics" style={{ color: '#9ca3af' }}>Electronics</Link>
              <Link to="/products?category=Clothing" style={{ color: '#9ca3af' }}>Clothing</Link>
              <Link to="/products?category=Sports" style={{ color: '#9ca3af' }}>Sports</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>Account</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <Link to="/login" style={{ color: '#9ca3af' }}>Login</Link>
              <Link to="/register" style={{ color: '#9ca3af' }}>Register</Link>
              <Link to="/my-orders" style={{ color: '#9ca3af' }}>My Orders</Link>
              <Link to="/profile" style={{ color: '#9ca3af' }}>Profile</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: 12 }}>Info</h4>
            <p style={{ fontSize: 13 }}>📧 support@shopease.com</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>📞 +1 (800) 123-4567</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: 20, textAlign: 'center', fontSize: 13 }}>
          © {new Date().getFullYear()} ShopEase. Built with MERN Stack.
        </div>
      </div>
    </footer>
  );
}
