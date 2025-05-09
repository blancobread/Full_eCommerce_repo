const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/mongoClient");
const path = require("path");

// Import routes
const garlandsRouter = require("./routes/garlands");
const ordersRouter = require("./routes/orders");
const adminRouter = require("./routes/admin");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - must be before routes
app.use(cors());
console.log("Static path:", path.join(__dirname, "uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/garlands", garlandsRouter);
app.use("/admin", express.json(), adminRouter);
app.use("/orders", express.json(), ordersRouter);

// Start server after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
  });
