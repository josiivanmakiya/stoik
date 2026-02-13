# Paystack Integration Notes

## 1) Required env vars

Add these to your backend `.env`:

```env
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxx
PAYSTACK_DEFAULT_PLAN_CODE=PLN_xxxxx
```

## 2) Mount routes

In your app entry file (where you register routes), add:

```js
import paystackRoutes from "./routes/paystack.routes.js";

app.use("/api/paystack", paystackRoutes);
```

## 3) Webhook route ordering (important)

For signature verification, webhook should receive raw JSON bytes.  
If you use global `app.use(express.json())`, mount webhook before it, or keep the route-level `express.raw` already defined in `paystack.routes.js`.

## 4) Frontend subscription call

```js
const res = await axios.post("/api/paystack/initialize", {
  email: user.email,
  userId: user._id,
});

window.location.href = res.data.data.authorization_url;
```

## 5) Webhook URL

Set this in Paystack dashboard:

`https://your-domain.com/api/paystack/webhook`
