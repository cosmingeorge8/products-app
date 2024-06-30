import Redis from "ioredis";
import {Server} from "socket.io";
import {createAdapter} from "@socket.io/redis-adapter";
import {server} from "../app";
import {Logger} from "../logger/logger";

/**
 * Initializes the Socket.IO server with Redis as the adapter.
 * The server listens on the port specified by the IO_PORT environment variable.
 * If IO_PORT is not set, the server listens on port 4000.
 * The server allows CORS for the origin specified by the ORIGIN environment variable.
 * If ORIGIN is not set, the server allows CORS for "http://localhost:3000".
 * The server logs a message when a user connects or disconnects.
 * @returns {Server} The initialized Socket.IO server.
 */
export function initIo() {
    const logger: Logger = new Logger('Socket.IO');
    const pubClient = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    });
    const subClient = pubClient.duplicate();

    /**
     * Error handling for Redis clients.
     * Logs an error message when an error occurs in the Redis pubClient or subClient.
     */
    pubClient.on('error', (err) => {
        logger.error('Redis pubClient error: ' + err);
    });

    subClient.on('error', (err) => {
        logger.error('Redis subClient error: ' + err);
    });

    const io = new Server(server, {
        adapter: createAdapter(pubClient, subClient),
        cors: {
            origin: process.env.ORIGIN || "http://localhost:3000",
            methods: ["GET", "POST"],
        }
    });

    io.listen(Number(process.env.IO_PORT) || 4000);
    logger.info(`Socket.io server is running on port ${process.env.IO_PORT || 4000}`,)

    io.on('connection', (socket) => {
        logger.info('a user connected');

        socket.on('disconnect', () => {
            logger.info('user disconnected');
        });
    });
    return io;
}