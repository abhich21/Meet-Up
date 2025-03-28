import { NextApiRequest, NextApiResponse } from 'next'; // Import types for Next.js API request and response
import { Server } from 'socket.io'; // Import the Socket.IO server class

// Define a custom response type that extends NextApiResponse with a socket property
type CustomResponse = NextApiResponse & { socket: { server: any } };

// Socket handler function to handle Socket.IO connections
const SocketHandler = (req: NextApiRequest, res: CustomResponse) => {
    console.log("Called Socket API");

    // Check if Socket.IO server is already running
    if (res.socket?.server?.io) {
        console.log("socket already running"); // If it is, log that the socket is already running
    } else {
        // If Socket.IO is not running, initialize a new Socket.IO server
        const io = new Server(res.socket?.server);

        // Store the Socket.IO server in the server object to reuse it across requests
        res.socket!.server!.io = io;

        // Set up event listeners for socket connections
        io.on("connection", (socket) => {
            console.log("server is connected");

            // Handle 'join-room' event: A user joins a specific room
            socket?.on('join-room', (roomId, userId) => {
                console.log(`a new user ${userId} joined room - ${roomId}`);
                socket.join(roomId); // Join the specified room
                socket.broadcast.to(roomId).emit('user-connected', userId); // Notify others in the room
            });

            // Handle 'user-toggle-video' event: A user toggles their video stream
            socket?.on("user-toggle-video", (userId, roomId) => {
                console.log("user toggle video stream");

                socket.join(roomId); // Join the room if not already joined
                socket.broadcast.to(roomId).emit('user-toggle-video', userId); // Notify others in the room
            });

            // Handle 'user-toggle-audio' event: A user toggles their audio stream
            socket?.on("user-toggle-audio", (userId, roomId) => {
                console.log("user toggle audio stream");

                socket.join(roomId); // Join the room if not already joined
                socket.broadcast.to(roomId).emit('user-toggle-audio', userId); // Notify others in the room
            });

            // Handle 'user-leave' event: A user leaves the room
            socket?.on("user-leave", (userId, roomId) => {
                console.log("user toggle audio stream");

                socket.join(roomId); // Join the room if not already joined
                socket.broadcast.to(roomId).emit('user-leave', userId); // Notify others in the room
            });
        });
    }

    res.end(); // End the response
}

export default SocketHandler;
