import "dotenv/config";

import express from "express";
import prisma from "./config/prisma";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import seatCategoryRoutes from "./routes/seatCategoryRoutes";
import seatRoutes from "./routes/seatRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import http from "http";
import { initializeSocket } from "./socket";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", seatCategoryRoutes);
app.use("/api", seatRoutes);
app.use("/api", bookingRoutes);
app.use("/api", paymentRoutes);

async function startServer() {
  try {
    await prisma.$connect();

    console.log("✅ PostgreSQL Connected Successfully");

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 Socket.IO running`);
    });
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }
}

startServer();