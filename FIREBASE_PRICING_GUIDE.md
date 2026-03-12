# Firebase Pricing Guide - Free Tier

## ✅ **YES, Everything You Need is FREE!**

All the services required for your restaurant app are available on Firebase's **free Spark plan** (no credit card required).

---

## 🆓 **What's FREE (Spark Plan)**

### **1. Authentication** ✅
- **Email/Password sign-in:** **UNLIMITED** and **FREE**
- **Anonymous sign-in:** **UNLIMITED** and **FREE**
- **Google sign-in:** **FREE** (if you want to add it later)

**What you need:** Email/Password ✅ **100% FREE**

---

### **2. Cloud Firestore (Database)** ✅
**Free Tier Limits:**
- **Storage:** 1 GB (1,024 MB)
- **Document Reads:** 50,000 per day
- **Document Writes:** 20,000 per day
- **Document Deletes:** 20,000 per day
- **Outbound Data Transfer:** 10 GB per month

**What you need:**
- Store food items (~15 items = ~50 KB)
- Store user profiles (~1 KB per user)
- Store orders (~2-5 KB per order)

**Example Usage:**
- 100 users = ~100 KB
- 1,000 orders = ~3-5 MB
- 15 food items = ~50 KB
- **Total: ~5-10 MB** (well under 1 GB limit!)

**Daily Operations:**
- 100 users browsing menu = ~500 reads/day
- 50 orders placed = ~50 writes/day
- **Well under 50,000 reads and 20,000 writes!**

✅ **100% FREE for development and small-medium usage**

---

### **3. Cloud Storage (Images)** ⚠️
**IMPORTANT:** Cloud Storage requires **Blaze plan** (pay-as-you-go), which requires a **credit card**.

**Free Tier Limits (on Blaze plan):**
- **Storage:** 5 GB
- **Downloads:** 1 GB per day
- **Uploads:** 20,000 per day

**What you need:**
- Food item images (~100-500 KB each)
- Restaurant logo/cover (~500 KB - 2 MB)

**Example Usage:**
- 15 food items × 300 KB = ~4.5 MB
- Restaurant assets = ~2 MB
- **Total: ~7 MB** (well under 5 GB!)

⚠️ **Requires credit card** (but free if you stay within limits)

---

### **4. Hosting (Optional - Not Required)**
- **Storage:** 10 GB
- **Data Transfer:** 360 MB per day
- **Custom Domain:** FREE

**Note:** You're using Expo, so you don't need Firebase Hosting.

---

## 💰 **What Costs Money (You DON'T Need)**

### **Phone Authentication**
- Not included in free tier
- **You're using Email/Password, so this doesn't apply** ✅

### **Cloud Functions**
- Requires Blaze plan (pay-as-you-go)
- **You're not using Cloud Functions** ✅
- (Stripe payment processing is done client-side in test mode)

### **Cloud Messaging (Push Notifications)**
- Free tier available
- **You're not using this** ✅

---

## 📊 **Real-World Usage Estimate**

### **Small Restaurant App (Your Use Case):**
- **Users:** 50-200 users
- **Orders:** 100-500 orders/month
- **Food Items:** 15-50 items
- **Images:** 20-30 images

**Estimated Usage:**
- **Firestore Storage:** ~10-20 MB (1% of 1 GB limit)
- **Daily Reads:** ~1,000-2,000 (2-4% of 50,000 limit)
- **Daily Writes:** ~20-50 (0.1-0.25% of 20,000 limit)
- **Storage:** ~10-15 MB (0.2-0.3% of 5 GB limit)

**Result:** ✅ **You'll use less than 5% of free tier limits!**

---

## 🚨 **When You Might Need to Pay**

### **Scenario 1: Very High Traffic**
If your app becomes very popular:
- More than 50,000 database reads per day
- More than 20,000 writes per day
- More than 1 GB of database storage

**Likelihood:** Very low for a restaurant app
**Cost if exceeded:** Pay only for what you use beyond free tier

### **Scenario 2: Many Images**
If you upload hundreds of high-resolution images:
- More than 5 GB of storage
- More than 1 GB downloads per day

**Likelihood:** Low (restaurant menus don't need hundreds of images)
**Cost if exceeded:** ~$0.026 per GB/month for storage

### **Scenario 3: Large User Base**
If you have thousands of active users:
- More than 1 GB of database storage
- High read/write volumes

**Likelihood:** Low initially
**Cost if exceeded:** Pay-as-you-go pricing (very reasonable)

---

## 💡 **Cost Management Tips**

### **1. Monitor Usage**
- Firebase Console → Usage and Billing
- Set up billing alerts (free, even on Spark plan)
- Get notified if you approach limits

### **2. Optimize Queries**
- Use indexes efficiently
- Cache data when possible
- Batch operations when possible

### **3. Image Optimization**
- Compress images before uploading
- Use appropriate image sizes
- Consider WebP format for smaller file sizes

---

## ⚠️ **IMPORTANT: Storage Requires Credit Card**

**Firebase Storage** requires upgrading to **Blaze plan**, which requires a credit card. However:
- ✅ You won't be charged if you stay within free tier limits (5 GB storage, 1 GB downloads/day)
- ✅ You only pay if you exceed the free tier
- ⚠️ Credit card is required to enable Storage (even for free tier)

**Recommended:** Use **Cloudinary** for images instead — free tier, **no credit card required.** See `FREE_IMAGE_STORAGE.md`. Use Firebase for Auth + Firestore only.

### **When to Worry:**
- If you have 10,000+ daily active users
- If you're storing millions of documents
- If you're serving hundreds of thousands of images

**For development, testing, and small-medium production use: You're 100% covered on the free tier!** 🎉

---

## 📋 **Setup Reminder**

When creating your Firebase project:
1. **Choose Spark Plan** (free tier) — This is the default
2. **No credit card required** — Use Firebase for Auth + Firestore only
3. **Images** — Use **Cloudinary** (free, no credit card). See `FREE_IMAGE_STORAGE.md`

---

## 🔗 **Official Firebase Pricing**

For the most up-to-date pricing information:
- [Firebase Pricing Page](https://firebase.google.com/pricing)
- [Firestore Pricing](https://firebase.google.com/docs/firestore/pricing)
- [Storage Pricing](https://firebase.google.com/docs/storage/pricing)

---

## ✅ **Summary**

**Question:** Is everything free?
**Answer:** Mostly YES, but Storage requires credit card ⚠️

- ✅ Authentication (Email/Password) - **FREE & UNLIMITED** (no credit card)
- ✅ Firestore Database - **FREE** (generous limits, no credit card)
- ⚠️ Cloud Storage - **FREE tier available** but requires **credit card** to enable
- ✅ All other services - **FREE**

**Recommended setup (no credit card):**
- **Firebase** — Auth + Firestore (Spark plan, free)
- **Cloudinary** — Image storage (free tier, no credit card). See `FREE_IMAGE_STORAGE.md`

---

**Note:** If your app becomes very successful and exceeds free tier limits, Firebase's pay-as-you-go pricing is very reasonable (you only pay for what you use beyond the free tier).

