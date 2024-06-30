import { Router } from 'express';
import {ProductController} from "../controllers/product-controller";
import {asyncHandler} from "../middlewares/async-handler";

const router = Router();

router.get('/', asyncHandler(ProductController.getProducts));
router.post('/', ProductController.validate('createProduct'), asyncHandler(ProductController.createProduct));
router.delete('/:id', ProductController.validate('deleteProduct'), asyncHandler(ProductController.deleteProduct));

export default router;
