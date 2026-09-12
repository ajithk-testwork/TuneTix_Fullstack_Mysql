import { Request, Response } from "express";
import stripe from "../config/stripe";
import prisma from "../config/prisma";
import QRCode from "qrcode";
import { uploadQRCode } from "../config/uploadQRCode";

import { sendBookingConfirmationEmail } from "../utils/emailService";

export const createCheckoutSession = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
      return;
    }

    const booking = await prisma.booking.findUnique({
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
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    const ticketCount = booking.seats.length;

    const eventDate = booking.event.date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const eventTime = booking.event.time;

    const seatDetails = booking.seats
      .map(
        (item) =>
          `• ${item.seat.category.name} - ${item.seat.seatCode} - ₹${item.seat.category.price.toLocaleString("en-IN")}`,
      )
      .join("\n");

    const totalAmount = booking.seats.reduce(
      (sum, item) => sum + item.seat.category.price,
      0,
    );

    const description = `
📅 Date : ${eventDate}
🕒 Time : ${eventTime}
📍 Venue : ${booking.event.venue}, ${booking.event.location}

━━━━━━━━━━━━━━━━━━━━━━━━

Seats

${seatDetails}

━━━━━━━━━━━━━━━━━━━━━━━━

Tickets : ${ticketCount}
Total : ₹${totalAmount.toLocaleString("en-IN")}
`.trim();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      customer_email: booking.user.email,

      billing_address_collection: "auto",

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: booking.event.title,

              description,
            },

            unit_amount: Math.round(totalAmount * 100),
          },

          quantity: 1,
        },
      ],

      metadata: {
        bookingId: booking.id,

        userId: booking.user.id,

        customerName: booking.user.name,

        customerEmail: booking.user.email,

        ticketNumber: booking.ticketNumber,

        eventId: booking.event.id,

        eventTitle: booking.event.title,

        eventDate,

        eventTime,

        venue: booking.event.venue,

        location: booking.event.location,

        totalTickets: ticketCount.toString(),

        totalAmount: totalAmount.toString(),

        seatNumbers: booking.seats.map((item) => item.seat.seatCode).join(", "),

        seatCategories: booking.seats
          .map((item) => item.seat.category.name)
          .join(", "),

        seatPrices: booking.seats
          .map((item) => item.seat.category.price.toString())
          .join(", "),
      },

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    /* =====================================================
       RESPONSE
    ===================================================== */

    res.status(200).json({
      success: true,

      message: "Checkout session created successfully.",

      sessionId: session.id,

      checkoutUrl: session.url,
    });
  } catch (error: any) {
    console.error("Create Checkout Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

/* =========================================================
   PAYMENT SUCCESS
   NO WEBHOOK USED
========================================================= */

export const paymentSuccess = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log("========== PAYMENT SUCCESS ==========");

    const { sessionId } = req.body;

    console.log("Session ID:", sessionId);

    /* =====================================================
       1. CHECK SESSION ID
    ===================================================== */

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: "Session ID is required",
      });

      return;
    }

    /* =====================================================
       2. GET STRIPE SESSION
    ===================================================== */

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Stripe Session Status:", session.status);

    console.log("Stripe Payment Status:", session.payment_status);

    /* =====================================================
       3. CHECK PAYMENT
    ===================================================== */

    if (session.status !== "complete" || session.payment_status !== "paid") {
      res.status(400).json({
        success: false,
        message: "Payment not completed",
      });

      return;
    }

    console.log("Payment successfully received ✅");

    /* =====================================================
       4. GET BOOKING ID
    ===================================================== */

    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: "Booking ID missing from Stripe session",
      });

      return;
    }

    console.log("Booking ID:", bookingId);

    /* =====================================================
       5. GET BOOKING
    ===================================================== */

    const booking = await prisma.booking.findUnique({
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
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    console.log("Booking found:", booking.id);

    /* =====================================================
       6. ALREADY CONFIRMED CHECK
    ===================================================== */

    if (
      booking.paymentStatus === "SUCCESS" &&
      booking.bookingStatus === "CONFIRMED" &&
      booking.qrCode
    ) {
      console.log("Booking already confirmed.");

      res.status(200).json({
        success: true,

        message: "Payment already processed",

        booking,
      });

      return;
    }

    /* =====================================================
       7. GENERATE QR DATA
    ===================================================== */

    const selectedSeats = booking.seats.map((item) => item.seat.seatCode);

    const qrData = JSON.stringify({
      bookingId: booking.id,

      ticketNumber: booking.ticketNumber,

      userId: booking.userId,

      eventId: booking.eventId,

      eventTitle: booking.event.title,

      seats: selectedSeats,
    });

    console.log("Generating QR Code...");

    const qrDataUrl = await QRCode.toDataURL(qrData);

    /* =====================================================
       8. UPLOAD QR TO CLOUDINARY
    ===================================================== */

    console.log("Uploading QR Code to Cloudinary...");

    const qrCodeUrl = await uploadQRCode(qrDataUrl, booking.ticketNumber);

    console.log("QR upload returned value:", qrCodeUrl);

    console.log("QR upload returned type:", typeof qrCodeUrl);

    /* =====================================================
       9. UPDATE BOOKING
    ===================================================== */

    const confirmedBooking = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: {
          id: booking.id,
        },

        data: {
          paymentStatus: "SUCCESS",

          bookingStatus: "CONFIRMED",

          qrCode: qrCodeUrl,
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

      /* ===============================================
             MARK SEATS AS BOOKED
          =============================================== */

      await tx.seat.updateMany({
        where: {
          id: {
            in: booking.seats.map((item) => item.seatId),
          },
        },

        data: {
          isBooked: true,

          isLocked: false,

          lockedUntil: null,
        },
      });

      return updatedBooking;
    });

    console.log("Booking confirmed successfully ✅");

    /* =====================================================
       11. BOOKING CONFIRMATION EMAIL - SECOND
    ===================================================== */

    console.log("Sending Booking Confirmation Email...");
    console.log("========== EVENT IMAGE ==========");
    console.log("Event Image URL:", confirmedBooking.event.image);

    try {
      await sendBookingConfirmationEmail(
        {
          name: confirmedBooking.user.name,

          email: confirmedBooking.user.email,

          eventTitle: confirmedBooking.event.title,

          eventDate: confirmedBooking.event.date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),

          eventTime: confirmedBooking.event.time,

          venue: confirmedBooking.event.venue,

          location: confirmedBooking.event.location,

          ticketNumber: confirmedBooking.ticketNumber,

          seats: confirmedBooking.seats.map((item) => ({
            category: item.seat.category.name,
            seatCode: item.seat.seatCode,
          })),

          totalAmount: confirmedBooking.totalAmount,

          qrCode: confirmedBooking.qrCode!,

          eventImage: confirmedBooking.event.image || undefined,
        },

        confirmedBooking.id,
      );
    } catch (emailError) {
      console.error("Booking Confirmation Email Error:", emailError);
    }

    //12. FINAL RESPONSE

    console.log("Payment process completed successfully ✅");

    res.status(200).json({
      success: true,

      message: "Payment successful and booking confirmed",

      booking: confirmedBooking,
    });
  } catch (error: any) {
    console.error("Payment Success Error:", error);

    res.status(500).json({
      success: false,

      message: error.message || "Payment verification failed",
    });
  }
};

// PAYMENT CANCEL

export const paymentCancel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });

      return;
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        seats: true,
      },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    await prisma.$transaction(async (tx) => {
      // UPDATE BOOKING

      await tx.booking.update({
        where: {
          id: booking.id,
        },

        data: {
          paymentStatus: "FAILED",

          bookingStatus: "CANCELLED",
        },
      });

      // UNLOCK SEATS

      await tx.seat.updateMany({
        where: {
          id: {
            in: booking.seats.map((seat) => seat.seatId),
          },
        },

        data: {
          isLocked: false,

          lockedUntil: null,
        },
      });
    });

    res.status(200).json({
      success: true,

      message: "Booking cancelled successfully",
    });
  } catch (error: any) {
    console.error("Payment Cancel Error:", error);

    res.status(500).json({
      success: false,

      message: error.message || "Failed to cancel booking",
    });
  }
};
