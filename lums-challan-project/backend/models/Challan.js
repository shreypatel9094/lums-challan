const { getCollection } = require('../config/db');
const { ObjectId } = require('mongodb');

class Challan {
  static async findAll() {
    const collection = await getCollection('challans');
    return await collection.find({}).toArray();
  }

  static async findById(id) {
    const collection = await getCollection('challans');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByCustomerId(customerId) {
    const collection = await getCollection('challans');
    return await collection.find({ customer_id: customerId }).toArray();
  }

  static async create(challanData) {
    const collection = await getCollection('challans');
    const result = await collection.insertOne({
      ...challanData,
      created_at: new Date()
    });
    return result.insertedId;
  }

  static async update(id, challanData) {
    const collection = await getCollection('challans');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...challanData, updated_at: new Date() } }
    );
    return result.modifiedCount;
  }

  static async delete(id) {
    const collection = await getCollection('challans');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount;
  }
}

module.exports = Challan;