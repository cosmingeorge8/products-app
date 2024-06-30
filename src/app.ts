import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import ProductRoutes from "./routes/product-routes";
import connectDB from "./database/mongodb";
import { errorHandler } from "./middlewares/error-handler";
import UploadRoutes from "./routes/upload-routes";
import fileUpload from "express-fileupload";
import {initIo} from "./io/io";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    next();
});
app.use(express.json());
app.use(fileUpload());
app.use('/products', ProductRoutes);
app.use('/upload', UploadRoutes);
app.use(errorHandler);

const io = initIo();
export { app, server, io };
