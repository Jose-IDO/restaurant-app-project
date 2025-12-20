import { FoodCategory } from '../types';

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
}

export const FOOD_ITEMS: FoodItem[] = [
  // Starters (3 items)
  {
    id: "1",
    title: "Seared Scallops",
    sub: "Pan-seared scallops with cauliflower purée and truffle oil",
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
    category: "Starters",
    price: 22.99,
    description: "Pan-seared scallops with cauliflower purée and truffle oil",
    ingredients: ["Fresh Scallops", "Cauliflower", "Truffle Oil", "Lemon", "Herbs"],
    extras: [
      { id: "1", name: "Extra Scallops", price: 12.00 },
      { id: "2", name: "Caviar Topping", price: 15.00 },
    ],
  },
  {
    id: "2",
    title: "Oysters Rockefeller",
    sub: "Fresh oysters baked with spinach, parmesan, and herbs",
    img: "https://images.unsplash.com/photo-1541542684-4bf98d9f7c25?auto=format&fit=crop&w=800&q=80",
    category: "Starters",
    price: 18.99,
    description: "Fresh oysters baked with spinach, parmesan, and herbs",
    ingredients: ["Fresh Oysters", "Spinach", "Parmesan", "Butter", "Herbs", "Breadcrumbs"],
    extras: [
      { id: "1", name: "Extra Oysters", price: 10.00 },
      { id: "2", name: "Lemon Wedges", price: 1.50 },
    ],
  },
  {
    id: "3",
    title: "Caesar Salad",
    sub: "Crisp romaine lettuce with parmesan, croutons, and classic dressing",
    img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
    category: "Starters",
    price: 15.99,
    description: "Crisp romaine lettuce with parmesan, croutons, and classic dressing",
    ingredients: ["Romaine Lettuce", "Parmesan", "Croutons", "Caesar Dressing", "Anchovies", "Lemon"],
    extras: [
      { id: "1", name: "Grilled Chicken", price: 6.00 },
      { id: "2", name: "Extra Parmesan", price: 2.50 },
    ],
  },
  // Mains (3 items)
  {
    id: "4",
    title: "Wagyu Beef Steak",
    sub: "A5 Japanese Wagyu ribeye with roasted vegetables and red wine jus",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=800&q=80",
    category: "Mains",
    price: 75.99,
    description: "A5 Japanese Wagyu ribeye with roasted vegetables and red wine jus",
    ingredients: ["Wagyu Beef", "Roasted Vegetables", "Red Wine Jus", "Herb Butter", "Sea Salt"],
    extras: [
      { id: "1", name: "Foie Gras Topping", price: 18.00 },
      { id: "2", name: "Truffle Sauce", price: 12.00 },
      { id: "3", name: "Lobster Tail", price: 25.00 },
    ],
  },
  {
    id: "5",
    title: "Lobster Thermidor",
    sub: "Fresh lobster in creamy sauce with gruyère cheese and herbs",
    img: "https://images.unsplash.com/photo-1604908177225-1ac9c59e86c5?auto=format&fit=crop&w=800&q=80",
    category: "Mains",
    price: 42.99,
    description: "Fresh lobster in creamy sauce with gruyère cheese and herbs",
    ingredients: ["Fresh Lobster", "Gruyère Cheese", "Cream", "White Wine", "Herbs", "Breadcrumbs"],
    extras: [
      { id: "1", name: "Extra Lobster", price: 22.00 },
      { id: "2", name: "Side Salad", price: 4.00 },
    ],
  },
  {
    id: "6",
    title: "Duck Confit",
    sub: "Slow-cooked duck leg with potato gratin and cherry sauce",
    img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
    category: "Mains",
    price: 36.99,
    description: "Slow-cooked duck leg with potato gratin and cherry sauce",
    ingredients: ["Duck Leg", "Potato Gratin", "Cherry Sauce", "Thyme", "Garlic", "Duck Fat"],
    extras: [
      { id: "1", name: "Extra Duck Leg", price: 18.00 },
      { id: "2", name: "Green Beans", price: 3.50 },
    ],
  },
  // Desserts (3 items)
  {
    id: "7",
    title: "Chocolate Soufflé",
    sub: "Decadent dark chocolate soufflé with vanilla bean ice cream",
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    category: "Desserts",
    price: 18.99,
    description: "Decadent dark chocolate soufflé with vanilla bean ice cream",
    ingredients: ["Dark Chocolate", "Eggs", "Sugar", "Vanilla Ice Cream", "Gold Leaf", "Cocoa Powder"],
    extras: [
      { id: "1", name: "Extra Ice Cream", price: 4.00 },
      { id: "2", name: "Berry Compote", price: 5.00 },
      { id: "3", name: "Chocolate Sauce", price: 2.50 },
    ],
  },
  {
    id: "8",
    title: "Crème Brûlée",
    sub: "Classic vanilla custard with caramelized sugar top",
    img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
    category: "Desserts",
    price: 14.99,
    description: "Classic vanilla custard with caramelized sugar top",
    ingredients: ["Vanilla Custard", "Sugar", "Egg Yolks", "Cream", "Vanilla Bean"],
    extras: [
      { id: "1", name: "Fresh Berries", price: 3.50 },
      { id: "2", name: "Extra Caramel", price: 1.50 },
    ],
  },
  {
    id: "9",
    title: "Tiramisu",
    sub: "Italian coffee-flavored dessert with mascarpone and cocoa",
    img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    category: "Desserts",
    price: 16.99,
    description: "Italian coffee-flavored dessert with mascarpone and cocoa",
    ingredients: ["Mascarpone", "Espresso", "Ladyfingers", "Cocoa Powder", "Sugar", "Eggs"],
    extras: [
      { id: "1", name: "Extra Espresso Shot", price: 2.50 },
      { id: "2", name: "Chocolate Shavings", price: 1.50 },
    ],
  },
  // Drinks (3 items)
  {
    id: "10",
    title: "Wine Selection",
    sub: "Premium wine collection - red, white, and rosé options",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    category: "Drinks",
    price: 12.99,
    description: "Premium wine collection - red, white, and rosé options",
    ingredients: ["Premium Wine", "Aged Grapes"],
    extras: [
      { id: "1", name: "Wine Flight (3 glasses)", price: 28.00 },
      { id: "2", name: "Cheese Pairing", price: 15.00 },
    ],
  },
  {
    id: "11",
    title: "Craft Cocktails",
    sub: "Handcrafted cocktails with premium spirits and fresh ingredients",
    img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
    category: "Drinks",
    price: 14.99,
    description: "Handcrafted cocktails with premium spirits and fresh ingredients",
    ingredients: ["Premium Spirits", "Fresh Citrus", "Herbs", "Bitters", "Ice"],
    extras: [
      { id: "1", name: "Double Shot", price: 7.00 },
      { id: "2", name: "Premium Upgrade", price: 10.00 },
    ],
  },
  {
    id: "12",
    title: "Espresso & Coffee",
    sub: "Premium coffee selection - espresso, cappuccino, and lattes",
    img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=800&q=80",
    category: "Drinks",
    price: 6.99,
    description: "Premium coffee selection - espresso, cappuccino, and lattes",
    ingredients: ["Premium Coffee Beans", "Steamed Milk", "Espresso"],
    extras: [
      { id: "1", name: "Extra Shot", price: 1.50 },
      { id: "2", name: "Alternative Milk", price: 1.00 },
      { id: "3", name: "Flavor Syrup", price: 0.75 },
    ],
  },
  // Sides (3 items)
  {
    id: "13",
    title: "Truffle Fries",
    sub: "Crispy hand-cut fries with truffle oil and parmesan",
    img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    category: "Sides",
    price: 9.99,
    description: "Crispy hand-cut fries with truffle oil and parmesan",
    ingredients: ["Potatoes", "Truffle Oil", "Parmesan", "Sea Salt", "Herbs"],
    extras: [
      { id: "1", name: "Extra Truffle Oil", price: 3.00 },
      { id: "2", name: "Garlic Aioli", price: 2.00 },
    ],
  },
  {
    id: "14",
    title: "Mashed Potatoes",
    sub: "Creamy mashed potatoes with butter and herbs",
    img: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=800&q=80",
    category: "Sides",
    price: 7.99,
    description: "Creamy mashed potatoes with butter and herbs",
    ingredients: ["Potatoes", "Butter", "Cream", "Herbs", "Garlic"],
    extras: [
      { id: "1", name: "Extra Gravy", price: 2.00 },
      { id: "2", name: "Bacon Bits", price: 3.00 },
    ],
  },
  {
    id: "15",
    title: "Seasonal Vegetables",
    sub: "Fresh seasonal vegetables roasted with herbs and olive oil",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    category: "Sides",
    price: 8.99,
    description: "Fresh seasonal vegetables roasted with herbs and olive oil",
    ingredients: ["Seasonal Vegetables", "Olive Oil", "Herbs", "Garlic", "Lemon"],
    extras: [
      { id: "1", name: "Extra Vegetables", price: 3.00 },
      { id: "2", name: "Hollandaise Sauce", price: 2.50 },
    ],
  },
];
