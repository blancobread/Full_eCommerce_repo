const express = require("express");
const multer = require("multer");
const path = require("path");
const { getDB } = require("../db/mongoClient");
const passport = require("../auth");

const router = express.Router();

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
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
    });
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
router.post(
  "/:id/category",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const { category } = req.body;

    await db
      .collection("garlands")
      .updateOne(
        { _id: new require("mongodb").ObjectId(id) },
        { $set: { category } }
      );

    res.json({ message: "Category updated" });
  }
);

module.exports = router;
