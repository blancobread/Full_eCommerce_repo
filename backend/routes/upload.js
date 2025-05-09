const express = require("express");
const multer = require("multer");
const path = require("path");
const { getDB } = require("../db/mongoClient");
const { ObjectId } = require("mongodb");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const db = getDB();
  const newGarland = {
    name: "",
    description: "",
    price: 0,
    imageUrl: `/uploads/${req.file.filename}`,
    category: "Other",
  };

  try {
    const result = await db.collection("garlands").insertOne(newGarland);

    res.json({
      _id: result.insertedId,
      ...newGarland,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Failed to save garland" });
  }
});

module.exports = router;
