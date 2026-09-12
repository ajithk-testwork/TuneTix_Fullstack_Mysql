import { Request, Response } from "express";
import prisma from "../config/prisma";

const generateTicketNumber = async (): Promise<string> => {
  const bookingCount = await prisma.booking.count();

  const year = new Date().getFullYear();

  return `EVT-${year}-${String(bookingCount + 1).padStart(6, "0")}`;
};

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    console.log("BODY:", req.body);
    console.log("HEADERS:", req.headers);

    if (!req.body) {
      res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const { eventId, seatIds } = req.body;

    if (!eventId || !seatIds || seatIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "Event and Seats are required",
      });

      return;
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });

      return;
    }

    const seats = await prisma.seat.findMany({
      where: {
        id: {
          in: seatIds,
        },
      },

      include: {
        category: true,
      },
    });

    if (seats.length !== seatIds.length) {
      res.status(400).json({
        success: false,
        message: "Some seats not found",
      });

      return;
    }

    for (const seat of seats) {
      if (seat.isBooked) {
        res.status(400).json({
          success: false,
          message: `${seat.seatCode} already booked`,
        });

        return;
      }

      if (seat.isLocked && seat.lockedUntil && seat.lockedUntil > new Date()) {
        res.status(400).json({
          success: false,
          message: `${seat.seatCode} currently locked`,
        });

        return;
      }
    }

    let totalAmount = 0;

    seats.forEach((seat) => {
      totalAmount += seat.category.price;
    });

    const ticketNumber = await generateTicketNumber();

    const booking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId,

          eventId,

          totalAmount,

          bookingStatus: "PENDING",

          paymentStatus: "PENDING",

          ticketNumber,
        },
      });

      await tx.bookingSeat.createMany({
        data: seatIds.map((seatId: string) => ({
          bookingId: booking.id,

          seatId,
        })),
      });

      await tx.seat.updateMany({
        where: {
          id: {
            in: seatIds,
          },
        },
        data: {
          isLocked: true,
          lockedUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });

      return booking;
    });

    res.status(201).json({
      success: true,

      message: "Booking created successfully",

      bookingId: booking.id,

      ticketNumber: booking.ticketNumber,

      totalAmount,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },

      include: {
        event: true,

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
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      total: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bookingId = Array.isArray(req.params.bookingId)
      ? req.params.bookingId[0]
      : req.params.bookingId;

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
        user: true,

        event: true,

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

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const bookingId = Array.isArray(req.params.bookingId)
      ? req.params.bookingId[0]
      : req.params.bookingId;

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

    if (booking.bookingStatus === "CANCELLED") {
      res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });

      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          bookingStatus: "CANCELLED",
        },
      });

      await tx.seat.updateMany({
        where: {
          id: {
            in: booking.seats.map((seat) => seat.seatId),
          },
        },

        data: {
          isBooked: false,
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
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
