import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});