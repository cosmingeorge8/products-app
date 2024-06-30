import request from 'supertest';
import {ProductService} from "../src/services/product-service";
import {UploadService} from "../src/services/upload-service";
import {app} from "../src/app";

jest.mock('../src/services/product-service');
jest.mock('../src/services/upload-service');

describe('ProductController', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getProducts', () => {
        it('should return all products with signed URLs', async () => {
            const mockProducts = [
                { id: 1, name: 'Product 1', image: 'http://example.com/image1.jpg' },
                { id: 2, name: 'Product 2', image: 'http://example.com/image2.jpg' },
            ];
            (ProductService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
            (UploadService.getSignedUrl as jest.Mock).mockImplementation((url) => `${url}-signed`);

            const response = await request(app).get('/products');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { id: 1, name: 'Product 1', image: 'http://example.com/image1.jpg-signed' },
                { id: 2, name: 'Product 2', image: 'http://example.com/image2.jpg-signed' },
            ]);
        });
    });

    describe('createProduct', () => {
        it('should create a product and return it', async () => {
            const mockProduct = { id: 1, name: 'Product 1', image: 'http://example.com/image1.jpg' };
            (ProductService.createProduct as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(app).post('/products').send({
                name: 'Product 1',
                stock: 10,
                price: 100,
                image: 'http://example.com/image1.jpg',
            });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockProduct);
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(app).post('/products').send({
                name: 'Product 1',
                stock: -10, // Invalid stock
                price: 100,
                image: 'http://example.com/image1.jpg',
            });

            expect(response.status).toBe(400);
        });
    });

    describe('updateProduct', () => {
        it('should update a product and return it', async () => {
            const mockProduct = { id: 1, name: 'Product 1', image: 'http://example.com/image1.jpg' };
            (ProductService.updateProduct as jest.Mock).mockResolvedValue(mockProduct);

            const response = await request(app).put('/products/1').send({
                name: 'Updated Product',
                stock: 20,
                price: 200,
                image: 'http://example.com/image2.jpg',
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockProduct);
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(app).put('/products/1').send({
                name: 'Updated Product',
                stock: -20, // Invalid stock
                price: 200,
                image: 'http://example.com/image2.jpg',
            });

            expect(response.status).toBe(400);
        });
    });
});