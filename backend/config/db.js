import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const DB_NAME = 'nyaysetu';

let client = null;
let dbInstance = null;

/**
 * Connects to MongoDB Atlas using the official MongoDB Node.js driver.
 * Returns the "nyaysetu" database instance.
 * Reuses existing connection if already connected.
 * 
 * @returns {Promise<import('mongodb').Db>} MongoDB Db instance for "nyaysetu"
 */
export const connectDB = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Error: MONGODB_URI is not defined in environment variables (.env file).');
    throw new Error('MONGODB_URI missing in process.env');
  }

  try {
    client = new MongoClient(uri);
    await client.connect();

    // Verify connection health by issuing a ping command
    await client.db(DB_NAME).command({ ping: 1 });

    dbInstance = client.db(DB_NAME);
    console.log(`✅ Connected successfully to MongoDB Atlas database: "${DB_NAME}"`);

    return dbInstance;
  } catch (error) {
    console.error('❌ Graceful Failure: Failed to connect to MongoDB Atlas.');
    console.error(`Reason: ${error.message}`);
    
    if (client) {
      await client.close().catch(() => {});
      client = null;
    }
    dbInstance = null;
    throw error;
  }
};

/**
 * Returns the active MongoDB database instance ("nyaysetu").
 * Must be called after connectDB() has been executed.
 * 
 * @returns {import('mongodb').Db} MongoDB Db instance for "nyaysetu"
 */
export const getDB = () => {
  if (!dbInstance) {
    throw new Error('❌ Database not initialized. Call connectDB() first before calling getDB().');
  }
  return dbInstance;
};

/**
 * Gracefully closes the MongoDB client connection.
 */
export const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    dbInstance = null;
    console.log('🔌 MongoDB client connection closed.');
  }
};
