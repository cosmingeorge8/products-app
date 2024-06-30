import {UploadedFile} from "express-fileupload";
import {Logger} from "../logger/logger";
import {FileUploadError} from "../errors/file-upload-error";
import {S3} from "aws-sdk";


export class UploadService {

    private static readonly logger = new Logger(UploadService.name);
    private static s3 = new S3();

    static async uploadFile(file: UploadedFile): Promise<string> {
        this.logger.info('Uploading image');
        //Check if the file is an image
        if (!file.mimetype.startsWith('image')) {
            throw new FileUploadError('Only images are allowed');
        }
        return await this.uploadToS3(file);
    }

    private static async uploadToS3(file: UploadedFile) {
        this.logger.info(`Uploading image to S3 ${file.name}`);
        //Upload the file to S3
        const params = {
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: `${Date.now()}_${file.name}`,
            Body: file.data,
            ContentType: file.mimetype
        };

        try {
            const data = await this.s3.upload(params).promise();
            this.logger.info(`Image uploaded to S3 ${data.Location}`);
            return data.Location;
        } catch (e) {
            this.logger.error(`Error uploading image to S3 ${e}`);
            throw new FileUploadError('Error uploading image');
        }
    }
}