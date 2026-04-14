const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc Create Stripe payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get Stripe publishable key
const getStripeKey = async (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key' });
};

module.exports = { createPaymentIntent, getStripeKey };
