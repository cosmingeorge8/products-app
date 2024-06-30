import {IProduct, Product} from "../src/models/product";
import {ProductService} from "../src/services/product-service";
import {NotFoundError} from "../src/errors/not-found-error";

jest.mock('../src/models/product' );

describe('ProductService', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('getAllProducts returns all products when products exist', async () => {
        const mockProducts: Array<IProduct> = [];
        const productA = new Product();
        productA.name = 'Product A';
        productA.price =   100;
        productA.image = 'imageA';
        productA.stock = 10;
        mockProducts.push(productA);
        (Product.find as jest.Mock).mockResolvedValue(mockProducts);

        const products = await ProductService.getAllProducts();

        expect(products).toEqual(mockProducts);
    });

    it('getAllProducts throws NotFoundError when no products exist', async () => {
        (Product.find as jest.Mock).mockResolvedValue([]);

        await expect(ProductService.getAllProducts()).rejects.toThrow(NotFoundError);
    });

    it('createProduct creates a new product', async () => {
        const mockProduct = new Product();
        mockProduct.name = 'Product A';
        mockProduct.price =   100;
        mockProduct.image = 'imageA';
        mockProduct.stock = 10;
        (Product.create as jest.Mock).mockResolvedValue(mockProduct);

        const product = await ProductService.createProduct(mockProduct);

        expect(product).toEqual(mockProduct);
    });

    it('updateProduct updates a product', async () => {
        const mockProduct = new Product();
        mockProduct.name = 'Product A';
        mockProduct.price =   100;
        mockProduct.image = 'imageA';
        mockProduct.stock = 10;
        (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProduct);

        const product = await ProductService.updateProduct('1', mockProduct);

        expect(product).toEqual(mockProduct);
    });

    it('updateProduct removes signed URL from image field', async () => {
        const mockProduct = new Product();
        mockProduct.name = 'Product A';
        mockProduct.price =   100;
        mockProduct.image = 'imageA?X-Amz';
        mockProduct.stock = 10;
        const updatedProduct = {id: '1', name: 'Product 1', image: 'image.jpg'};
        (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProduct);

        const product = await ProductService.updateProduct('1', mockProduct);

        expect(product).toEqual(updatedProduct);
    });

    it('deleteProduct deletes a product', async () => {
        const mockProduct = new Product();
        mockProduct.name = 'Product A';
        mockProduct.price =   100;
        mockProduct.image = 'imageA';
        mockProduct.stock = 10;
        (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProduct);

        await ProductService.deleteProduct('1');

        expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('deleteProduct throws NotFoundError when no product found', async () => {
        (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await expect(ProductService.deleteProduct('1')).rejects.toThrow(NotFoundError);
    });
});