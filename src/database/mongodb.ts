import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {Product} from "../models/product";
import {Logger} from "../logger/logger";

dotenv.config();

const logger: Logger = new Logger('Database');

/**
 * Connects to the MongoDB database.
 * If the connection fails, the process will exit with code 1.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        // await seedDB();
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error('MongoDB connection failed');
        process.exit(1);
    }
};

/**
 * Seeds the MongoDB database with data
 */
const seedDB = async () => {
    logger.info('Seeding database');
    const product = new Product({
        name: 'Product 1',
        price: 100,
        image: 'placeholder.jpg',
        stock: 10
    });

    await product.save();
}

export default connectDB;