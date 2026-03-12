# Quick Start: Supabase Setup (100% Free)

## 🚀 Quick Setup Steps (20 minutes)

### 1. Create Supabase Account (2 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with **GitHub** (easiest) or **Email**
4. Verify email if needed

### 2. Create Project (3 minutes)

1. Click **"New Project"**
2. Fill in:
   - **Name:** `restaurant-app`
   - **Database Password:** Create strong password (save it!)
   - **Region:** Choose closest to you
3. Click **"Create new project"**
4. Wait 2-3 minutes

### 3. Get API Keys (1 minute)

1. Go to **Settings** (⚙️) → **API**
2. Copy:
   - **Project URL** (`https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 4. Create Database Tables (5 minutes)

Go to **SQL Editor** and run this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address JSONB,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Food items table
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sub TEXT NOT NULL,
  img TEXT,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT[],
  extras JSONB,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Restaurant info table
CREATE TABLE restaurant_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  opening_hours JSONB NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL,
  minimum_order NUMERIC(10,2) NOT NULL,
  logo TEXT,
  cover_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

Click **"Run"** ✅

### 5. Enable Row Level Security (2 minutes)

Run this SQL in **SQL Editor**:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_info ENABLE ROW LEVEL SECURITY;

-- Food items: Public read
CREATE POLICY "Food items are viewable by everyone" ON food_items
  FOR SELECT USING (true);

-- Restaurant info: Public read
CREATE POLICY "Restaurant info is viewable by everyone" ON restaurant_info
  FOR SELECT USING (true);
```

Click **"Run"** ✅

### 6. Create Storage Buckets (2 minutes)

1. Go to **Storage** in sidebar
2. Click **"New bucket"**
3. Name: `food-images`
4. **Public bucket:** ✅ Enable
5. Click **"Create bucket"**

Repeat for `restaurant-assets` bucket.

### 7. Enable Authentication (1 minute)

1. Go to **Authentication** → **Providers**
2. Find **"Email"**
3. **Enable Email provider:** ✅ Toggle ON
4. **Confirm email:** ❌ Toggle OFF (for development)
5. Click **"Save"**

### 8. Install Dependencies (1 minute)

```bash
cd restaurant-app-project
npm install @supabase/supabase-js
```

### 9. Create Environment File (2 minutes)

Create `.env` file in project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 3.

### 10. Create Supabase Config (1 minute)

Create `src/config/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API keys copied
- [ ] Database tables created
- [ ] Storage buckets created
- [ ] Authentication enabled
- [ ] `.env` file created
- [ ] Supabase client installed
- [ ] Config file created

---

## 🚨 Troubleshooting

**"Missing Supabase environment variables"**
→ Check `.env` file has correct values

**"Permission denied"**
→ Check Row Level Security policies are set up

**"Cannot find module @supabase/supabase-js"**
→ Run `npm install @supabase/supabase-js`

---

## 📚 Next Steps

1. See `SUPABASE_SETUP_GUIDE.md` for detailed instructions
2. Update service files to use Supabase
3. Run migration script to import food items
4. Test your app!

---

**Total Setup Time: ~20 minutes** ⏱️

**Everything is FREE - no credit card required!** ✅

