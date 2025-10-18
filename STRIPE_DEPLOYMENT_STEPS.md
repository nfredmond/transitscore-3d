# 🚀 Stripe-Connected Paid Version - Deployment Steps

## ✅ Your Stripe Account is Connected!

**Account**: Nathaniel Redmond  
**Account ID**: acct_1Pw8GpFSYcTHcWEt  
**Product**: Transit Score - 3D (prod_TFv11Skf3LgKB7)  
**Price**: $20/month (price_1SJPBOFSYcTHcWEtQIFIb6at)  

---

## 🔑 Step 1: Get Your Stripe API Keys

### Publishable Key
1. Go to: https://dashboard.stripe.com/apikeys
2. Find "Publishable key" (starts with `pk_live_...`)
3. Click to reveal and copy it

### Secret Key
1. On same page: https://dashboard.stripe.com/apikeys
2. Find "Secret key" (starts with `sk_live_...`)
3. Click "Reveal test key" button
4. Copy the key (KEEP THIS SECURE!)

---

## 🔗 Step 2: Create Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. **Endpoint URL**: We'll add this after deployment (for now, use placeholder)
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_...`)

---

## 💻 Step 3: Deploy with PowerShell

Run this command (I'll fill in the Stripe keys once you provide them):

```powershell
cd "C:\Code\Planning App"
git checkout paid-version

vercel deploy --prod --yes `
  -e NEXT_PUBLIC_APP_VERSION=paid `
  -e NEXT_PUBLIC_SUPABASE_URL=https://xezwjmclbpvklojbcmaj.supabase.co `
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlendqbWNsYnB2a2xvamJjbWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzY2ODAsImV4cCI6MjA1OTcxMjY4MH0.5aVrcOOO3oDtKdjX2UbrXfUiQLfnNThNn2bRGOnLdUM `
  -e ANTHROPIC_API_KEY=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 `
  -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY_HERE `
  -e STRIPE_SECRET_KEY=YOUR_SECRET_KEY_HERE `
  -e STRIPE_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
```

---

## 🎯 Step 4: Update Webhook URL

After deployment:
1. Vercel will give you production URL (e.g., `transitscore-3d-pro.vercel.app`)
2. Go back to Stripe webhook settings
3. Update endpoint URL to: `https://your-production-url.vercel.app/api/webhook`
4. Save changes

---

## ✅ What's Already Configured

### In Your Stripe Account:
✅ Product created: "Transit Score - 3D"  
✅ Price set: $20.00/month recurring  
✅ Account verified  

### In Your Code:
✅ Stripe integration complete  
✅ Checkout session uses your price ID  
✅ Webhook handler ready  
✅ Subscription table in Supabase  
✅ Authentication flow complete  

---

## 📋 Quick Copy-Paste

Once you have the keys, paste them here and I'll deploy immediately:

**Format:**
```
PUBLISHABLE_KEY: pk_live_...
SECRET_KEY: sk_live_...
WEBHOOK_SECRET: whsec_...
```

---

## 🔐 Security Notes

- Never commit API keys to Git ✅ (already in .gitignore)
- Keys are stored in Vercel environment variables ✅
- Webhook signature verification enabled ✅
- Supabase RLS policies active ✅

---

## 🎊 What Happens After Deployment

### User Flow:
1. User visits paid version URL
2. Redirected to auth page
3. Signs up with email/password
4. Redirected to subscribe page
5. Clicks "Subscribe Now - $20/month"
6. Stripe checkout opens
7. Enters payment info
8. Subscription created
9. Webhook updates database
10. User gets full access!

### You Get:
- Automatic monthly billing
- Stripe handles all payment processing
- Dashboard to manage subscriptions
- Revenue tracking
- Customer management

---

**Ready when you are! Just provide the 3 Stripe keys and I'll deploy the paid version!** 🚀

