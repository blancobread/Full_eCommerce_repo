const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('../auth');
const { getDB } = require('../db/mongoClient');

const JWT_SECRET = "supersecretkey";

// Check if any admins exist
async function hasAdmins() {
    const db = getDB();
    const count = await db.collection('admins').countDocuments();
    return count > 0;
}

// Create admin → if no admins → anyone can do it → if admins exist → passport protects
router.post('/create', async (req, res, next) => {
    const db = getDB();
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const existing = await db.collection('admins').findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    if (await hasAdmins()) {
        // Passport authenticate
        passport.authenticate('jwt', { session: false }, async (err, user) => {
            if (err) return res.status(401).json({ message: "Invalid token" });
            if (!user) return res.status(403).json({ message: "Forbidden" });

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.collection('admins').insertOne({ username, password: hashedPassword });
            return res.json({ message: "Admin created" });
        })(req, res, next);
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('admins').insertOne({ username, password: hashedPassword });
        return res.json({ message: "First admin created" });
    }
});

// Admin login → get token
router.post('/login', async (req, res) => {
    const db = getDB();
    const { username, password } = req.body;

    const admin = await db.collection('admins').findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;