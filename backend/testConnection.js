import { connectDB, closeDB } from './config/db.js';

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas Connection for NyaySetu...\n');

  try {
    const db = await connectDB();
    console.log(`\n🎉 Connection Test Passed! Database "${db.databaseName}" is accessible and ready.`);
  } catch (error) {
    console.error('\n❌ Connection Test Failed:', error.message);
    process.exitCode = 1;
  } finally {
    await closeDB().catch(() => {});
    process.exit();
  }
};

testConnection();
