const express = require("express");
const multer = require("multer");
const path = require("path");
const { getDB } = require("../db/mongoClient");
const passport = require("../auth");
const { ObjectId } = require("mongodb"); // ✅ Add this

const router = express.Router();
const jsonParser = express.json();

// --------------------
// Multer config
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// --------------------
// Upload garland image (protected route -> only admin should upload)
// --------------------
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const db = getDB();

    const newGarland = {
      name: "",
      description: "",
      price: 0,
      imageUrl: `/uploads/${req.file.filename}`,
      category: "Other",
    };

    const result = await db.collection("garlands").insertOne(newGarland);

    res.json({ _id: result.insertedId, ...newGarland });
  }
);

// --------------------
// Get all garlands
// --------------------
router.get("/", async (req, res) => {
  const db = getDB();
  const garlands = await db.collection("garlands").find().toArray();
  res.json(garlands);
});

// --------------------
// Add new garland
// --------------------
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  jsonParser,
  async (req, res) => {
    const db = getDB();
    const { name, description, price, imageUrl, category } = req.body;

    if (!name || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Name and Image URL are required" });
    }

    const result = await db.collection("garlands").insertOne({
      name,
      description,
      price,
      imageUrl,
      category: category || "Other",
    });

    res.json({
      _id: result.insertedId,
      name,
      description,
      price,
      imageUrl,
      category,
    });
  }
);

// --------------------
// Update garland category (drag/drop change)
// --------------------
// POST /garlands/:id/category
router.post("/:id/category", jsonParser, async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { category } = req.body || {};
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const result = await db
      .collection("garlands")
      .updateOne({ _id: new ObjectId(id) }, { $set: { category } });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Garland not found" });
    }

    res.json({ message: "Category updated" });
  } catch (err) {
    console.error("Failed to update category", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
