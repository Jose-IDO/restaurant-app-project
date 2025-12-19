// User Types
export interface User {
  uid: string;
  email: string;
  name: string;
  surname: string;
  contactNumber: string;
  address: Address;
  cardDetails?: CardDetails[];
  isAdmin?: boolean;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface CardDetails {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  isDefault?: boolean;
}

// Food Types
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: FoodCategory;
  ingredients?: string[];
  sideOptions?: SideOption[];
  drinkOptions?: DrinkOption[];
  extras?: Extra[];
  optionalIngredients?: OptionalIngredient[];
  isAvailable: boolean;
}

export type FoodCategory = 
  | 'Dessert' 
  | 'Beverages' 
  | 'Alcohols' 
  | 'Burgers' 
  | 'Mains' 
  | 'Starters';

export interface SideOption {
  id: string;
  name: string;
  price: number; // Included in base price
}

export interface DrinkOption {
  id: string;
  name: string;
  price: number; // Can be included or add-on
  isIncluded: boolean;
}

export interface Extra {
  id: string;
  name: string;
  price: number; // Add-on price
  type: 'side' | 'sauce' | 'salad' | 'drink';
}

export interface OptionalIngredient {
  id: string;
  name: string;
  canRemove: boolean;
  canAdd: boolean;
  addOnPrice?: number;
}

// Cart Types
export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  selectedSides?: string[]; // Side option IDs
  selectedDrink?: string; // Drink option ID
  selectedExtras?: string[]; // Extra IDs
  removedIngredients?: string[]; // Optional ingredient IDs to remove
  addedIngredients?: string[]; // Optional ingredient IDs to add
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  userDetails: {
    name: string;
    surname: string;
    contactNumber: string;
    address: Address;
  };
  items: CartItem[];
  total: number;
  deliveryAddress: Address;
  cardDetails: CardDetails;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

// Restaurant Types
export interface RestaurantInfo {
  id: string;
  name: string;
  description: string;
  address: Address;
  contactNumber: string;
  email: string;
  openingHours: OpeningHours;
  logo?: string;
}

export interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

