const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
    });
    return paymentIntent.client_secret;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create payment intent');
  }
};

module.exports = { createPaymentIntent };