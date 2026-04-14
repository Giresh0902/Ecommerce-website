import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=checkout'); return; }
    navigate('/checkout');
  };

  if (cartItems.length === 0) return (
    <div className="page container">
      <div className="empty-state">
        <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="page container">
      <h1 className="section-title" style={{ marginBottom: 24 }}>Shopping Cart ({cartItems.length})</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cartItems.map(item => (
            <div key={item._id} className="card" style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/products/${item._id}`}><h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.name}</h3></Link>
                <p style={{ fontSize: 13, color: '#6b7280' }}>${item.price.toFixed(2)} each</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', fontSize: 16, cursor: 'pointer' }}>-</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: 80 }}>
                <p style={{ fontWeight: 700, fontSize: 16 }}>${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item._id)}
                  style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>
          {[['Subtotal', `$${cartTotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`], ['Tax (8%)', `$${tax.toFixed(2)}`]].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: label === 'Shipping' && shipping === 0 ? '#16a34a' : '#374151' }}>
              <span>{label}</span><span style={{ fontWeight: label === 'Shipping' && shipping === 0 ? 600 : 400 }}>{val}</span>
            </div>
          ))}
          {shipping > 0 && <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Add ${(50 - cartTotal).toFixed(2)} more for free shipping!</p>}
          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: 14, display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 20 }}>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-secondary btn-block" style={{ marginTop: 10, textAlign: 'center' }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
