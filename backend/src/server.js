import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import categories from "./routes/category.routes.js"
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working"
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      message: "Database connected",
      users
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/categories",categories);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});