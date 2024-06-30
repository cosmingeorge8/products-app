import Redis from "ioredis";
import {Server} from "socket.io";
import {createAdapter} from "@socket.io/redis-adapter";
import {server} from "../app";

export function initIo() {
    const pubClient = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    });
    const subClient = pubClient.duplicate();

// Error handling for Redis clients
    pubClient.on('error', (err) => {
        console.error('Redis pubClient error:', err);
    });

    subClient.on('error', (err) => {
        console.error('Redis subClient error:', err);
    });

    const io = new Server(server, {
        adapter: createAdapter(pubClient, subClient),
        cors: {
            origin: process.env.ORIGIN || "http://localhost:3000",
            methods: ["GET", "POST"],
        }
    });

    io.listen(Number(process.env.IO_PORT) || 4000);
    console.log('Socket.io server is running on port', process.env.IO_PORT || 4000)

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    return io;
}