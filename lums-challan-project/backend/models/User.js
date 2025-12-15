const { getCollection } = require('../config/db');
const { ObjectId } = require('mongodb');

class User {
  static async findByEmail(email) {
    const collection = await getCollection('users');
    return await collection.findOne({ email });
  }

  static async findByUsername(username) {
    const collection = await getCollection('users');
    return await collection.findOne({ username });
  }

  static async create(userData) {
    const collection = await getCollection('users');
    const result = await collection.insertOne({
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    });
    return result.insertedId;
  }

  static async findById(id) {
    const collection = await getCollection('users');
    return await collection.findOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;