import { Request, Response } from 'express';
import {UploadedFile} from "express-fileupload";
import {FileUploadError} from "../errors/file-upload-error";
import {UploadService} from "../services/upload-service";

/**
 * UploadController class handles all the file upload operations.
 */
export class UploadController {

    /**
     * Handles the file upload operation.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @throws {FileUploadError} If no file is uploaded.
     */
    static async handleUpload(req: Request, res: Response) {
        const files = req.files;
        // Check if there is a file
        if (!files) {
           throw new FileUploadError('No file uploaded');
        }
        // Get the file
        const file = files.file as UploadedFile;

        // Save the file
        const url=  await UploadService.uploadFile(file);

        res.status(200).send({imageUrl: url});
    }
}