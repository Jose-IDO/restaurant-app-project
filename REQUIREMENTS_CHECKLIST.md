# Task Requirements vs Current App — What’s Left to Do

This checklist maps the **task requirements** to the codebase. Items are marked **Done**, **Partial**, or **To do**.

---

## Summary

| Status   | Count |
|----------|--------|
| **Done** | 18    |
| **Partial** | 6  |
| **To do** | 14   |

**Rough total: 14–20 distinct things** still need work (some “to do” items are small, some are larger features).

---

## 1. Registration

| Requirement | Status | Notes |
|-------------|--------|--------|
| Register with at least one sign-in (e.g. email/password) | ✅ Done | Email/password in `RegisterScreen` + Firebase |
| Contact details: Name | ✅ Done | First + Last name |
| Contact details: Surname | ✅ Done | As “Last name” |
| Contact details: Contact number | ✅ Done | Phone field |
| Contact details: Address | ✅ Done | Street, city, state, zip |
| Contact details: Card details (can use fake for testing) | ❌ To do | **Add card capture at registration** (e.g. Stripe Element or mock fields) |

---

## 2. Logging in

| Requirement | Status | Notes |
|-------------|--------|--------|
| Login with at least one provider (e.g. email/password) | ✅ Done | `LoginScreen` + Firebase |

---

## 3. Profile

| Requirement | Status | Notes |
|-------------|--------|--------|
| Only registered users have access to profile | ✅ Done | Profile tab shows login or profile |
| **Update** name | ❌ To do | Profile is **view-only**; need Edit Profile screen + save to Firestore |
| **Update** email | ❌ To do | Same |
| **Update** address | ❌ To do | Same |
| **Update** contact number | ❌ To do | Same |
| **Update** card details | ❌ To do | Same + payment method storage/display |
| Profile connected to orders (UID, name, contact with submission) | ✅ Done | `orderService.createOrder` uses `userId`, `customerName`, `customerEmail`, `customerPhone` |

---

## 4. Viewing food menus (Home)

| Requirement | Status | Notes |
|-------------|--------|--------|
| All users can browse foods | ✅ Done | Home loads from Firestore |
| Food divided by type (e.g. Dessert, Beverages, Burgers, Mains, Starters) | ✅ Partial | Current: Starters, Mains, Desserts, Drinks, Sides. No “Alcohols” or “Burgers” category; add or rename if required |
| Show: name, description (ingredients), price, image | ✅ Done | Home cards show title, sub, price, image |
| Button to View Item screen | ✅ Done | Card press → `FoodItemDetail` |

---

## 5. View Item screen

| Requirement | Status | Notes |
|-------------|--------|--------|
| Same details as home (name, description, price, image) | ✅ Done | |
| Add item to cart | ✅ Done | |
| **Side options** (e.g. pap, chips, salads – choose 1 or 2, price included) | ❌ To do | **Add side options** to `FoodItem` type + UI (select 1 or 2) |
| **Drink options** (included or add-on) | ❌ To do | **Add drink options** to item model + UI |
| **Extras** (add-ons that increase total) | ✅ Done | `extras` array + “Add Extras” in `FoodItemDetailScreen` |
| **Optional ingredients** to remove/add (e.g. no lettuce) | ❌ To do | **Add optional-ingredient toggles** (e.g. exclude/include) |
| Quantity | ✅ Done | Quantity selector + in cart |

---

## 6. Cart

| Requirement | Status | Notes |
|-------------|--------|--------|
| View current cart items | ✅ Done | `CartWithItemsScreen` |
| Edit quantity | ✅ Done | Per-item quantity controls |
| Remove single item | ✅ Done | Trash per row |
| **Navigate to edit extras for a chosen item** | ❌ To do | **From cart row, open View Item (or edit-cart-item) to change extras/sides** then update cart |
| Clear whole cart | ✅ Done | Clear button |
| Navigate to Checkout (registered only; prompt to sign-in for guests) | ✅ Partial | Checkout requires login and alerts; can add explicit “Sign in to checkout” on Checkout screen for guests |

---

## 7. Checkout

| Requirement | Status | Notes |
|-------------|--------|--------|
| **Change drop-off address** (default = profile address) | ❌ To do | **Implement “Edit address”** (modal or screen) and pass selected address into Checkout |
| See order total | ✅ Done | Subtotal, delivery, total |
| **Select/change card** | ❌ To do | **Implement “Edit payment”**: choose/add card (Stripe or saved methods) and show selected method |
| Button to place order | ✅ Done | Place Order → Stripe + Firestore |

---

## 8. Placing an order

| Requirement | Status | Notes |
|-------------|--------|--------|
| Order details saved to database | ✅ Done | `orderService.createOrder` → Firestore `orders` |
| Payment API/SDK (e.g. dev account) | ✅ Done | Stripe (test mode) |

---

## 9. Users not registered cannot make orders

| Requirement | Status | Notes |
|-------------|--------|--------|
| Block or prompt for registration/sign-in before placing order | ✅ Done | Checkout checks `user`/`userProfile` and alerts + navigates to Login |

---

## 10. Admin dashboard

| Requirement | Status | Notes |
|-------------|--------|--------|
| Separate admin dashboard | ✅ Done | Admin stack + `isAdmin` |
| Manage food items | ✅ Done | `AdminFoodManagementScreen` CRUD |
| Manage restaurant details | ✅ Done | `AdminRestaurantSettingsScreen` |
| Analyse and represent data in charts | ✅ Partial | `AdminAnalyticsScreen` has charts but **uses sample data**; **wire to real Firestore orders/revenue** |
| View order history | ✅ Done | `AdminOrdersScreen` + order list + status update |

---

## Remaining work — in order of importance

Do these in this order for the biggest impact and to satisfy the spec.

| # | Priority | Task | Why |
|---|----------|------|-----|
| 1 | **Critical** | **Checkout: change address** — Add a screen or modal to change delivery address (default = profile); wire the Edit button on Checkout. | Spec: "Users should be able to change the drop-off address." Without this, users can't complete orders to a different address. |
| 2 | **Critical** | **Checkout: select/change card** — Add UI to choose or add a payment method; show selected method on Checkout; wire the Edit payment button. | Spec: "Users should be able to select/change their card from this screen." Required to complete payment flow. |
| 3 | **Critical** | **Registration: card details** — Collect card details during sign-up (fake fields or Stripe test). | Spec: "Contact details should be requested during registration" including "Card details (You can use fake cards)." |
| 4 | **High** | **Profile: edit profile** — Add Edit Profile screen: update name, email, address, phone, card details; save to Firestore (and optionally Stripe for cards). | Spec: "Users should be able to update" name, email, address, contact number, card details. Currently profile is view-only. |
| 5 | **High** | **View Item: side options** — Add side options to `FoodItem` (e.g. pap, chips, salad); UI to choose 1 or 2; price included in item. | Spec: "Any side options the item has… Users can select either two sides or one side." |
| 6 | **High** | **View Item: drink options** — Add drink options to item model + UI; price included or add-on. | Spec: "Any drink options that the food item has." |
| 7 | **High** | **View Item: optional ingredients** — Let users remove/add ingredients (e.g. no lettuce). Add to `FoodItem` and UI toggles. | Spec: "Optional ingredients that you want to remove or add." |
| 8 | **High** | **Cart: edit item options** — From a cart row, navigate to a screen to edit that line's extras/options (e.g. open View Item or Edit Cart Item), then update cart. | Spec: "Users should be able to navigate to a different page to edit the extras chosen for the chosen item." |
| 9 | **Medium** | **Checkout (guest): sign-in prompt** — On Checkout, if user is not logged in, show a clear "Sign in to checkout" message and button instead of only failing on Place Order. | Improves UX; spec allows "A prompt to register/sign-in on this screen." |
| 10 | **Medium** | **Admin analytics: real data** — Replace sample data in Admin Analytics with live data from Firestore (orders, revenue, top items, etc.). | Spec: "Analyse and represent data in charts." Charts exist but use mock data. |
| 11 | **Low** | **Categories** — Add or rename categories (e.g. Alcohols, Burgers) to match spec if required. | Spec mentions "Dessert, Beverages, Alcohols, Burgers, Mains, Starters." Current: Starters, Mains, Desserts, Drinks, Sides. |

---

## What to implement (concise)

1. **Registration:** Card details (fake or Stripe test) during sign-up.
2. **Profile:** Edit profile screen: update name, email, address, phone, card details; persist to Firestore (and Stripe if storing payment methods).
3. **View Item:** Side options (1 or 2, price included), drink options, optional ingredients (add/remove).
4. **Cart:** From cart, open flow to edit a line item’s options/extras and update that cart line.
5. **Checkout:** “Change address” flow (modal/screen); “Select/change card” flow (Stripe or saved methods).
6. **Checkout (guest):** Optional: show “Sign in to checkout” when user is not logged in.
7. **Admin analytics:** Replace sample data with real data from Firestore (orders, revenue, top items).
8. **Categories (optional):** Add or rename categories (e.g. Alcohols, Burgers) if the spec must match exactly.

---

## File references

- Registration: `src/screens/auth/RegisterScreen.tsx`, `src/services/authService.ts`
- Profile: `src/screens/main/ProfileLoggedInScreen.tsx` (view only)
- Home: `src/screens/main/HomeScreen.tsx`, categories in `HomeScreen` + `src/types/index.ts`
- View Item: `src/screens/main/FoodItemDetailScreen.tsx`, `src/types/index.ts` (`FoodItem`)
- Cart: `src/screens/main/CartWithItemsScreen.tsx`, `src/store/slices/cartSlice.ts`
- Checkout: `src/screens/main/CheckoutScreen.tsx`
- Orders: `src/services/orderService.ts`
- Admin: `src/screens/admin/AdminAnalyticsScreen.tsx`, `AdminOrdersScreen.tsx`, `AdminFoodManagementScreen.tsx`, `AdminRestaurantSettingsScreen.tsx`
