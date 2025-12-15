const { MongoClient } = require('mongodb');

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DATABASE || 'lums_challan_db';

let dbInstance = null;

const connectDB = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize the database connection
const getDB = async () => {
  if (!dbInstance) {
    await connectDB();
  }
  return dbInstance;
};

// Export functions for collections
const getCollection = async (collectionName) => {
  const db = await getDB();
  return db.collection(collectionName);
};

module.exports = {
  getDB,
  getCollection,
  connectDB
};