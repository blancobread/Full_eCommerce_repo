const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('garland_shop');
        console.log("✅ Connected to MongoDB -> garland_shop selected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
}

function getDB() {
    if (!db) throw new Error("❌ Database not initialized yet. Call connectDB first!");
    return db;
}

module.exports = { connectDB, getDB };