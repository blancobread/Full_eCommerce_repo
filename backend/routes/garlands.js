const express = require("express");
const multer = require("multer");
const path = require("path");
const { getDB } = require("../db/mongoClient");
const passport = require("../auth");
const { ObjectId } = require("bson");

const router = express.Router();
const jsonParser = express.json();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const db = () => getDB().collection("garlands");

router.get("/", async (req, res) => {
  const garlands = await db().find().toArray();
  res.json({ success: true, data: garlands });
});

router.get("/:id", async (req, res) => {
  const garland = await db().findOne({ _id: new ObjectId(req.params.id) });
  if (!garland)
    return res
      .status(404)
      .json({ success: false, message: "Garland not found" });
  res.json({ success: true, data: garland });
});

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  async (req, res) => {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const db = getDB();

    const newGarland = {
      name: "",
      description: "",
      price: 0,
      imageUrl: `/uploads/${req.file.filename}`,
      category: "Other",
      createAt: new Date(),
    };

    const result = await db.insertOne(newGarland);
    res
      .status(201)
      .json({ success: true, data: { _id: result.insertedId, ...newGarland } });
  }
);

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
        .json({ success: false, message: "Name and Image URL are required" });
    }

    const newGarland = {
      name,
      description: description || "",
      price: parseFloat(price) || 0,
      imageUrl,
      category: category || "Other",
      createdAt: new Date(),
    };

    const result = await db().insertOne(newGarland);
    res
      .status(201)
      .json({ success: true, data: { _id: result.insertedId, ...newGarland } });
  }
);

router.patch("/:id/category", jsonParser, async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  // if (!isValidObjectId(id)) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Invalid ID format" });
  // }

  if (!category) {
    return res
      .status(400)
      .json({ success: false, message: "Category is required" });
  }

  const result = await db().updateOne(
    { _id: new ObjectId(id) },
    { $set: { category } }
  );

  if (result.matchedCount === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Garland not found" });
  }

  res.json({ success: true, message: "Category updated" });
});

module.exports = router;
