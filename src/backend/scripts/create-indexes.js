/**
 * Script to manually create indexes for the Audit collection
 * Run this if automatic index creation isn't working
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mercury_mystery_db';

async function createIndexes() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Get the audits collection
    const db = mongoose.connection.db;
    const auditsCollection = db.collection('audits');

    console.log('\n📊 Current indexes:');
    const existingIndexes = await auditsCollection.indexes();
    existingIndexes.forEach((index, i) => {
      console.log(`  ${i + 1}.`, JSON.stringify(index.key), index.unique ? '(UNIQUE)' : '');
    });

    // Check if our compound index already exists
    const compoundIndexExists = existingIndexes.some(index => 
      index.key.storeCode === 1 && index.key.auditType === 1
    );

    if (compoundIndexExists) {
      console.log('\n⚠️  Compound index (storeCode + auditType) already exists');
      console.log('   Dropping it to recreate...');
      
      // Find the index name
      const indexToDrop = existingIndexes.find(index => 
        index.key.storeCode === 1 && index.key.auditType === 1
      );
      
      if (indexToDrop) {
        await auditsCollection.dropIndex(indexToDrop.name);
        console.log('   ✅ Old index dropped');
      }
    }

    console.log('\n🔨 Creating compound unique index: { storeCode: 1, auditType: 1 }');
    
    const result = await auditsCollection.createIndex(
      { storeCode: 1, auditType: 1 },
      { 
        unique: true,
        name: 'unique_storeCode_auditType',
        background: false // Create in foreground for immediate effect
      }
    );

    console.log('✅ Index created:', result);

    console.log('\n📊 Updated indexes:');
    const newIndexes = await auditsCollection.indexes();
    newIndexes.forEach((index, i) => {
      console.log(`  ${i + 1}.`, JSON.stringify(index.key), index.unique ? '(UNIQUE)' : '');
    });

    console.log('\n🎉 Index creation complete!');
    console.log('💡 Now when you upload the same Excel file, duplicates will be automatically skipped.');
    
    // Test the index by counting documents
    const totalAudits = await auditsCollection.countDocuments();
    console.log(`\n📈 Total audits in database: ${totalAudits}`);

    // Check for existing duplicates
    console.log('\n🔍 Checking for existing duplicates in database...');
    const duplicates = await auditsCollection.aggregate([
      {
        $group: {
          _id: { storeCode: '$storeCode', auditType: '$auditType' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();

    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} duplicate groups:`);
      duplicates.forEach((dup, i) => {
        console.log(`  ${i + 1}. StoreCode: "${dup._id.storeCode}", AuditType: "${dup._id.auditType}", Count: ${dup.count}`);
        console.log(`     IDs: ${dup.ids.join(', ')}`);
      });
      console.log('\n💡 TIP: You should delete these duplicates manually in MongoDB Compass');
      console.log('   to keep only one audit per store+type combination.');
    } else {
      console.log('✅ No duplicates found! Database is clean.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('\n⚠️  DUPLICATE KEY ERROR!');
      console.error('   This means you have existing duplicates in your database.');
      console.error('   Before creating the unique index, you need to:');
      console.error('   1. Open MongoDB Compass');
      console.error('   2. Go to audits collection');
      console.error('   3. Delete duplicate entries (keep only one per store+type)');
      console.error('   4. Run this script again');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the script
createIndexes();
