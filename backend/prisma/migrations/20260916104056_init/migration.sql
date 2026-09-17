-- CreateEnum
CREATE TYPE "booking_bookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "booking_paymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "event_category" AS ENUM ('MUSIC', 'CONCERT', 'DANCE', 'DJ_NIGHT', 'COMEDY', 'MOVIE', 'SPORTS', 'CRICKET', 'FOOTBALL', 'WORKSHOP', 'SEMINAR', 'CONFERENCE', 'FESTIVAL', 'THEATRE', 'EXHIBITION', 'FOOD_FEST', 'TECH', 'GAMING', 'CULTURAL', 'COLLEGE', 'KIDS', 'OTHER');

-- CreateEnum
CREATE TYPE "event_language" AS ENUM ('TAMIL', 'ENGLISH', 'HINDI', 'TELUGU', 'MALAYALAM', 'KANNADA', 'MULTI_LANGUAGE');

-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "bookingStatus" "booking_bookingStatus" NOT NULL,
    "paymentStatus" "booking_paymentStatus" NOT NULL,
    "qrCode" TEXT,
    "ticketNumber" TEXT NOT NULL,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "checkedInBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "image" TEXT,
    "totalTickets" INTEGER NOT NULL,
    "availableTickets" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "event_category" NOT NULL,
    "duration" INTEGER NOT NULL,
    "language" "event_language" NOT NULL,
    "minimumAge" INTEGER NOT NULL DEFAULT 0,
    "organizer" TEXT,
    "status" "event_status" NOT NULL DEFAULT 'UPCOMING',
    "venue" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seatCategory" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rowLetter" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seatCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "seatCode" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookingSeat" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookingSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT true,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailOtp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_ticketNumber_key" ON "booking"("ticketNumber");

-- CreateIndex
CREATE INDEX "booking_eventId_idx" ON "booking"("eventId");

-- CreateIndex
CREATE INDEX "booking_userId_idx" ON "booking"("userId");

-- CreateIndex
CREATE INDEX "booking_eventId_checkedIn_idx" ON "booking"("eventId", "checkedIn");

-- CreateIndex
CREATE INDEX "event_createdById_idx" ON "event"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "seat_eventId_seatCode_key" ON "seat"("eventId", "seatCode");

-- CreateIndex
CREATE UNIQUE INDEX "bookingSeat_seatId_key" ON "bookingSeat"("seatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "user"("phoneNumber");

-- CreateIndex
CREATE INDEX "EmailOtp_userId_purpose_idx" ON "EmailOtp"("userId", "purpose");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seatCategory" ADD CONSTRAINT "seatCategory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "seatCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookingSeat" ADD CONSTRAINT "bookingSeat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookingSeat" ADD CONSTRAINT "bookingSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailOtp" ADD CONSTRAINT "EmailOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
