import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createPaymentIntent, payOrder } from '../utils/api';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'US' });
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // In production: use Stripe Elements to get paymentMethod
      // Here we simulate a successful payment for demo purposes
      const orderItems = cartItems.map(i => ({
        product: i._id, name: i.name, image: i.image,
        price: i.price, quantity: i.quantity
      }));

      const { data: order } = await createOrder({
        orderItems, shippingAddress: address, paymentMethod: 'stripe',
        itemsPrice: cartTotal, shippingPrice: shipping,
        taxPrice: parseFloat(tax.toFixed(2)),
        totalPrice: parseFloat(total.toFixed(2))
      });

      // Mark as paid (demo — in production this comes from Stripe webhook)
      await payOrder(order._id, {
        id: 'pi_demo_' + Date.now(), status: 'succeeded',
        update_time: new Date().toISOString(), email_address: user.email
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="page container" style={{ maxWidth: 860 }}>
      <h1 className="section-title" style={{ marginBottom: 28 }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i ? '#2563eb' : step === i + 1 ? '#2563eb' : '#e5e7eb', color: step >= i + 1 ? '#fff' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? '#2563eb' : '#6b7280' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ height: 2, flex: 1, background: step > i + 1 ? '#2563eb' : '#e5e7eb', margin: '0 8px' }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'flex-start' }}>
        <div>
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Shipping Address</h2>
              <div className="form-group">
                <label>Street Address</label>
                <input className="form-control" value={address.street} placeholder="123 Main St"
                  onChange={e => setAddress({ ...address, street: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input className="form-control" value={address.city} placeholder="New York"
                    onChange={e => setAddress({ ...address, city: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="form-control" value={address.state} placeholder="NY"
                    onChange={e => setAddress({ ...address, state: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input className="form-control" value={address.zipCode} placeholder="10001"
                    onChange={e => setAddress({ ...address, zipCode: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select className="form-control" value={address.country}
                    onChange={e => setAddress({ ...address, country: e.target.value })}>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => {
                if (!address.street || !address.city || !address.state || !address.zipCode)
                  return toast.error('Please fill all address fields');
                setStep(2);
              }}>Continue to Payment →</button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Payment Details</h2>
              <div className="alert alert-info" style={{ marginBottom: 20 }}>
                🔒 Demo mode — use any card number (e.g. 4242 4242 4242 4242)
              </div>
              <div className="form-group">
                <label>Name on Card</label>
                <input className="form-control" value={cardInfo.name} placeholder="John Doe"
                  onChange={e => setCardInfo({ ...cardInfo, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input className="form-control" value={cardInfo.number} placeholder="4242 4242 4242 4242"
                  maxLength={19} onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input className="form-control" value={cardInfo.expiry} placeholder="MM/YY"
                    maxLength={5} onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input className="form-control" value={cardInfo.cvv} placeholder="123"
                    maxLength={4} onChange={e => setCardInfo({ ...cardInfo, cvv: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Review Your Order</h2>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#6b7280' }}>SHIPPING TO</h3>
              <p style={{ marginBottom: 20, fontSize: 14 }}>{address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}</p>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#6b7280' }}>ITEMS</h3>
              {cartItems.map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                  <span style={{ flex: 1, fontSize: 14 }}>{item.name}</span>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>x{item.quantity}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-success btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : `✓ Place Order — $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Summary</h3>
          {cartItems.map(i => (
            <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: '#374151' }}>
              <span style={{ flex: 1, marginRight: 8 }}>{i.name.substring(0, 22)}{i.name.length > 22 ? '…' : ''} x{i.quantity}</span>
              <span>${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12 }}>
            {[['Subtotal', `$${cartTotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`], ['Tax', `$${tax.toFixed(2)}`]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: '#6b7280' }}>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 10, paddingTop: 10, borderTop: '2px solid #e5e7eb' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
