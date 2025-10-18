# Deployment Guide

## Overview

TransitScore 3D has two deployment configurations:
- **Free Version**: No authentication, Venmo donations
- **Paid Version**: Authentication + Stripe subscriptions ($20/month)

Both versions share the same codebase with identical analysis features.

---

## Repository Structure

### Branches
- `main` - Free version (no auth, no payment)
- `paid-version` - Pro version (auth + Stripe)

### Keeping Branches Synced
```bash
# Develop features on main
git checkout main
# ... make changes ...
git commit -m "Add new feature"
git push

# Merge to paid version
git checkout paid-version
git merge main
git push
```

---

## Free Version Deployment

### Branch
`main`

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Deploy Command
```bash
git checkout main
vercel deploy --prod
```

### Automatic Deployment
The main branch auto-deploys to production on every push via Vercel GitHub integration.

### Production URL
https://transitscore-3d.vercel.app

---

## Paid Version Deployment

### Branch
`paid-version`

### Additional Environment Variables
```
NEXT_PUBLIC_APP_VERSION=paid
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Stripe Configuration
1. Get API keys from https://dashboard.stripe.com/apikeys
2. Create webhook endpoint at your-domain.vercel.app/api/webhook
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret

### Deploy Command
```bash
git checkout paid-version
vercel deploy --prod --env NEXT_PUBLIC_APP_VERSION=paid [... other env vars]
```

### Product Configuration
- Product ID: `prod_TFv11Skf3LgKB7`
- Price ID: `price_1SJPBOFSYcTHcWEtQIFIb6at`
- Amount: $20.00/month

---

## Supabase Setup

### Required Tables

Run in Supabase SQL Editor:

```sql
-- Analyzed sites table
CREATE TABLE IF NOT EXISTS analyzed_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  walkability_score INT,
  transit_score INT,
  amenity_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Amenity cache table
CREATE TABLE IF NOT EXISTS amenity_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  amenity_type TEXT NOT NULL,
  amenities JSONB,
  cached_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table (paid version only)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analyzed_sites_coords ON analyzed_sites(lat, lng);
CREATE INDEX IF NOT EXISTS idx_amenity_cache_coords ON amenity_cache(lat, lng);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- RLS policies
ALTER TABLE analyzed_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenity_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON analyzed_sites FOR SELECT USING (true);
CREATE POLICY "Public insert" ON analyzed_sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read cache" ON amenity_cache FOR SELECT USING (true);
CREATE POLICY "Public insert cache" ON amenity_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
```

### Enable Authentication (Paid Version)
1. Go to Supabase Dashboard → Authentication
2. Enable Email provider
3. Configure email templates
4. Set site URL to your production domain

---

## Environment Configuration

### Development
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
ANTHROPIC_API_KEY=your_key
```

### Production (Vercel)
Add environment variables in Vercel dashboard:
- Project Settings → Environment Variables
- Add each variable
- Select appropriate environments (Production, Preview, Development)

---

## Deployment Checklist

### Free Version
- [ ] Supabase project created
- [ ] Tables created and RLS enabled
- [ ] Environment variables configured in Vercel
- [ ] Code pushed to main branch
- [ ] Deployment successful
- [ ] Test address analysis
- [ ] Verify Venmo donation button

### Paid Version
- [ ] All free version steps complete
- [ ] Stripe account created and verified
- [ ] Product and price created in Stripe
- [ ] Webhook endpoint configured
- [ ] Stripe API keys added to Vercel
- [ ] Authentication enabled in Supabase
- [ ] Code pushed to paid-version branch
- [ ] Deployment successful
- [ ] Test signup/signin flow
- [ ] Test subscription checkout
- [ ] Verify webhook integration

---

## Monitoring

### Vercel
- Build logs: `vercel logs --prod`
- Deployment status: Vercel dashboard
- Performance metrics: Vercel Analytics

### Supabase
- Database logs: Supabase dashboard
- Auth logs: Authentication section
- API usage: Project settings

### Stripe (Paid Version)
- Revenue: Stripe dashboard
- Subscriptions: Customers section
- Webhooks: Webhook logs

---

## Troubleshooting

### Build Fails
- Check TypeScript errors in build logs
- Verify all dependencies in package.json
- Ensure environment variables are set

### Authentication Issues (Paid Version)
- Verify Supabase auth is enabled
- Check middleware.ts is present on paid-version branch
- Confirm NEXT_PUBLIC_APP_VERSION=paid is set

### Payment Issues (Paid Version)
- Verify Stripe API keys are correct
- Check webhook endpoint URL matches deployment
- Review Stripe webhook logs for errors
- Confirm subscription table exists in Supabase

### API Errors
- Check API route logs in Vercel
- Verify external API keys (Anthropic, OpenRouteService)
- Review rate limits for external APIs

---

This deployment guide provides ongoing reference for maintaining TransitScore 3D.

