import {Request, Response} from "express";
import {io} from '../app';
import {ProductService} from "../services/product-service";
import {body, param, validationResult} from "express-validator";

export class ProductController {
    static validate(method: string) {
        switch (method) {
            case 'createProduct': {
                return [
                    body('name').isString().withMessage('Name should be a string'),
                    body('stock').isInt({min: 0}).withMessage('Stock should be a non-negative integer'),
                    body('price').isFloat({min: 0}).withMessage('Price should be a non-negative number'),
                    body('image').isURL().withMessage('Image URL should be a valid URL')
                ];
            }
            case 'deleteProduct': {
                return [
                    param('id').exists().withMessage('ID is required')
                ]
            }
            default: {
                return [];
            }
        }
    }

    static async getProducts(req: Request, res: Response) {
        const products = await ProductService.getAllProducts();
        res.status(200).send(products);
    }

    static async createProduct(req: Request, res: Response) {
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const product = await ProductService.createProduct(req.body);
        io.emit('productChange', product);
        res.status(201).json(product);
    }

    static async deleteProduct(req: Request, res: Response) {
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const product = await ProductService.deleteProduct(req.params.id);
        io.emit('productChange', product);
        res.status(204);
    }
}




