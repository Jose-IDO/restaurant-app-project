# Restaurant App - React Native Expo

A React Native mobile application built with Expo for viewing food menus and placing orders.

## Tech Stack

- **React Native** with **Expo**
- **TypeScript**
- **Redux Toolkit** - State management
- **Firebase** - Authentication, Firestore (no credit card)
- **Cloudinary** - Image storage (free, no credit card)
- **React Navigation** - Navigation
- **Stripe** - Payment processing (test mode)

## Project Structure

```
restaurant-app/
├── src/
│   ├── config/
│   │   └── firebase.ts          # Firebase configuration
│   ├── store/
│   │   ├── index.ts             # Redux store setup
│   │   ├── hooks.ts             # Typed Redux hooks
│   │   └── slices/
│   │       ├── authSlice.ts     # Authentication state
│   │       ├── cartSlice.ts     # Shopping cart state
│   │       ├── foodSlice.ts     # Food items state
│   │       └── orderSlice.ts    # Orders state
│   ├── services/
│   │   ├── authService.ts       # Authentication service
│   │   ├── foodService.ts       # Food items service
│   │   └── orderService.ts      # Orders service
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── App.tsx                      # Main app component
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure backend (all free, no credit card):
   - **Firebase:** Auth + Firestore — see [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md) or [QUICK_START_FIREBASE.md](QUICK_START_FIREBASE.md)
   - **Cloudinary:** Image storage — see [FREE_IMAGE_STORAGE.md](FREE_IMAGE_STORAGE.md)
   - Add to `.env`: Firebase (6 vars) + `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`, `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

3. Run the app:
```bash
npm start
```

## Features (To Be Implemented)

### User Features
- User registration and login
- Profile management
- Browse food menu by categories
- View food item details
- Customize orders (sides, drinks, extras, ingredients)
- Shopping cart management
- Checkout and order placement
- Order history

### Admin Features
- Separate admin login
- Food item management (CRUD)
- Order management
- Analytics dashboard with charts
- Restaurant information management

## Git Workflow

- **test_dev** - Development branch (push code here first)
- **development-release** - Main branch (merge via PR after testing)

## Development Status

🚧 **Core Infrastructure Complete**
- ✅ Redux store setup
- ✅ Firebase configuration
- ✅ TypeScript types
- ✅ Service layer structure
- ⏳ Screens (to be implemented)
- ⏳ Navigation (to be implemented)
- ⏳ UI Components (to be implemented)

## Next Steps

1. Set up Firebase project and configure credentials
2. Implement authentication screens
3. Build main navigation structure
4. Create reusable UI components
5. Implement food menu screens
6. Build cart and checkout flow
7. Add admin dashboard
8. Integrate Stripe payment processing

## Notes

- This is a core initialization version
- Screens and navigation will be added in subsequent commits
- Design components from Lovable will be integrated
- Aiming for 30+ commits over the development period



