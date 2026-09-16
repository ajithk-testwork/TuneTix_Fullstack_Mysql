import { Request, Response } from "express";
import prisma from "../config/prisma";

const getParamString = (
  value: string | string[] | undefined,
): string | undefined => {
  return Array.isArray(value) ? value[0] : value;
};

// Create Seat Category
export const createSeatCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { eventId, name, price, totalSeats, color } = req.body;

    // Validation
    if (!eventId || !name || !price || !totalSeats) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Check event
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

    // Check duplicate category name
    const existing = await prisma.seatCategory.findFirst({
      where: {
        eventId,
        name,
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: "Seat category already exists",
      });
      return;
    }

    // Get existing row letters for this event
    const existingCategories = await prisma.seatCategory.findMany({
      where: {
        eventId,
      },
      select: {
        rowLetter: true,
      },
    });

    const usedRows = new Set(
      existingCategories.map((category) => category.rowLetter),
    );

    // Find first available row: A, B, C, D...
    let rowLetter = "";

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);

      if (!usedRows.has(letter)) {
        rowLetter = letter;
        break;
      }
    }

    // More than 26 categories
    if (!rowLetter) {
      res.status(400).json({
        success: false,
        message: "Maximum 26 seat categories allowed for one event",
      });
      return;
    }

    // Create category
    const category = await prisma.seatCategory.create({
      data: {
        eventId,
        name,
        price: Number(price),
        totalSeats: Number(totalSeats),
        color,
        rowLetter,
      },
    });

    res.status(201).json({
      success: true,
      message: "Seat category created successfully",
      data: category,
    });
  } catch (error: any) {
    console.error("Create Seat Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Seat Categories by Event
export const getSeatCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const eventId = getParamString(req.params.eventId);

    if (!eventId) {
      res.status(400).json({
        success: false,
        message: "Event ID is required",
      });

      return;
    }

    const categories = await prisma.seatCategory.findMany({
      where: {
        eventId,
      },

      orderBy: {
        createdAt: "asc",
      },

      include: {
        seats: true,
      },
    });

    res.status(200).json({
      success: true,
      total: categories.length,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Seat Category
export const updateSeatCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Seat category ID is required",
      });

      return;
    }

    const category = await prisma.seatCategory.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Seat category not found",
      });
      return;
    }

    const updated = await prisma.seatCategory.update({
      where: {
        id,
      },

      data: {
        name: req.body.name ?? category.name,

        price: req.body.price ? Number(req.body.price) : category.price,

        totalSeats: req.body.totalSeats
          ? Number(req.body.totalSeats)
          : category.totalSeats,

        color: req.body.color ?? category.color,
      },
    });

    res.status(200).json({
      success: true,
      message: "Seat category updated",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Seat Category
export const deleteSeatCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = getParamString(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Seat category ID is required",
      });

      return;
    }

    const category = await prisma.seatCategory.findUnique({
      where: {
        id,
      },

      include: {
        seats: true,
      },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Seat category not found",
      });

      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.seat.deleteMany({
        where: {
          categoryId: id,
        },
      });

      await tx.seatCategory.delete({
        where: {
          id,
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
