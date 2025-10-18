# 💳 TransitScore 3D Pro - Paid Version Setup Guide

## Overview

This branch (`paid-version`) contains the **$20/month subscription version** with:
- ✅ Supabase Authentication (email/password)
- ✅ Stripe payment processing
- ✅ Automatic monthly billing
- ✅ Subscription management
- ✅ Secure payment handling

---

## 🔧 Setup Instructions

### 1. Supabase Configuration

The `subscriptions` table has already been created with this migration:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Enable Supabase Auth**:
1. Go to Supabase Dashboard → Authentication
2. Enable Email provider
3. Configure email templates (optional)
4. Set site URL to your production domain

### 2. Stripe Setup

1. **Create Stripe Account**: https://dashboard.stripe.com/register

2. **Get API Keys**:
   - Go to: https://dashboard.stripe.com/apikeys
   - Copy "Publishable key" (starts with `pk_`)
   - Copy "Secret key" (starts with `sk_`)

3. **Set up Webhook**:
   - Go to: https://dashboard.stripe.com/webhooks
   - Create endpoint: `https://your-domain.vercel.app/api/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy webhook signing secret (starts with `whsec_`)

### 3. Environment Variables

Add these to Vercel (in addition to existing ones):

```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=https://xezwjmclbpvklojbcmaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# New for Paid Version
NEXT_PUBLIC_APP_VERSION=paid
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Deploy Paid Version

**Option A: Separate Vercel Project**
```bash
# From paid-version branch
vercel --prod --env NEXT_PUBLIC_APP_VERSION=paid
```

**Option B: Same Project, Different Branch**
```bash
# Vercel will create preview URL for paid-version branch
git push origin paid-version
```

---

## 🔒 Security Features

✅ **Authentication Required**: Supabase Auth with email/password  
✅ **Subscription Validation**: Middleware checks active subscription  
✅ **Secure Payments**: Stripe handles all payment data  
✅ **Webhook Verification**: Stripe signature validation  
✅ **RLS Policies**: Row-level security on subscriptions  
✅ **Session Management**: Secure JWT tokens  

---

## 👥 User Flow

### New User
1. Visit app → Redirected to `/auth`
2. Click "Sign Up" tab
3. Enter name, email, password
4. Verify email (Supabase sends confirmation)
5. Redirected to `/subscribe`
6. Click "Subscribe Now - $20/month"
7. Stripe checkout page opens
8. Enter payment details
9. Subscription created
10. Redirected to app dashboard
11. Full access to all features!

### Returning User
1. Visit app → Redirected to `/auth`
2. Enter email/password
3. Sign in → Subscription checked
4. If active → Access granted
5. If not active → Redirected to `/subscribe`

### Cancellation
- Users manage subscriptions in Stripe customer portal
- Webhook updates subscription status
- Access revoked when subscription ends

---

## 📊 Revenue Tracking

Stripe Dashboard provides:
- Monthly Recurring Revenue (MRR)
- Active subscriptions count
- Churn rate
- Failed payments
- Customer lifetime value

---

## 🆓 Free Version (Main Branch)

The `main` branch remains **completely free** with:
- All analysis features
- No authentication required
- Venmo donation button: @Nathaniel-Redmond
- Always available at: https://transitscore-3d.vercel.app

---

## 🔄 Keeping Both Versions Updated

### Workflow:
1. Develop new features on `main` branch
2. Merge `main` into `paid-version`:
   ```bash
   git checkout paid-version
   git merge main
   git push origin paid-version
   ```
3. Deploy both:
   - Free: Auto-deploys from `main`
   - Paid: Deploy from `paid-version`

### What's Different:
- **Paid**: Has auth, subscription, middleware
- **Free**: Has Venmo donation button
- **Features**: Identical otherwise

---

## 💰 Pricing Strategy

### Current: $20/month
- Simple, straightforward pricing
- Monthly billing
- Cancel anytime
- No annual commitment

### Future Options:
- Annual plan: $200/year (save $40)
- Team plan: $50/month (5 users)
- Enterprise: Custom pricing

---

## 🛠️ Testing

### Test Mode (Development)
1. Use Stripe test keys (`pk_test_...` and `sk_test_...`)
2. Test card: 4242 4242 4242 4242
3. Any future expiry, any CVC
4. Test subscription flows

### Production
- Use live keys
- Real payment processing
- Set up tax collection (optional)
- Configure billing portal

---

## 📝 Legal Considerations

You should add:
- Terms of Service
- Privacy Policy  
- Refund Policy
- Subscription Terms

---

## 🚀 Launch Checklist

- [ ] Stripe account verified
- [ ] Webhook configured and tested
- [ ] Supabase Auth enabled
- [ ] Email templates configured
- [ ] Environment variables set in Vercel
- [ ] Test subscription flow end-to-end
- [ ] Legal docs added (Terms, Privacy)
- [ ] Support email configured
- [ ] Analytics set up
- [ ] Launch!

---

## 🎯 Marketing Your Paid Version

### Value Proposition:
"Professional-grade development impact analysis with CARB-compliant VMT/GHG calculations, 14 TDM programs, and comprehensive scenario planning - all for less than a Netflix subscription."

### Target Audience:
- Urban planners
- Development consultants
- Architecture firms
- Real estate developers
- City planning departments
- Environmental consultants

### Positioning:
- $20/month is very reasonable for professional tools
- Comparable tools cost $100-500/month
- Saves hours of manual calculations
- Defensible methodology

---

## 📧 Support

For the paid version, consider:
- Dedicated support email
- Slack/Discord community
- Video tutorials
- Live onboarding calls
- Priority feature requests

---

**Branch**: `paid-version`  
**Pricing**: $20/month  
**Payment**: Stripe  
**Auth**: Supabase  
**Status**: Ready to deploy

