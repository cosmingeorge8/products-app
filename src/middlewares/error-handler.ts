// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import {CustomError} from "../errors/custom-error";
import {Logger} from "../logger/logger";

/**
 * Error handling middleware for Express.js.
 * If the error is an instance of CustomError, it logs the error message and sends a response with the error's status code and message.
 * If the error is not an instance of CustomError, it logs the error message and sends a response with status code 500 and a generic error message.
 * @param {Error} err - The error that occurred.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = new Logger('ErrorHandler');
    if (err instanceof CustomError) {
        logger.error(`Error occurred: ${err.message}, throwing status code: ${err.statusCode}`);
        return res.status(err.statusCode).json({ message: err.message });
    }

    logger.error(`An unexpected error occurred: ${err.message}`);
    res.status(500).json({ message: 'An unexpected error occurred' });
};