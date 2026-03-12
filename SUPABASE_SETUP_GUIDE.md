# Supabase Setup Guide - 100% Free, No Credit Card Required

This comprehensive guide will walk you through setting up Supabase for your restaurant app. **Everything in this guide uses the free tier - no credit card required!**

## 📋 Table of Contents
1. [Why Supabase?](#1-why-supabase)
2. [Free Tier Overview](#2-free-tier-overview)
3. [Creating Your Supabase Project](#3-creating-your-supabase-project)
4. [Database Setup](#4-database-setup)
5. [Storage Setup](#5-storage-setup)
6. [Authentication Setup](#6-authentication-setup)
7. [Environment Variables](#7-environment-variables)
8. [Installing Supabase Client](#8-installing-supabase-client)
9. [Code Integration](#9-code-integration)
10. [Migration from Static Data](#10-migration-from-static-data)
11. [Testing Your Setup](#11-testing-your-setup)
12. [Security & Row Level Security](#12-security--row-level-security)

---

## 1. Why Supabase?

### ✅ **100% Free Tier Benefits:**
- ✅ **No credit card required** - Sign up and start using immediately
- ✅ **500 MB database** - More than enough for your restaurant app
- ✅ **1 GB file storage** - Perfect for food images
- ✅ **2 GB bandwidth/month** - Plenty for your needs
- ✅ **Unlimited API requests** - No rate limits
- ✅ **Unlimited users** - No user limits
- ✅ **PostgreSQL database** - Powerful SQL database
- ✅ **Real-time subscriptions** - Built-in real-time features
- ✅ **Built-in authentication** - Email/Password, OAuth, etc.

### **Perfect for Your Restaurant App:**
- 15 food items = ~50 KB (0.01% of 500 MB) ✅
- 1,000 orders = ~3-5 MB (1% of 500 MB) ✅
- 100 users = ~100 KB (0.02% of 500 MB) ✅
- Images = ~5-10 MB (1% of 1 GB) ✅

**You'll use less than 2% of free tier limits!** 🎉

---

## 2. Free Tier Overview

### **Database (PostgreSQL)**
- **Storage:** 500 MB
- **Bandwidth:** 2 GB egress/month
- **Database Size:** 500 MB
- **API Requests:** Unlimited
- **Concurrent Connections:** 60

### **Storage (File Storage)**
- **Storage:** 1 GB
- **File Uploads:** 1 GB bandwidth/month
- **File Transformations:** 2 GB/month
- **Files:** Unlimited

### **Authentication**
- **Users:** Unlimited
- **Email/Password:** FREE
- **Social Auth:** FREE (Google, GitHub, etc.)
- **SMS Auth:** Not included (requires paid plan)

### **Edge Functions**
- **Invocations:** 500,000/month
- **Execution Time:** 2 million GB-seconds/month

### **Realtime**
- **Concurrent Connections:** 200
- **Messages:** 2 million/month

**All of this is FREE - no credit card required!** ✅

---

## 3. Creating Your Supabase Project

### Step 1: Sign Up for Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** (top right)
3. Sign up with:
   - **GitHub** (recommended - easiest)
   - **Email** (alternative)
4. Verify your email if using email signup

### Step 2: Create a New Project

1. After signing in, click **"New Project"**
2. Fill in the form:
   - **Name:** `restaurant-app` (or your preferred name)
   - **Database Password:** 
     - Create a strong password (save this!)
     - You'll need it for database connections
     - **Example:** `MyRestaurantApp2024!Secure`
   - **Region:** Choose closest to you:
     - `US East (North Virginia)` - US
     - `US West (Oregon)` - US West
     - `EU West (Ireland)` - Europe
     - `Asia Pacific (Singapore)` - Asia
     - `Asia Pacific (Tokyo)` - Japan
3. Click **"Create new project"**
4. Wait 2-3 minutes for project setup

### Step 3: Get Your API Keys

1. Once project is ready, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (for client-side)
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

3. **Copy these values** - you'll need them for `.env` file

**⚠️ Important:**
- **anon key** = Safe to use in client-side code (React Native app)
- **service_role key** = NEVER expose in client - only for server-side

---

## 4. Database Setup

### Step 1: Create Database Tables

1. Go to **Table Editor** in the left sidebar
2. Click **"New table"**

#### **Table 1: `users` (User Profiles)**

1. Click **"New table"**
2. Name: `users`
3. Click **"Add column"** for each:

| Column Name | Type | Default | Nullable | Description |
|------------|------|---------|----------|-------------|
| `id` | uuid | `gen_random_uuid()` | ❌ | Primary key |
| `uid` | text | - | ❌ | Firebase Auth UID (for compatibility) |
| `email` | text | - | ❌ | User email |
| `name` | text | - | ❌ | Full name |
| `phone` | text | - | ✅ | Phone number |
| `address` | jsonb | - | ✅ | Address object |
| `is_admin` | boolean | `false` | ❌ | Admin flag |
| `created_at` | timestamptz | `now()` | ❌ | Created timestamp |
| `updated_at` | timestamptz | `now()` | ❌ | Updated timestamp |

4. Click **"Save"**

**SQL Alternative (if you prefer SQL):**
```sql
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
```

#### **Table 2: `food_items`**

1. Click **"New table"**
2. Name: `food_items`
3. Add columns:

| Column Name | Type | Default | Nullable | Description |
|------------|------|---------|----------|-------------|
| `id` | uuid | `gen_random_uuid()` | ❌ | Primary key |
| `title` | text | - | ❌ | Food name |
| `sub` | text | - | ❌ | Subtitle/description |
| `img` | text | - | ✅ | Image URL |
| `category` | text | - | ❌ | Category (Starters, Mains, etc.) |
| `price` | numeric(10,2) | - | ❌ | Price |
| `description` | text | - | ❌ | Full description |
| `ingredients` | text[] | - | ✅ | Array of ingredients |
| `extras` | jsonb | - | ✅ | Extras array |
| `is_available` | boolean | `true` | ❌ | Availability |
| `created_at` | timestamptz | `now()` | ❌ | Created timestamp |
| `updated_at` | timestamptz | `now()` | ❌ | Updated timestamp |

4. Click **"Save"**

**SQL Alternative:**
```sql
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
```

#### **Table 3: `orders`**

1. Click **"New table"**
2. Name: `orders`
3. Add columns:

| Column Name | Type | Default | Nullable | Description |
|------------|------|---------|----------|-------------|
| `id` | uuid | `gen_random_uuid()` | ❌ | Primary key |
| `user_id` | uuid | - | ❌ | Foreign key to users |
| `customer_name` | text | - | ❌ | Customer name |
| `customer_email` | text | - | ❌ | Customer email |
| `customer_phone` | text | - | ✅ | Customer phone |
| `items` | jsonb | - | ❌ | Order items array |
| `subtotal` | numeric(10,2) | - | ❌ | Subtotal |
| `delivery_fee` | numeric(10,2) | - | ❌ | Delivery fee |
| `total` | numeric(10,2) | - | ❌ | Total |
| `status` | text | `'pending'` | ❌ | Order status |
| `delivery_address` | text | - | ❌ | Delivery address |
| `payment_method` | text | - | ❌ | Payment method |
| `payment_intent_id` | text | - | ✅ | Stripe payment ID |
| `created_at` | timestamptz | `now()` | ❌ | Created timestamp |
| `updated_at` | timestamptz | `now()` | ❌ | Updated timestamp |

4. Click **"Save"**

**SQL Alternative:**
```sql
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
```

#### **Table 4: `restaurant_info` (Single Row)**

1. Click **"New table"**
2. Name: `restaurant_info`
3. Add columns:

| Column Name | Type | Default | Nullable | Description |
|------------|------|---------|----------|-------------|
| `id` | uuid | `gen_random_uuid()` | ❌ | Primary key |
| `name` | text | - | ❌ | Restaurant name |
| `description` | text | - | ❌ | Description |
| `address` | text | - | ❌ | Address |
| `phone` | text | - | ❌ | Phone |
| `email` | text | - | ❌ | Email |
| `opening_hours` | jsonb | - | ❌ | Opening hours |
| `delivery_fee` | numeric(10,2) | - | ❌ | Delivery fee |
| `minimum_order` | numeric(10,2) | - | ❌ | Minimum order |
| `logo` | text | - | ✅ | Logo URL |
| `cover_image` | text | - | ✅ | Cover image URL |
| `updated_at` | timestamptz | `now()` | ❌ | Updated timestamp |

4. Click **"Save"**

### Step 2: Create Indexes (Optional but Recommended)

Go to **SQL Editor** and run:

```sql
-- Index for faster queries
CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

---

## 5. Storage Setup

### Step 1: Create Storage Buckets

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**

#### **Bucket 1: `food-images`**

1. Click **"New bucket"**
2. Name: `food-images`
3. **Public bucket:** ✅ **Enable** (so images can be viewed)
4. Click **"Create bucket"**

#### **Bucket 2: `restaurant-assets`**

1. Click **"New bucket"** again
2. Name: `restaurant-assets`
3. **Public bucket:** ✅ **Enable**
4. Click **"Create bucket"**

### Step 2: Set Storage Policies (Security)

1. Click on `food-images` bucket
2. Go to **"Policies"** tab
3. Click **"New policy"**

**Policy 1: Allow public read access**
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Policy definition:
```sql
true
```
- Click **"Review"** → **"Save policy"**

**Policy 2: Allow authenticated users to upload**
- Policy name: `Authenticated upload`
- Allowed operation: `INSERT`
- Policy definition:
```sql
auth.role() = 'authenticated'
```
- Click **"Review"** → **"Save policy"**

**Policy 3: Allow admins to delete**
- Policy name: `Admin delete`
- Allowed operation: `DELETE`
- Policy definition:
```sql
EXISTS (
  SELECT 1 FROM users 
  WHERE users.uid = auth.uid() 
  AND users.is_admin = true
)
```
- Click **"Review"** → **"Save policy"**

Repeat for `restaurant-assets` bucket.

---

## 6. Authentication Setup

### Step 1: Enable Email/Password Auth

1. Go to **Authentication** → **Providers**
2. Find **"Email"** provider
3. **Enable Email provider:** ✅ Toggle ON
4. **Confirm email:** ❌ Toggle OFF (for development)
5. Click **"Save"**

### Step 2: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize templates if needed (or use defaults)

### Step 3: Set Up Row Level Security (RLS)

Go to **SQL Editor** and run:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_info ENABLE ROW LEVEL SECURITY;

-- Users: Users can read their own profile, update their own
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = uid);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = uid);

-- Food items: Public read, admin write
CREATE POLICY "Food items are viewable by everyone" ON food_items
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert food items" ON food_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.uid = auth.uid()::text 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Only admins can update food items" ON food_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.uid = auth.uid()::text 
      AND users.is_admin = true
    )
  );

-- Orders: Users can read/write their own, admins can read/write all
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE uid = auth.uid()::text)
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.uid = auth.uid()::text 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE uid = auth.uid()::text)
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.uid = auth.uid()::text 
      AND users.is_admin = true
    )
  );

-- Restaurant info: Public read, admin write
CREATE POLICY "Restaurant info is viewable by everyone" ON restaurant_info
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update restaurant info" ON restaurant_info
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.uid = auth.uid()::text 
      AND users.is_admin = true
    )
  );
```

---

## 7. Environment Variables

### Step 1: Install dotenv (if not already installed)

```bash
cd restaurant-app-project
npm install dotenv
```

### Step 2: Create .env File

Create `.env` file in project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side operations (if needed)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Replace:**
- `xxxxx` with your project ID from Supabase
- `your-anon-key-here` with your anon/public key

### Step 3: Update .gitignore

Make sure `.env` is in `.gitignore` (it should already be there).

---

## 8. Installing Supabase Client

### Step 1: Install Supabase JS Client

```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Config File

Create `src/config/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export types for TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          uid: string;
          email: string;
          name: string;
          phone: string | null;
          address: any | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      food_items: {
        Row: {
          id: string;
          title: string;
          sub: string;
          img: string | null;
          category: string;
          price: number;
          description: string;
          ingredients: string[] | null;
          extras: any | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          items: any;
          subtotal: number;
          delivery_fee: number;
          total: number;
          status: string;
          delivery_address: string;
          payment_method: string;
          payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      restaurant_info: {
        Row: {
          id: string;
          name: string;
          description: string;
          address: string;
          phone: string;
          email: string;
          opening_hours: any;
          delivery_fee: number;
          minimum_order: number;
          logo: string | null;
          cover_image: string | null;
          updated_at: string;
        };
      };
    };
  };
};
```

---

## 9. Code Integration

### Step 1: Update Service Files

I'll help you create Supabase service files. Here's the structure:

#### **Auth Service** (`src/services/authService.ts`)

```typescript
import { supabase } from '../config/supabase';
import { UserProfile } from '../store/slices/authSlice';
import { User } from '@supabase/supabase-js';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<User> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          uid: authData.user.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          address: data.address,
          is_admin: false,
        });

      if (profileError) throw profileError;

      return authData.user;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      return data.user;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', uid)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        uid: data.uid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
        isAdmin: data.is_admin,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.address) updateData.address = updates.address;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('uid', uid);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  },
};
```

#### **Food Service** (`src/services/foodService.ts`)

```typescript
import { supabase } from '../config/supabase';
import { FoodItem } from '../types';

export const foodService = {
  async getAllFoodItems(): Promise<FoodItem[]> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        sub: item.sub,
        img: item.img || '',
        category: item.category as any,
        price: parseFloat(item.price),
        description: item.description,
        ingredients: item.ingredients || [],
        extras: item.extras || [],
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch food items');
    }
  },

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        sub: data.sub,
        img: data.img || '',
        category: data.category as any,
        price: parseFloat(data.price),
        description: data.description,
        ingredients: data.ingredients || [],
        extras: data.extras || [],
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch food item');
    }
  },

  async createFoodItem(item: Omit<FoodItem, 'id'>, imageUri?: string): Promise<FoodItem> {
    try {
      let imageUrl = item.img;

      // Upload image if provided
      if (imageUri) {
        imageUrl = await this.uploadFoodImage(imageUri, `food_${Date.now()}`);
      }

      const { data, error } = await supabase
        .from('food_items')
        .insert({
          title: item.title,
          sub: item.sub,
          img: imageUrl,
          category: item.category,
          price: item.price,
          description: item.description,
          ingredients: item.ingredients,
          extras: item.extras,
          is_available: true,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        sub: data.sub,
        img: data.img || '',
        category: data.category as any,
        price: parseFloat(data.price),
        description: data.description,
        ingredients: data.ingredients || [],
        extras: data.extras || [],
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create food item');
    }
  },

  async updateFoodItem(id: string, updates: Partial<FoodItem>, imageUri?: string): Promise<void> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.sub) updateData.sub = updates.sub;
      if (updates.category) updateData.category = updates.category;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.description) updateData.description = updates.description;
      if (updates.ingredients) updateData.ingredients = updates.ingredients;
      if (updates.extras) updateData.extras = updates.extras;

      if (imageUri) {
        updateData.img = await this.uploadFoodImage(imageUri, `food_${id}_${Date.now()}`);
      }

      const { error } = await supabase
        .from('food_items')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update food item');
    }
  },

  async deleteFoodItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete food item');
    }
  },

  async uploadFoodImage(uri: string, filename: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExt = uri.split('.').pop();
      const filePath = `${filename}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('food-images')
        .upload(filePath, blob, {
          contentType: blob.type,
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('food-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload image');
    }
  },
};
```

#### **Order Service** (`src/services/orderService.ts`)

```typescript
import { supabase } from '../config/supabase';
import { Order, OrderStatus } from '../types';

export const orderService = {
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      // Get user_id from users table
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('uid', order.userId)
        .single();

      if (!userData) throw new Error('User not found');

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userData.id,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
          items: order.items,
          subtotal: order.subtotal,
          delivery_fee: order.deliveryFee,
          total: order.total,
          status: order.status,
          delivery_address: order.deliveryAddress,
          payment_method: order.paymentMethod,
          payment_intent_id: order.paymentIntentId,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: order.userId,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        items: data.items,
        subtotal: parseFloat(data.subtotal),
        deliveryFee: parseFloat(data.delivery_fee),
        total: parseFloat(data.total),
        status: data.status as OrderStatus,
        deliveryAddress: data.delivery_address,
        paymentMethod: data.payment_method,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create order');
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('uid', userId)
        .single();

      if (!userData) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(order => ({
        id: order.id,
        userId,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        items: order.items,
        subtotal: parseFloat(order.subtotal),
        deliveryFee: parseFloat(order.delivery_fee),
        total: parseFloat(order.total),
        status: order.status as OrderStatus,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users!inner(uid)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(order => ({
        id: order.id,
        userId: order.users.uid,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        items: order.items,
        subtotal: parseFloat(order.subtotal),
        deliveryFee: parseFloat(order.delivery_fee),
        total: parseFloat(order.total),
        status: order.status as OrderStatus,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update order status');
    }
  },
};
```

---

## 10. Migration from Static Data

### Step 1: Create Migration Script

Create `scripts/migrate-to-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { FOOD_ITEMS } from '../src/data/foodItems';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateFoodItems() {
  console.log('🚀 Starting food items migration...\n');

  for (const item of FOOD_ITEMS) {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert({
          title: item.title,
          sub: item.sub,
          img: item.img || null,
          category: item.category,
          price: item.price,
          description: item.description,
          ingredients: item.ingredients,
          extras: item.extras || null,
          is_available: true,
        })
        .select()
        .single();

      if (error) throw error;
      console.log(`✅ Migrated: ${item.title}`);
    } catch (error: any) {
      console.error(`❌ Error migrating ${item.title}:`, error.message);
    }
  }

  console.log('\n✨ Migration completed!');
}

async function createRestaurantInfo() {
  console.log('\n🏪 Creating restaurant info...\n');

  try {
    const { error } = await supabase
      .from('restaurant_info')
      .insert({
        name: 'Bon Appetit',
        description: 'Exquisite Dining Experience',
        address: '123 Restaurant Street, City, 12345',
        phone: '+1 (555) 123-4567',
        email: 'info@bonappetit.com',
        opening_hours: {
          monday: { open: '11:00', close: '22:00', closed: false },
          tuesday: { open: '11:00', close: '22:00', closed: false },
          wednesday: { open: '11:00', close: '22:00', closed: false },
          thursday: { open: '11:00', close: '22:00', closed: false },
          friday: { open: '11:00', close: '23:00', closed: false },
          saturday: { open: '11:00', close: '23:00', closed: false },
          sunday: { open: '12:00', close: '21:00', closed: false },
        },
        delivery_fee: 25.00,
        minimum_order: 50.00,
      });

    if (error) throw error;
    console.log('✅ Restaurant info created!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  await migrateFoodItems();
  await createRestaurantInfo();
}

main();
```

### Step 2: Run Migration

```bash
npx ts-node scripts/migrate-to-supabase.ts
```

---

## 11. Testing Your Setup

### Test 1: Verify Connection
1. Start your app: `npm start`
2. Check console for errors
3. Should connect to Supabase successfully

### Test 2: Test Authentication
1. Try registering a new user
2. Check Supabase → Authentication → Users
3. Should see new user

### Test 3: Test Database
1. Check Supabase → Table Editor
2. Should see data in tables

### Test 4: Test Storage
1. Try uploading an image
2. Check Supabase → Storage
3. Should see uploaded file

---

## 12. Security & Row Level Security

### Important Security Notes:

1. **Row Level Security (RLS)** is enabled on all tables
2. **Policies** control who can read/write data
3. **Storage policies** control file access
4. **Never expose service_role key** in client code

### Creating Admin User:

1. Register a user through your app
2. Go to Supabase → Table Editor → `users`
3. Find your user
4. Edit → Set `is_admin` to `true`
5. Save

---

## ✅ **Summary**

You now have:
- ✅ Supabase project set up (100% free)
- ✅ Database tables created
- ✅ Storage buckets configured
- ✅ Authentication enabled
- ✅ Security policies in place
- ✅ Code integrated
- ✅ Migration script ready

**Everything is FREE - no credit card required!** 🎉

---

## 🔗 **Resources**

- [Supabase Docs](https://supabase.com/docs)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Pricing](https://supabase.com/pricing) (Free tier details)

---

**Next Steps:**
1. Run the migration script
2. Test your app
3. Create an admin user
4. Start building! 🚀

