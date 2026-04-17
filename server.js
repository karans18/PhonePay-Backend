require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./src/config/config");
const cors = require("cors");
const app = express();
const authRoutes = require("./src/routes/authRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const walletRoutes = require("./src/routes/walletRoutes");
let swaggerDocument = {};
try {
  swaggerDocument = require("./swagger-output.json");
} catch (err) {
  console.error("Error loading Swagger document:", err.message);
}

app.use(cors());
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("PhonePay Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallet", walletRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `swagger docs are available at http://localhost:${port}/api-docs`,
  );
});
