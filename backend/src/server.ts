import express from "express";
import dotenv from "dotenv";
import prisma from "./config/prisma";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import seatCategoryRoutes from "./routes/seatCategoryRoutes";
import seatRoutes from "./routes/seatRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import cors from "cors";

dotenv.config();




const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/api/payment/webhook",
  express.raw({
    type: "application/json",
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", seatCategoryRoutes);
app.use("/api", seatRoutes);
app.use("/api", bookingRoutes);
app.use("/api", paymentRoutes);


async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ MySQL Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
  }
}

startServer();