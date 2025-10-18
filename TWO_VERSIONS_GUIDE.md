# 🎯 TransitScore 3D - Two Versions Guide

## 🆓 FREE VERSION vs 💳 PAID VERSION

---

## 🆓 **FREE VERSION** (Main Branch)

### URL
**https://transitscore-3d.vercel.app**

### GitHub Branch
`main`

### Features (ALL FREE!)
✅ Unlimited California address analyses  
✅ Walk & bike accessibility scoring  
✅ Transit access analysis  
✅ Enhanced amenity detection (transit, bikeways, etc.)  
✅ AI-powered density recommendations (Claude)  
✅ Interactive 2D maps (CARTO Voyager)  
✅ 3D building visualization  
✅ Dark/light mode  
✅ Fullscreen map option  
✅ Walk/Bike mode toggle  
✅ Scenario planning with building characteristics  
✅ 14 TDM programs selector  
✅ VMT/GHG impact calculations  
✅ Professional PDF exports (2-page reports)  
✅ Climate impact metrics (cars/trees equivalent)  

### Monetization
- **Venmo Donations**: @Nathaniel-Redmond
- Blue "Donate via Venmo" button in footer
- Optional support from users
- No forced payments

### Use Case
- Individual planners
- Students
- Researchers
- Community advocates
- Anyone needing quick analyses

---

## 💳 **PAID VERSION** (Paid-Version Branch)

### URL
**To be deployed separately** (e.g., `transitscore-3d-pro.vercel.app`)

### GitHub Branch
`paid-version`

### Pricing
**$20/month**
- Monthly subscription
- Cancel anytime
- Stripe payment processing
- Automatic renewal

### Features (SAME as Free + Auth)
✅ **All free version features**  
✅ **Supabase Authentication** (email/password)  
✅ **Stripe Subscription** (secure payment)  
✅ **Priority Support** (faster response)  
✅ **Early Access** (new features first)  
✅ **Commercial Use License**  

### Authentication
- Email/password via Supabase Auth
- Secure session management
- Email verification
- Password reset capability

### Payment
- Stripe checkout ($20/month)
- Automatic billing
- Manage subscription in Stripe portal
- Secure payment handling (PCI compliant)
- Webhook integration for real-time status

### User Experience
1. Sign up → Verify email → Subscribe → Access app
2. Sign in → Check subscription → Access app
3. Cancel → Access until period ends → Then requires re-sub

### Use Case
- Professional consultants
- Architecture firms
- Development companies
- City planning departments
- Organizations needing support

---

## 🔧 **Technical Differences**

| Feature | Free | Paid |
|---------|------|------|
| **Authentication** | None | Required (Supabase) |
| **Payment** | Venmo donate | Stripe subscription |
| **Middleware** | None | Auth + subscription check |
| **Database** | Supabase (analytics only) | Supabase (analytics + auth + subs) |
| **Routes** | Open | Protected by middleware |
| **Env Vars** | 3 | 6 (adds Stripe keys) |

---

## 📦 **Deployment Setup**

### Free Version (Already Live)
```bash
git checkout main
vercel deploy --prod
```

**Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

### Paid Version (To Deploy)
```bash
git checkout paid-version
vercel deploy --prod
```

**Additional Environment Variables**:
- `NEXT_PUBLIC_APP_VERSION=paid`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- `STRIPE_SECRET_KEY=sk_live_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 🔄 **Syncing Updates**

When you add new features, update BOTH versions:

```bash
# 1. Develop on main
git checkout main
# ... make changes ...
git commit -m "New feature"
git push

# 2. Merge to paid-version
git checkout paid-version
git merge main
git push

# 3. Deploy both
# Free auto-deploys from GitHub
# Paid: vercel deploy --prod (from paid-version branch)
```

---

## 💡 **Why Two Versions?**

### Free Version Benefits
- ✅ Build community
- ✅ Get feedback
- ✅ Demonstrate value
- ✅ SEO and reach
- ✅ Portfolio piece
- ✅ Help students/nonprofits

### Paid Version Benefits
- ✅ Sustainable revenue
- ✅ Professional support
- ✅ Commercial licensing
- ✅ Priority features
- ✅ Account management
- ✅ Usage tracking

---

## 📊 **Revenue Projections**

### Conservative
- 10 subscribers × $20 = **$200/month**
- Annual: $2,400

### Moderate
- 50 subscribers × $20 = **$1,000/month**
- Annual: $12,000

### Optimistic
- 200 subscribers × $20 = **$4,000/month**
- Annual: $48,000

*Plus donations from free version!*

---

## 🎯 **Marketing Strategy**

### Free Version
- Share on planning forums
- Post on LinkedIn
- Submit to tool directories
- SEO optimize
- Venmo donation asks

### Paid Version
- Target professional firms
- LinkedIn ads
- Industry conferences
- Email outreach to consultants
- Demo videos
- Case studies

---

## 🔐 **Security Best Practices**

### Authentication
- ✅ Email verification required
- ✅ Secure password hashing (Supabase handles)
- ✅ JWT token sessions
- ✅ HTTPS only

### Payments
- ✅ Stripe PCI compliance
- ✅ No card data stored on your servers
- ✅ Webhook signature verification
- ✅ Secure API keys

### Database
- ✅ Row-level security (RLS)
- ✅ User data isolation
- ✅ Secure connections

---

## 📝 **Support & Maintenance**

### Free Version
- Community support
- GitHub issues
- Best effort

### Paid Version
- Email support within 24 hours
- Priority bug fixes
- Feature requests considered
- Regular updates

---

## 🚀 **What's Next**

1. **Set up Stripe account**
2. **Configure webhooks**
3. **Test payment flow**
4. **Deploy paid version** to separate URL
5. **Market both versions**
6. **Monitor metrics**
7. **Iterate based on feedback**

---

## 🎊 **BOTH VERSIONS READY!**

### Free:
- ✅ Live at https://transitscore-3d.vercel.app
- ✅ All features accessible
- ✅ Venmo donation option

### Paid:
- ✅ Code complete on `paid-version` branch
- ✅ Auth & payment integrated
- ✅ Ready to deploy
- ⏳ Awaits Stripe configuration

---

**Next Step**: Configure Stripe and deploy paid version!

**You now have a complete SaaS business ready to launch!** 🚀

