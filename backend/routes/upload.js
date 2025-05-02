const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Upload storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;