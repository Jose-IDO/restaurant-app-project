# Remaining steps (required by spec)

Only the steps below are **required** by the task spec to meet expectations. **Steps 1–5 are already done.** The app uses **South African Rand (R)** throughout.

**Stripe demo:** Stripe is wired in the app but the publishable key is not set. For a demo account and test key, see **[STRIPE_DEMO_SETUP.md](STRIPE_DEMO_SETUP.md)** (sign up with your email at stripe.com, get `pk_test_...`, add to `.env`).

---

## Done (by me)

| # | Step | What was done |
|---|------|----------------|
| 1 | **Checkout: change address** | Modal on Checkout to edit street, city, zip; "Use this address" saves and shows on checkout. |
| 2 | **Checkout: select/change card** | Modal to enter payment label (e.g. "Test card •••• 4242"); "Use this card" saves and shows on checkout. |
| 3 | **Checkout: guest sign-in prompt** | When not logged in, Checkout shows "Sign in to place order" card and button; Place Order disabled until signed in. |
| 4 | **Registration: card details** | Optional "Card details (for testing)" with Last 4 digits and MM/YY on Register screen. |
| 5 | **Profile: edit profile** | Edit Profile screen (name, email, phone, address); Save updates Firestore and Redux. Profile card is tappable → Edit Profile. |

**Currency:** All dollar-sign icons were changed to `tag`; amounts are shown as **R** (Rand). Placeholders use "(R)" where relevant (e.g. "Price (R)", "Delivery Fee (R)").

---

## Still to do (required by spec) — detailed instructions

These five items are explicitly required by the task spec. The spec also says food may be divided by type and *"You can decide how deep the division is"* — so **categories** (e.g. Alcohols, Burgers) are **not** required; your current set (Starters, Mains, Desserts, Drinks, Sides) already meets that.

---

### Step 6: View Item — side options

**Requirement:** Side options (e.g. pap, chips, salad). User must be able to choose **1 or 2** sides; price is **included** in the item price.

**What to do:**

1. **Extend the data model**  
   - In `src/types/index.ts`, add to `FoodItem`:
     ```ts
     sideOptions?: Array<{ id: string; name: string }>;  // e.g. [{ id: "1", name: "Pap" }, { id: "2", name: "Chips" }]
     ```
   - Sides have no extra price; they are part of the main item price.

2. **Add sides to Firestore / static data**  
   - In `src/data/foodItems.ts` (or in Admin when creating/editing items), add `sideOptions` for mains/items that have sides.  
   - If you use the migration script, extend it to write `sideOptions` for the relevant items.

3. **Cart and order types**  
   - In `src/types/index.ts`, extend `OrderItem` (and `CartItem` in `src/store/slices/cartSlice.ts`) to include:
     ```ts
     selectedSides?: Array<{ id: string; name: string }>;  // 1 or 2 max
     ```
   - When adding to cart, pass `selectedSides` (length 1 or 2).

4. **UI in View Item screen**  
   - In `src/screens/main/FoodItemDetailScreen.tsx`, below description (or above Extras):
     - If `item.sideOptions` exists and length > 0, show a section **"Choose your sides (pick 1 or 2)"**.
     - Render each side as a selectable option (e.g. checkbox or chip). Enforce: at least 1, at most 2 selected.
     - Store selected side IDs in local state (e.g. `selectedSides: string[]`) and pass them into `addToCart` as `selectedSides` (matching the new CartItem shape).
   - Do **not** add to the displayed price; the spec says price is already included for sides.

5. **Totals**  
   - `calculateTotal()` in `FoodItemDetailScreen` does not need to add side price; only quantity and extras (if any) change the total.

**Files to touch:** `src/types/index.ts`, `src/store/slices/cartSlice.ts`, `src/screens/main/FoodItemDetailScreen.tsx`, `src/data/foodItems.ts` (or migration), and Admin food form if you manage items there.

---

### Step 7: View Item — drink options

**Requirement:** Drink options for the item. Price can be **included** in the item or an **add-on**.

**What to do:**

1. **Extend the data model**  
   - In `src/types/index.ts`, add to `FoodItem`:
     ```ts
     drinkOptions?: Array<{ id: string; name: string; price: number }>;  // price 0 = included, >0 = add-on
     ```
   - Use `price: 0` for “included” and a positive number for add-on (in Rand).

2. **Data**  
   - Add `drinkOptions` to the relevant items in `src/data/foodItems.ts` or via Admin/Firestore.

3. **Cart and order**  
   - Add to `CartItem` and `OrderItem`:
     ```ts
     selectedDrink?: { id: string; name: string; price: number };
     ```
   - In `cartSlice`, when computing `itemTotal`, add `selectedDrink?.price ?? 0` (per quantity) so add-on drinks increase the total.

4. **UI in View Item screen**  
   - In `FoodItemDetailScreen.tsx`, add a section **"Drink"** (or "Choose a drink").
   - Single choice: user picks one option from `item.drinkOptions` (or “None”).
   - Show label and, if `price > 0`, show e.g. "R X.XX" next to it.  
   - Store in state (e.g. `selectedDrink`) and pass into `addToCart`. Update `calculateTotal()` to include `selectedDrink?.price ?? 0` multiplied by quantity.

**Files to touch:** `src/types/index.ts`, `src/store/slices/cartSlice.ts` (totals logic), `src/screens/main/FoodItemDetailScreen.tsx`, data/migration/Admin.

---

### Step 8: View Item — optional ingredients (add/remove)

**Requirement:** Let users **remove or add** optional ingredients (e.g. “no lettuce”, “extra cheese”). Typically some ingredients are removable/toggleable.

**What to do:**

1. **Data model**  
   - In `src/types/index.ts`, you can keep `ingredients: string[]` and add:
     ```ts
     optionalIngredients?: Array<{ id: string; name: string; defaultIncluded?: boolean }>;
     ```
   - Or treat a subset of `ingredients` as optional and add something like `removedIngredients?: string[]` and `addedExtras?: string[]` on the cart/order item. Choose one approach and stick to it.

2. **Cart and order**  
   - On `CartItem` and `OrderItem`, add fields to record choices, e.g.:
     ```ts
     removedIngredients?: string[];   // e.g. ["Lettuce"]
     addedIngredients?: string[];     // e.g. ["Extra cheese"] — only if you support add-ons
     ```
   - If you use `optionalIngredients` on the food item, store the chosen state (included/removed) per option and map that to `removedIngredients` / `addedIngredients` when adding to cart.

3. **UI in View Item screen**  
   - In `FoodItemDetailScreen.tsx`, add a section **"Customise"** or **"Optional ingredients"**.
   - For each optional ingredient (from `item.optionalIngredients` or a defined subset of `item.ingredients`), show a toggle or checkbox: “Include [name]” / “Remove [name]”.
   - Store which are removed (and which added, if supported) in state and pass into `addToCart` and into the cart/order payload.

4. **Display**  
   - In cart/checkout/order confirmation, you can show a short line like “No lettuce” or “Extra cheese” so the kitchen knows. Use `specialInstructions` or a dedicated field built from `removedIngredients` / `addedIngredients`.

**Files to touch:** `src/types/index.ts`, `src/store/slices/cartSlice.ts`, `src/screens/main/FoodItemDetailScreen.tsx`, and order display components if you show ingredient customisation there.

---

### Step 9: Cart — edit item options (extras/sides/drinks)

**Requirement:** From the cart, the user can open a screen to **edit** a line item’s options (extras, sides, drink, optional ingredients) and update that cart line.

**What to do:**

1. **Cart slice**  
   - In `src/store/slices/cartSlice.ts`, add a reducer to **update a single cart item** (not only quantity), e.g.:
     ```ts
     updateCartItem: (state, action: PayloadAction<{ id: string; updates: Partial<CartItem> }>) => {
       const idx = state.items.findIndex(i => i.id === action.payload.id);
       if (idx >= 0 && action.payload.updates) {
         state.items[idx] = { ...state.items[idx], ...action.payload.updates };
         const totals = calculateTotals(state.items, state.deliveryFee);
         state.subtotal = totals.subtotal;
         state.total = totals.total;
       }
     },
     ```
   - Export `updateCartItem`. Ensure `CartItem` includes all fields you need (extras, selectedSides, selectedDrink, removedIngredients, etc.).

2. **Navigation**  
   - Add a route/screen for editing a cart line, e.g. `EditCartItem` with params: `cartItemId` and optionally `foodItemId` (so you can load the full `FoodItem` for options).
   - In `src/navigation/AppNavigator.tsx`, register the new screen (e.g. `EditCartItem`).

3. **Edit screen**  
   - Create e.g. `src/screens/main/EditCartItemScreen.tsx`.
   - Get the cart item by `cartItemId` from Redux; get the full `FoodItem` by `foodItemId` from Redux or Firestore.
   - Reuse the same option UI as in `FoodItemDetailScreen` (extras, sides, drink, optional ingredients) but pre-fill from the cart item.
   - On Save:
     - Dispatch `updateCartItem({ id: cartItemId, updates: { selectedExtras, selectedSides, selectedDrink, specialInstructions, ... } })`.
     - Navigate back to Cart.

4. **Cart screen**  
   - In `src/screens/main/CartWithItemsScreen.tsx`, for each cart row add a control (e.g. “Edit” or tap on the options text) that navigates to `EditCartItem` with that item’s `id` and `foodItemId`.

**Files to touch:** `src/store/slices/cartSlice.ts`, `src/navigation/AppNavigator.tsx`, new `src/screens/main/EditCartItemScreen.tsx`, `src/screens/main/CartWithItemsScreen.tsx`.

---

### Step 10: Admin analytics — real data from Firestore

**Requirement:** Analytics charts and stats should use **real** order data from Firestore (revenue, top items, etc.), not hard-coded sample data.

**What to do:**

1. **Fetch orders**  
   - In `src/screens/admin/AdminAnalyticsScreen.tsx`, use the same pattern as `AdminOrdersScreen`: load orders from `orderService.getAllOrders()` (or a dedicated analytics endpoint) and store in state (or use the existing orders from Redux if already loaded).

2. **Compute metrics**  
   - From the orders array (filter by date range if you support week/month/year):
     - **Revenue:** Sum `order.total` (already in R).
     - **Sales over time:** Group orders by day (e.g. by `createdAt`), sum `total` per day for the bar chart.
     - **Top items:** Loop over `order.items`, aggregate by `foodItemTitle` (or `foodItemId`): count orders and sum revenue per item. Sort by revenue or count and take top 5–10.
     - **Revenue by category:** You need each item’s category. Either store `category` on each `OrderItem` when placing the order, or look up `foodItemId` in the food items collection to get category. Then group by category and sum revenue.

3. **Replace sample data**  
   - Replace `SALES_DATA`, `TOP_ITEMS`, and `CATEGORY_REVENUE` with the computed values. Keep the same chart components; only change the data source.
   - If there are no orders yet, show empty state or zeros and a message like “No orders in this period.”

4. **Currency**  
   - Keep all displayed amounts as **R** (e.g. `R{value.toFixed(2)}`). No dollar signs.

**Files to touch:** `src/screens/admin/AdminAnalyticsScreen.tsx`, and optionally `src/services/orderService.ts` if you add an analytics helper. If you don’t store category on order items, also touch the place-order flow and `OrderItem` type to include category.

---

## File reference summary

| Step | Main files |
|------|------------|
| 6 – Sides | `src/types/index.ts`, `src/store/slices/cartSlice.ts`, `FoodItemDetailScreen.tsx`, data/migration |
| 7 – Drinks | Same as 6, plus totals in cartSlice and FoodItemDetailScreen |
| 8 – Optional ingredients | `src/types/index.ts`, cartSlice, `FoodItemDetailScreen.tsx`, order display |
| 9 – Cart edit item | `cartSlice.ts` (updateCartItem), `AppNavigator.tsx`, new `EditCartItemScreen.tsx`, `CartWithItemsScreen.tsx` |
| 10 – Analytics real data | `AdminAnalyticsScreen.tsx`, optionally `orderService.ts` and order/order-item types |

**Not required by spec:** Categories — the spec says you decide how deep the division is. Current categories (Starters, Mains, Desserts, Drinks, Sides) already meet that. Adding Alcohols/Burgers is optional if you want to match the example list.

---

## Currency (R / ZAR)

- All user-facing amounts use **R** (Rand). Dollar-sign icons were replaced with **tag** in Admin (Dashboard revenue, Delivery Fee, Price).
- Placeholders use **(R)** where helpful (e.g. "Price (R)", "Delivery Fee (R)", "Minimum Order (R)").
- Stripe can still use ZAR in the backend; the UI should only show R.
