// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import {CustomError} from "../errors/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred' });
};
