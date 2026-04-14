import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
  logo: { fontSize: 22, fontWeight: 700, color: '#2563eb', letterSpacing: '-0.5px' },
  links: { display: 'flex', alignItems: 'center', gap: 24, listStyle: 'none' },
  link: { fontSize: 14, fontWeight: 500, color: '#374151', transition: 'color 0.2s' },
  cartBtn: { position: 'relative', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' },
  badge: { position: 'absolute', top: -6, right: -8, background: '#2563eb', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  dropdown: { position: 'relative' },
  dropBtn: { background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 14px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  menu: { position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200 },
  menuItem: { display: 'block', padding: '10px 16px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>🛍 ShopEase</Link>
        <ul style={styles.links}>
          <li><Link to="/products" style={styles.link}>Products</Link></li>
          {user?.isAdmin && <li><Link to="/admin" style={{ ...styles.link, color: '#7c3aed' }}>Admin</Link></li>}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/cart">
            <button style={styles.cartBtn}>
              🛒
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </button>
          </Link>
          {user ? (
            <div style={styles.dropdown}>
              <button style={styles.dropBtn} onClick={() => setOpen(o => !o)}>
                👤 {user.name.split(' ')[0]} ▾
              </button>
              {open && (
                <div style={styles.menu}>
                  <Link to="/profile" style={styles.menuItem} onClick={() => setOpen(false)}>My Profile</Link>
                  <Link to="/my-orders" style={styles.menuItem} onClick={() => setOpen(false)}>My Orders</Link>
                  {user.isAdmin && <Link to="/admin" style={styles.menuItem} onClick={() => setOpen(false)}>Admin Panel</Link>}
                  <div style={{ ...styles.menuItem, color: '#dc2626', borderBottom: 'none' }} onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
