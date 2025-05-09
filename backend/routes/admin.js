const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("../auth");
const { getDB } = require("../db/mongoClient");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JSON WEB TOKEN is missing");

async function hasAdmins() {
  const db = getDB();
  const count = await db.collection("admins").countDocuments();
  return count > 0;
}

router.post("/create", async (req, res, next) => {
  const db = getDB();
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const existing = await db.collection("admins").findOne({ username });
  if (existing)
    return res.status(400).json({ message: "Username already exists" });

  const createAdmin = async () => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .collection("admins")
      .insertOne({ username, password: hashedPassword });
    return res.json({ message: "Admin created" });
  };

  if (await hasAdmins()) {
    passport.authenticate("jwt", { session: false })(req, res, async () => {
      await createAdmin();
    });
  } else {
    // First-time setup (no admin yet)
    await createAdmin();
  }
});

router.post("/login", async (req, res) => {
  const db = getDB();
  const { username, password } = req.body;

  const admin = await db.collection("admins").findOne({ username });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const db = getDB();
    const token = req.headers.authorization?.split(" ")[1];
    await db.collection("revoked_tokens").insertOne({ token });
    res.json({ message: "Logged out" });
  }
);

module.exports = router;
