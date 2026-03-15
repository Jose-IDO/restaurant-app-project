// Food Types
export type FoodCategory = 
  | 'Starters' 
  | 'Mains' 
  | 'Desserts' 
  | 'Drinks'
  | 'Sides';

export interface FoodItem {
  id: string;
  title: string;
  sub: string;
  img: string;
  category: FoodCategory;
  price: number;
  description: string;
  ingredients: string[];
  extras?: Array<{ id: string; name: string; price: number }>;
  /** Sides (e.g. pap, chips, salad). User picks 1 or 2; price included in item. */
  sideOptions?: Array<{ id: string; name: string }>;
  /** Drink options: price 0 = included, >0 = add-on in Rand. */
  drinkOptions?: Array<{ id: string; name: string; price: number }>;
  /** Optional ingredients user can remove or add (e.g. no lettuce, extra cheese). */
  optionalIngredients?: Array<{ id: string; name: string; defaultIncluded?: boolean }>;
}

// Order Types
export type OrderStatus = 
  | 'pending' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  foodItemId: string;
  foodItemTitle: string;
  quantity: number;
  price: number;
  extras?: Array<{ id: string; name: string; price: number }>;
  specialInstructions?: string;
  selectedSides?: Array<{ id: string; name: string }>;
  selectedDrink?: { id: string; name: string; price: number };
  removedIngredients?: string[];
  addedIngredients?: string[];
  category?: FoodCategory;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// Restaurant Types
export interface RestaurantInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  deliveryFee: number;
  minimumOrder: number;
  logo?: string;
  coverImage?: string;
}

