import { Router } from 'express';
import {asyncHandler} from "../middlewares/async-handler";
import {UploadController} from "../controllers/upload-controller";

const router = Router();

router.post('/', asyncHandler(UploadController.handleUpload));

export default router;
