// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import {CustomError} from "../errors/custom-error";
import {Logger} from "../logger/logger";


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = new Logger('ErrorHandler');
    if (err instanceof CustomError) {
        logger.error(`Error occurred: ${err.message}, throwing status code: ${err.statusCode}`);
        return res.status(err.statusCode).json({ message: err.message });
    }

    logger.error(`An unexpected error occurred: ${err.message}`);
    res.status(500).json({ message: 'An unexpected error occurred' });
};
