import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../config/stripe";
import prisma from "../config/prisma";
import QRCode from "qrcode";
import { v2 as cloudinary } from "cloudinary"; // Make sure Cloudinary is configured

export const stripeWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  console.log("Event Type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: "Booking Id not found in metadata",
      });
      return;
    }

    try {
      await prisma.$transaction(async (tx) => {
        console.log("========== WEBHOOK START ==========");

        // 1. Find Booking
        const booking = await tx.booking.findUnique({
          where: {
            id: bookingId,
          },
          include: {
            event: true,
            user: true,
            seats: {
              include: {
                seat: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        });

        if (!booking) {
          throw new Error(`Booking not found : ${bookingId}`);
        }

        console.log("Booking Found:", booking.id);

        // 2. Prevent duplicate processing
        if (
          booking.paymentStatus === "SUCCESS" &&
          booking.bookingStatus === "CONFIRMED"
        ) {
          console.log("Booking already processed.");
          return;
        }

        // 3. Generate QR and Upload to Cloudinary
        const qrData = JSON.stringify({
          bookingId: booking.id,
          ticketNumber: booking.ticketNumber,
          customer: booking.user.name,
          email: booking.user.email,
          event: booking.event.title,
          venue: booking.event.venue,
          date: booking.event.date,
          seats: booking.seats.map((s) => s.seat.seatCode),
        });

        let qrCodeUrl = "";

        try {
          // Generate base64 Data URL
          const qrCodeDataUrl = await QRCode.toDataURL(qrData);
          
          // Upload the base64 string directly to Cloudinary
          const uploadResponse = await cloudinary.uploader.upload(qrCodeDataUrl, {
            folder: "future-believe/qr_codes", // Optional: organizes files in a folder
            public_id: `qr_${booking.id}`,     // Optional: gives the file a predictable name
          });

          qrCodeUrl = uploadResponse.secure_url;
          console.log("QR Generated and Uploaded to Cloudinary:", qrCodeUrl);
        } catch (err) {
          console.error("QR Generation or Cloudinary Upload Failed");
          throw err;
        }

        // 4. Update Booking with the Cloudinary URL
        const updatedBooking = await tx.booking.update({
          where: {
            id: booking.id,
          },
          data: {
            paymentStatus: "SUCCESS",
            bookingStatus: "CONFIRMED",
            qrCode: qrCodeUrl, // Saving the secure URL instead of base64
          },
        });

        console.log("Booking Updated");

        // 5. Update Seats
        const seatIds = booking.seats.map((s) => s.seatId);

        console.log("Updating Seats:", seatIds);

        const updatedSeats = await tx.seat.updateMany({
          where: {
            id: {
              in: seatIds,
            },
          },
          data: {
            isBooked: true,
            isLocked: false,
            lockedUntil: null,
          },
        });

        console.log("Seat Update Result:", updatedSeats);

        if (updatedSeats.count !== seatIds.length) {
          throw new Error(
            `Expected ${seatIds.length} seats but updated ${updatedSeats.count}`,
          );
        }

        console.log("Transaction Completed Successfully");
        console.log("==================================");
      }, 
      {
        // Optional but Recommended: Increase transaction timeout 
        // because uploading to Cloudinary might take a few seconds
        timeout: 10000 
      });

      console.log("Payment Success:", bookingId);
    } catch (error: any) {
      console.error("========== WEBHOOK ERROR ==========");
      console.error(error);
      console.error(error.message);
      console.error(error.stack);
      console.error("==================================");
    }
  }

  res.status(200).json({
    received: true,
  });
};