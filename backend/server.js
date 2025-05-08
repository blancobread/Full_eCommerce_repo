const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/mongoClient");

// Import routes
const garlandsRouter = require("./routes/garlands");
const ordersRouter = require("./routes/orders");
const adminRouter = require("./routes/admin"); // Important!!

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - must be before routes
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads")); // To serve uploaded images
// Routes
app.use("/garlands", garlandsRouter);
app.use("/orders", ordersRouter);
app.use("/admin", adminRouter);

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
