/**
 * Migration Script: Static Data to Supabase
 * 
 * This script migrates food items from src/data/foodItems.ts to Supabase
 * 
 * Usage:
 *   1. Make sure your .env file has Supabase config
 *   2. Run: npm run migrate:supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Import food items
const foodItemsModule = require('../src/data/foodItems');
const FOOD_ITEMS = foodItemsModule.FOOD_ITEMS;

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:');
  if (!supabaseUrl) console.error('   - EXPO_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) console.error('   - EXPO_PUBLIC_SUPABASE_ANON_KEY');
  console.error('\nPlease check your .env file and ensure all Supabase config values are set.');
  process.exit(1);
}

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Migrate food items to Supabase
 */
async function migrateFoodItems() {
  console.log('🚀 Starting food items migration to Supabase...\n');

  try {
    // Check if items already exist
    const { data: existingItems } = await supabase
      .from('food_items')
      .select('id')
      .limit(1);

    if (existingItems && existingItems.length > 0) {
      console.log(`⚠️  Warning: Found existing food items in Supabase.`);
      console.log('   This script will add new items but may create duplicates.\n');
    }

    let successCount = 0;
    let errorCount = 0;

    // Migrate each food item
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
            ingredients: item.ingredients || [],
            extras: item.extras || null,
            is_available: true,
          })
          .select()
          .single();

        if (error) throw error;
        console.log(`✅ Migrated: ${item.title} (ID: ${data.id})`);
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
    // Check if restaurant info already exists
    const { data: existing } = await supabase
      .from('restaurant_info')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('⚠️  Restaurant info already exists. Skipping...');
      return;
    }

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
    console.log('✅ Restaurant info created successfully!');
  } catch (error: any) {
    console.error('❌ Error creating restaurant info:', error.message);
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('🔥 Supabase Migration Script\n');
  console.log('Project URL:', supabaseUrl);
  console.log('---\n');

  // Migrate food items
  await migrateFoodItems();

  // Create restaurant info
  await createRestaurantInfo();

  console.log('\n✨ All migrations completed!');
  console.log('\nNext steps:');
  console.log('1. Check Supabase Dashboard to verify data');
  console.log('2. Test your app to ensure everything works');
  console.log('3. Create an admin user manually in Supabase (set is_admin: true)\n');
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

