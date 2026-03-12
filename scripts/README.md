# Migration Scripts

## migrate-to-firebase.ts

This script migrates static food items data from `src/data/foodItems.ts` to Firestore.

### Prerequisites

1. Firebase project created and configured
2. `.env` file with Firebase configuration
3. Firestore database created (can be in test mode)

### Usage

```bash
# Install dependencies (if not already installed)
npm install

# Run the migration script
npx ts-node scripts/migrate-to-firebase.ts
```

### What it does

1. ✅ Migrates all food items from static data to Firestore `foodItems` collection
2. ✅ Creates default restaurant info document in `restaurantInfo` collection
3. ✅ Preserves existing IDs from static data
4. ✅ Adds timestamps and default fields

### Notes

- The script will warn if items already exist in Firestore
- It uses the existing IDs from static data as Firestore document IDs
- If you run it multiple times, it will update existing documents

