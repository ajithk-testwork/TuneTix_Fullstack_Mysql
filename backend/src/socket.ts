import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.FRONTEND_URL ||
        "http://localhost:5173",

      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "🟢 Socket connected:",
      socket.id,
    );

    socket.on("join-admin", () => {
      socket.join("admins");

      console.log(
        `Admin joined: ${socket.id}`,
      );
    });

    socket.on("join-event", (eventId: string) => {
      socket.join(`event:${eventId}`);

      console.log(
        `Socket ${socket.id} joined event:${eventId}`,
      );
    });

    socket.on("disconnect", (reason) => {
      console.log(
        "🔴 Socket disconnected:",
        socket.id,
        reason,
      );
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized",
    );
  }

  return io;
};