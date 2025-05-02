const express = require('express');
const router = express.Router();
const { getDB } = require('../db/mongoClient');
const passport = require('../auth');

router.get('/', async (req, res) => {
    const db = getDB();
    const garlands = await db.collection('garlands').find().toArray();
    res.json(garlands);
});

// Protected POST (admin only)
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const db = getDB();
    const newGarland = req.body;
    const result = await db.collection('garlands').insertOne(newGarland);
    res.json(result);
});

module.exports = router;