# STOIK Launch Checklist (Investor Demo)

## 1) Freeze Demo Scope
- [ ] Keep nav + routes to: Home, Shop, Bag, Checkout, Contact, Stoik Credits, Billing
- [ ] Hide or remove unfinished sections before sharing link

## 2) Pre-Launch QA
- [ ] Test flow: Home -> Shop -> Bag -> Checkout
- [ ] Test quantity updates in bag (increase/decrease)
- [ ] Test mobile layout (390px width) and desktop (1440px)
- [ ] Confirm no blocking console errors in browser

## 3) Environment + Secrets
- [ ] Set production frontend env (`VITE_API_URL`)
- [ ] Set backend env (DB URL, JWT secret, payment keys)
- [ ] Confirm CORS allows deployed frontend domain

## 4) Data Readiness
- [ ] Seed only 3 SKUs: white, black, grey
- [ ] Confirm same final price logic across all 3
- [ ] Validate checkout payload uses real SKU IDs

## 5) Deploy
- [ ] Frontend deploy (Vercel/Netlify)
- [ ] Backend deploy (Render/Railway/Fly)
- [ ] Connect custom domain
- [ ] Add HTTPS-only redirect

## 6) Analytics + Reliability
- [ ] Add analytics (GA4 or PostHog)
- [ ] Add error tracking (Sentry)
- [ ] Add uptime check on backend health endpoint

## 7) Investor Demo Assets
- [ ] 60-90 second walkthrough video
- [ ] 8-10 slide pitch deck
- [ ] One-page metrics snapshot (users, orders, repeat intent)
- [ ] Clear funding ask (amount, use of funds, runway)

## 8) Soft Launch
- [ ] Share private link with 5-10 target users
- [ ] Collect feedback in one sheet
- [ ] Fix top 5 issues only
- [ ] Publish final investor demo link
