import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import ProductRoutes from "./routes/product-routes";
import connectDB from "./database/mongodb";
import {errorHandler} from "./middlewares/error-handler";
import UploadRoutes from "./routes/upload-routes";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.listen(4000);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

connectDB();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Allow DELETE and PATCH
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    next();
});
app.use(express.json());
app.use(fileUpload());
app.use('/products', ProductRoutes);
app.use('/upload', UploadRoutes)
app.use(errorHandler);

export { app, server, io };
