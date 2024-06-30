export abstract class CustomError extends Error {
    statusCode: number;
    message: string;

    protected constructor(message: string , statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}