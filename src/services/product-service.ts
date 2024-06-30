import {IProduct, Product} from "../models/product";
import {NotFoundError} from "../errors/not-found-error";
import {Logger} from "../logger/logger";

/**
 * Service class for handling product-related operations.
 */
export class ProductService {
    /**
     * Logger instance for logging messages related to ProductService operations.
     */
    private static readonly logger = new Logger(ProductService.name);

    /**
     * Fetches all products from the database.
     * If no products are found, it throws a NotFoundError.
     * @returns {Promise<IProduct[]>} A promise that resolves to an array of products.
     * @throws {NotFoundError} If no products are found.
     */
    static async getAllProducts() {
        this.logger.info('Fetching all products');
        const products = await Product.find();
        if (!products || products.length === 0) {
            this.logger.warn('No products found');
            throw new NotFoundError('No products found');
        }
        this.logger.info('Products fetched successfully');
        return products;
    }

    /**
     * Creates a new product in the database.
     * @param {IProduct} product - The product to create.
     * @returns {Promise<IProduct>} A promise that resolves to the created product.
     */
    static async createProduct(product: IProduct) {
        return Product.create(product);
    }

    /**
     * Updates a product in the database.
     * If the image field of the product contains a signed URL, it removes the signed URL.
     * @param {string} id - The ID of the product to update.
     * @param {IProduct} product - The product data to update.
     * @returns {Promise<IProduct | null>} A promise that resolves to the updated product, or null if the product is not found.
     */
    static async updateProduct(id: string, product: IProduct) {
        this.logger.info(`Updating product with ID: ${id}`);
        if (product.image.includes('?X-Amz')) {
            product.image = product.image.split('?X-Amz')[0];
        }
        return Product.findByIdAndUpdate(id, product, {new: true});
    }

    /**
     * Deletes a product from the database.
     * If the product is not found, it throws a NotFoundError.
     * @param {string} id - The ID of the product to delete.
     * @returns {Promise<IProduct | null>} A promise that resolves to the deleted product, or null if the product is not found.
     * @throws {NotFoundError} If the product is not found.
     */
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