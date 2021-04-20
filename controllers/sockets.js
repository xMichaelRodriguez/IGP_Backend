export const connectionSocket = (server, io) => {
  io.on("connection", (socket) => {
    console.log(socket.id);
  });
};
