const express = require("express");
const router = express.Router();
const { getDB } = require("../db/mongoClient");

router.post("/", async (req, res) => {
  const db = getDB();
  const newOrder = req.body;
  const result = await db.collection("orders").insertOne(newOrder);
  res.json(result);
});

router.get("/", async (req, res) => {
  const db = getDB();
  const orders = await db.collection("orders").find().toArray();
  res.json(orders);
});

module.exports = router;
