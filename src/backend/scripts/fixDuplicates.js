/**
 * Script to fix duplicates and ensure indexes
 * Run this with: node scripts/fixDuplicates.js
 */

const mongoose = require('mongoose');
const Audit = require('../models/Audit.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mercury_mystery_db';

async function fixDuplicates() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Step 1: Check existing indexes
    console.log('📊 Checking existing indexes...');
    const indexes = await Audit.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));
    
    const hasCompoundIndex = Object.keys(indexes).some(key => 
      key.includes('storeCode') && key.includes('auditType')
    );
    
    if (hasCompoundIndex) {
      console.log('✅ Compound index exists\n');
    } else {
      console.log('⚠️  Compound index NOT found\n');
    }

    // Step 2: Find duplicate audits
    console.log('🔍 Finding duplicate audits...');
    const duplicates = await Audit.aggregate([
      {
        $group: {
          _id: {
            storeCode: '$storeCode',
            auditType: '$auditType'
          },
          count: { $sum: 1 },
          ids: { $push: '$_id' },
          storeName: { $first: '$storeName' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!\n');
    } else {
      console.log(`⚠️  Found ${duplicates.length} duplicate groups:\n`);
      
      duplicates.forEach((dup, index) => {
        console.log(`${index + 1}. Store: ${dup._id.storeCode} (${dup.storeName}) - Type: ${dup._id.auditType}`);
        console.log(`   Count: ${dup.count} duplicates`);
        console.log(`   IDs: ${dup.ids.join(', ')}`);
        console.log('');
      });

      // Step 3: Ask to remove duplicates (keeping only the first one)
      console.log('💡 To remove duplicates, keeping only the first entry of each:');
      console.log('   Run this in MongoDB Compass or uncomment the code below\n');

      // Uncomment to auto-remove duplicates
      /*
      let removed = 0;
      for (const dup of duplicates) {
        // Keep first, remove rest
        const toRemove = dup.ids.slice(1);
        const result = await Audit.deleteMany({ _id: { $in: toRemove } });
        removed += result.deletedCount;
        console.log(`   Removed ${result.deletedCount} duplicates for ${dup._id.storeCode}`);
      }
      console.log(`\n✅ Removed ${removed} duplicate audits\n`);
      */
    }

    // Step 4: Drop existing compound index if it exists (to recreate)
    console.log('🔧 Ensuring compound index...');
    try {
      // Try to drop old index if exists
      try {
        await Audit.collection.dropIndex('storeCode_1_auditType_1_deadline_1');
        console.log('   Dropped old index with deadline');
      } catch (e) {
        // Index doesn't exist, that's fine
      }

      // Create new compound index
      await Audit.collection.createIndex(
        { storeCode: 1, auditType: 1 },
        { unique: true, name: 'unique_store_audit_type' }
      );
      console.log('✅ Created compound unique index: storeCode + auditType\n');
    } catch (error) {
      if (error.code === 11000 || error.message.includes('duplicate')) {
        console.log('⚠️  Cannot create unique index - duplicates exist!');
        console.log('   Remove duplicates first (see above)\n');
      } else {
        console.error('❌ Error creating index:', error.message);
      }
    }

    // Step 5: Show total audit count
    const totalAudits = await Audit.countDocuments();
    console.log(`📊 Total audits in database: ${totalAudits}\n`);

    // Step 6: Show sample data to verify storeCode format
    console.log('📝 Sample audits (first 5):');
    const samples = await Audit.find().limit(5).select('storeCode storeName auditType');
    samples.forEach((audit, index) => {
      console.log(`${index + 1}. storeCode: "${audit.storeCode}" | type: ${audit.auditType} | name: ${audit.storeName}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the script
fixDuplicates();
