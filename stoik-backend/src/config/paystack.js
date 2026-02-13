const axios = require('axios');

const PAYSTACK_API_URL = 'https://api.paystack.co';

const paystackClient = axios.create({
  baseURL: PAYSTACK_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

const assertPaystackEnv = () => {
  const required = ['PAYSTACK_SECRET_KEY'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing Paystack env vars: ${missing.join(", ")}`);
  }
};

module.exports = {
  paystackClient,
  assertPaystackEnv
};
