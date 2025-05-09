// scripts/clearGarlands.js
const { connectDB } = require("./db/mongoClient");

connectDB().then(async () => {
  const db = require("./db/mongoClient").getDB();
  const result = await db.collection("garlands").deleteMany({});
  console.log(`🗑️  Deleted ${result.deletedCount} garland records`);
  process.exit();
});
