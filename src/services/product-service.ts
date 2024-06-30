import {IProduct, Product} from "../models/product";
import {NotFoundError} from "../errors/not-found-error";
import {Logger} from "../logger/logger";

export class ProductService {
    private static readonly logger = new Logger(ProductService.name);

    static async getAllProducts() {
        this.logger.info('Fetching all products');
        const products = await  Product.find();
        if (!products || products.length === 0) {
            this.logger.warn('No products found');
            throw new NotFoundError('No products found');
        }
        this.logger.info('Products fetched successfully');
        return products;
    }
    static async createProduct(product: IProduct) {
        return Product.create(product);
    }
    static async getProductById(id: number) {
        return Product.findById(id);
    }
    static async updateProduct(id: number, product: any) {
        return Product.findByIdAndUpdate(id, product, { new: true });
    }
    static async deleteProduct(id: string) {
        this.logger.info(`Deleting product with ID: ${id}`);
        const result = await Product.findByIdAndDelete(id);
        if (!result) {
            this.logger.warn(`No product found with ID: ${id}`);
            throw new NotFoundError('No product found');
        }
        this.logger.info('Product deleted successfully');
    }
}