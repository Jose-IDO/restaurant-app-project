/**
 * Migration Script: Static Data to Firestore
 * 
 * This script migrates food items from src/data/foodItems.ts to Firestore
 * 
 * Usage:
 *   1. Make sure your .env file has Firebase config
 *   2. Run: npx ts-node scripts/migrate-to-firebase.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

// Import food items - using require for compatibility
const foodItemsModule = require('../src/data/foodItems');
const FOOD_ITEMS = foodItemsModule.FOOD_ITEMS;

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate config
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file and ensure all Firebase config values are set.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Migrate food items to Firestore
 */
async function migrateFoodItems() {
  console.log('🚀 Starting food items migration...\n');

  try {
    // Check if items already exist
    const existingItems = await getDocs(collection(db, 'foodItems'));
    if (existingItems.size > 0) {
      console.log(`⚠️  Warning: Found ${existingItems.size} existing food items in Firestore.`);
      console.log('   This script will add new items but may create duplicates if IDs match.\n');
    }

    let successCount = 0;
    let errorCount = 0;

    // Migrate each food item
    for (const item of FOOD_ITEMS) {
      try {
        // Use the existing ID from static data, or let Firestore generate one
        const docRef = doc(db, 'foodItems', item.id);
        
        // Prepare data (remove id from data, it's the document ID)
        const { id, ...itemData } = item;
        
        const firestoreData = {
          ...itemData,
          isAvailable: true, // Add default field
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(docRef, firestoreData);
        console.log(`✅ Migrated: ${item.title} (ID: ${item.id})`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error migrating ${item.title}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Success: ${successCount} items`);
    console.log(`   ❌ Errors: ${errorCount} items`);
    console.log(`   📦 Total: ${FOOD_ITEMS.length} items\n`);

    if (errorCount === 0) {
      console.log('🎉 Migration completed successfully!');
    } else {
      console.log('⚠️  Migration completed with some errors. Please review the output above.');
    }
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

/**
 * Create default restaurant info document
 */
async function createRestaurantInfo() {
  console.log('\n🏪 Creating default restaurant info...\n');

  try {
    const docRef = doc(db, 'restaurantInfo', 'restaurant-info');
    
    const restaurantData = {
      name: 'Bon Appetit',
      description: 'Exquisite Dining Experience',
      address: '123 Restaurant Street, City, 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@bonappetit.com',
      openingHours: {
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '11:00', close: '23:00', closed: false },
        sunday: { open: '12:00', close: '21:00', closed: false },
      },
      deliveryFee: 25.00,
      minimumOrder: 50.00,
      updatedAt: new Date(),
    };

    await setDoc(docRef, restaurantData);
    console.log('✅ Restaurant info created successfully!');
  } catch (error: any) {
    console.error('❌ Error creating restaurant info:', error.message);
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('🔥 Firebase Migration Script\n');
  console.log('Project:', firebaseConfig.projectId);
  console.log('---\n');

  // Migrate food items
  await migrateFoodItems();

  // Create restaurant info
  await createRestaurantInfo();

  console.log('\n✨ All migrations completed!');
  console.log('\nNext steps:');
  console.log('1. Check Firestore Console to verify data');
  console.log('2. Test your app to ensure everything works');
  console.log('3. Create an admin user manually in Firestore (set isAdmin: true)\n');
}

// Run migration
main()
  .then(() => {
    console.log('👋 Goodbye!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });

