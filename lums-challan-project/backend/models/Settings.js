const { getCollection } = require('../config/db');

class Settings {
  static async get() {
    const collection = await getCollection('settings');
    const settings = await collection.findOne({});
    return settings;
  }

  static async update(settingsData) {
    const collection = await getCollection('settings');
    const result = await collection.updateOne(
      {}, 
      { $set: settingsData },
      { upsert: true }
    );
    return result.modifiedCount;
  }

  static async getNextChallanNumber() {
    const collection = await getCollection('settings');
    const settings = await collection.findOne({}, { projection: { next_challan_number: 1, challan_prefix: 1 } });
    return settings;
  }

  static async incrementChallanNumber() {
    const collection = await getCollection('settings');
    const result = await collection.updateOne(
      {}, 
      { $inc: { next_challan_number: 1 } }
    );
    return result.modifiedCount;
  }
}

module.exports = Settings;