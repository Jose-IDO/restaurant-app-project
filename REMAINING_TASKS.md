# Remaining Tasks & What's Still Missing

## ✅ **COMPLETED**

1. ✅ Order History Screen - Created with full UI
2. ✅ Stripe Integration - Demo/test mode integrated in CheckoutScreen
3. ✅ Image Upload - Admin can upload images via expo-image-picker to Firebase Storage
4. ✅ Removed Hardcoded Images - All image URLs removed from foodItems.ts
5. ✅ Error Handling - LoadingSpinner and ErrorMessage components created
6. ✅ Redux Store - Complete setup with all slices (auth, cart, food, orders)
7. ✅ Service Layer - All Firebase services created (auth, food, orders, restaurant, stripe)

---

## ⚠️ **STILL MISSING / NEEDS WORK**

### **1. Connect Screens to Redux (HIGH PRIORITY)**

**Status:** Partially done - Navigation uses Redux, but screens don't fetch/update data

**What's needed:**
- ✅ Navigation connected to Redux auth state
- ❌ HomeScreen - Fetch food items from Redux/Firebase
- ❌ LoginScreen - Connect to authService and Redux
- ❌ RegisterScreen - Connect to authService and Redux
- ❌ Cart screens - Connect to Redux cart slice
- ❌ Profile screens - Fetch user data from Redux/Firebase
- ❌ Order History - Fetch orders from Redux/Firebase
- ❌ Admin screens - Connect to Redux/Firebase for data operations

**Files to update:**
- `src/screens/auth/LoginScreen.tsx` - Add Redux dispatch for login
- `src/screens/auth/RegisterScreen.tsx` - Add Redux dispatch for register
- `src/screens/main/HomeScreen.tsx` - Use `useAppSelector` for food items
- `src/screens/main/CartWithItemsScreen.tsx` - Use Redux cart state
- `src/screens/main/ProfileLoggedInScreen.tsx` - Use Redux user profile
- `src/screens/main/OrderHistoryScreen.tsx` - Fetch from Redux/Firebase
- All admin screens - Connect to Redux/Firebase

---

### **2. Firebase Environment Variables (CRITICAL)**

**Status:** Not configured

**What's needed:**
- Create `.env` file or set environment variables:
  ```
  EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
  EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
  ```

**Action required:**
- User needs to create Firebase project
- Get Firebase config from Firebase Console
- Add to environment variables

---

### **3. Firebase Collections Setup (CRITICAL)**

**Status:** Collections not created in Firestore

**What's needed:**
- Create Firestore collections:
  - `users` - User profiles
  - `foodItems` - Menu items
  - `orders` - Customer orders
  - `restaurantInfo` - Restaurant settings (single document)

**Action required:**
- User needs to set up Firestore in Firebase Console
- Create collections (they'll be created automatically on first write, but structure should be documented)
- Set up Firestore security rules (see FIREBASE_INTEGRATION_PLAN.md)

---

### **4. Firebase Storage Setup (CRITICAL)**

**Status:** Storage bucket not configured

**What's needed:**
- Enable Firebase Storage
- Create storage buckets:
  - `food-images/` - For food item images
  - `restaurant-assets/` - For restaurant logo/cover

**Action required:**
- User needs to enable Storage in Firebase Console
- Set up Storage security rules

---

### **5. Stripe Backend Integration (IMPORTANT)**

**Status:** Frontend only - No backend API

**What's needed:**
- Backend API endpoint to create payment intents
- Currently using mock payment intent in `stripeService.ts`
- Need actual Stripe secret key on backend

**Current limitation:**
- `stripeService.createPaymentIntent()` uses mock data
- Real implementation requires backend API call

**Action required:**
- Create backend API (Node.js/Express or similar)
- Implement `/create-payment-intent` endpoint
- Use Stripe secret key on backend (never expose in frontend)

---

### **6. Real-time Data Updates (NICE TO HAVE)**

**Status:** Not implemented

**What's needed:**
- Use Firestore real-time listeners (`onSnapshot`)
- Update Redux state when data changes
- Real-time order status updates for admin

**Files to update:**
- `src/services/foodService.ts` - Add real-time listeners
- `src/services/orderService.ts` - Add real-time listeners
- Connect listeners to Redux actions

---

### **7. Image Display Fallback (IMPORTANT)**

**Status:** Images removed but no fallback UI

**What's needed:**
- Add placeholder image when `img` is empty
- Show "No image" placeholder in HomeScreen and FoodItemDetailScreen
- Better UX when images haven't been uploaded yet

**Files to update:**
- `src/screens/main/HomeScreen.tsx` - Add placeholder
- `src/screens/main/FoodItemDetailScreen.tsx` - Add placeholder
- `src/screens/admin/AdminFoodManagementScreen.tsx` - Already has upload UI

---

### **8. Form Validation (IMPORTANT)**

**Status:** Basic validation only

**What's needed:**
- Email validation in Login/Register
- Password strength validation
- Required field validation
- Price validation (must be positive number)
- Image validation (must be selected for new items)

**Files to update:**
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/RegisterScreen.tsx`
- `src/screens/admin/AdminFoodManagementScreen.tsx`
- `src/screens/admin/AdminRestaurantSettingsScreen.tsx`

---

### **9. Loading States Throughout App (IMPORTANT)**

**Status:** Partially implemented

**What's needed:**
- Add LoadingSpinner to all async operations:
  - Login/Register
  - Fetching food items
  - Placing orders
  - Admin operations

**Files to update:**
- All screens with async operations

---

### **10. Error Recovery (NICE TO HAVE)**

**Status:** Basic error display only

**What's needed:**
- Retry mechanisms for failed operations
- Network error detection
- Offline mode handling
- Better error messages

---

### **11. Payment Method Management (MISSING)**

**Status:** Not implemented

**What's needed:**
- Screen to add/edit payment methods
- Save payment methods to user profile
- Select payment method in checkout
- Currently just shows "No payment method saved"

**Files to create:**
- `src/screens/main/PaymentMethodsScreen.tsx`

---

### **12. Address Management (MISSING)**

**Status:** Not implemented

**What's needed:**
- Screen to add/edit delivery addresses
- Save multiple addresses
- Select address in checkout
- Currently just shows "No address saved"

**Files to create:**
- `src/screens/main/AddressManagementScreen.tsx`

---

## 📋 **SUMMARY: What You Still Need to Do**

### **Before Firebase Integration Works:**

1. **Set up Firebase Project:**
   - Create Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Get config values

2. **Add Environment Variables:**
   - Add Firebase config to `.env` or environment
   - Add Stripe publishable key

3. **Set up Firestore Collections:**
   - Collections will auto-create, but set up security rules
   - See `FIREBASE_INTEGRATION_PLAN.md` for rules

4. **Connect Screens to Redux:**
   - Update all screens to use Redux hooks
   - Replace hardcoded data with Redux state
   - Add data fetching on screen load

### **For Full Functionality:**

5. **Create Stripe Backend API** (or use Stripe test mode with mock)
6. **Add form validation**
7. **Add loading states everywhere**
8. **Create Payment Methods screen**
9. **Create Address Management screen**
10. **Add image placeholders**

---

## 🎯 **PRIORITY ORDER**

1. **CRITICAL (Block Firebase):**
   - Firebase project setup
   - Environment variables
   - Connect screens to Redux

2. **IMPORTANT (Core features):**
   - Form validation
   - Loading states
   - Image placeholders
   - Payment/Address management screens

3. **NICE TO HAVE:**
   - Real-time updates
   - Error recovery
   - Offline mode

---

## ✅ **READY FOR FIREBASE**

- All UI screens complete
- Redux store set up
- Service layer ready
- Firebase config structure ready
- Types defined
- Error handling components ready

**Next Step:** Set up Firebase project and connect screens to Redux/Firebase!

