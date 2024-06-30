import {Request, Response} from "express";
import {io} from '../app';
import {ProductService} from "../services/product-service";
import {body, param, validationResult} from "express-validator";
import {UploadService} from "../services/upload-service";

/**
 * ProductController class handles all the product related operations.
 */
export class ProductController {
    /**
     * Validates the request based on the method type.
     * @param {string} method - The method type.
     * @returns {Array} - Returns an array of validation rules.
     */
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

    /**
     * Fetches all the products and sends them as a response.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getProducts(req: Request, res: Response) {
        const products = await ProductService.getAllProducts();

        products.forEach(product => {
           product.image = UploadService.getSignedUrl(product.image);
        });

        res.status(200).send(products);
    }

    /**
     * Creates a new product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
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

    /**
     * Deletes a product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
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

    /**
     * Updates a product.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async updateProduct(req: Request, res: Response) {
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const product = await ProductService.updateProduct(req.params.id, req.body);
        io.emit('productChange', product);
        res.status(200).json(product);
    }
}