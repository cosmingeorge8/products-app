import {CustomError} from "./custom-error";

export class FileUploadError extends CustomError{
    constructor(message: string) {
        super(message, 400);
        this.name = 'FileUploadError';
    }
}