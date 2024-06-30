import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an asynchronous function in a Promise and handles any errors that occur.
 * If an error occurs, it is passed to the next middleware in the chain.
 * @param {Function} fn - The asynchronous function to wrap.
 * @returns {Function} A function that takes a request, a response, and a next function, and calls the wrapped function with these arguments.
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};