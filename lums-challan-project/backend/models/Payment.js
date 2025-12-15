const { getCollection } = require('../config/db');
const { ObjectId } = require('mongodb');

class Payment {
  static async findAll() {
    const collection = await getCollection('payments');
    return await collection.find({}).toArray();
  }

  static async findById(id) {
    const collection = await getCollection('payments');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async findByCustomerId(customerId) {
    const collection = await getCollection('payments');
    return await collection.find({ customer_id: customerId }).toArray();
  }

  static async findByChallanId(challanId) {
    const collection = await getCollection('payments');
    return await collection.find({ challan_id: challanId }).toArray();
  }

  static async create(paymentData) {
    const collection = await getCollection('payments');
    const result = await collection.insertOne({
      ...paymentData,
      created_at: new Date()
    });
    return result.insertedId;
  }

  static async update(id, paymentData) {
    const collection = await getCollection('payments');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...paymentData, updated_at: new Date() } }
    );
    return result.modifiedCount;
  }
}

module.exports = Payment;