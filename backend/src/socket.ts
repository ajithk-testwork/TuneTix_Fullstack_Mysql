import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // Admin joins this room
    socket.on("join-admin", () => {
      socket.join("admins");

      console.log(`👨‍💼 Admin joined: ${socket.id}`);
    });

    // Admin joins a particular event
    socket.on("join-event", (eventId: string) => {
      socket.join(`event:${eventId}`);

      console.log(`🎫 Socket ${socket.id} joined event:${eventId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
