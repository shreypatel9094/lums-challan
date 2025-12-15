const { getCollection } = require('../config/db');
const { ObjectId } = require('mongodb');

class Customer {
  static async findAll() {
    const collection = await getCollection('customers');
    return await collection.find({}).toArray();
  }

  static async findById(id) {
    const collection = await getCollection('customers');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async create(customerData) {
    const collection = await getCollection('customers');
    const result = await collection.insertOne({
      ...customerData,
      created_at: new Date()
    });
    return result.insertedId;
  }

  static async update(id, customerData) {
    const collection = await getCollection('customers');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...customerData, updated_at: new Date() } }
    );
    return result.modifiedCount;
  }

  static async delete(id) {
    const collection = await getCollection('customers');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount;
  }
}

module.exports = Customer;