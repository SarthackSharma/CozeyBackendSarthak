import { JsonProductRepository } from '../JsonProductRepository';
import { Product } from '../../../domain/entities/Product';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('JsonProductRepository', () => {
  const mockProduct: Product = {
    product_id: 'P1',
    product_name: 'Test Product',
    product_type: 'Test Type',
    components: [
      {
        component_id: 'C1',
        name: 'Test Component',
        quantity: 2,
        location: 'A1'
      }
    ]
  };

  const mockProductsData = {
    products: [mockProduct]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockReturnValue('/mock/path/products.json');
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProductsData));
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const repository = new JsonProductRepository();
      const products = await repository.getAllProducts();

      expect(products).toEqual([mockProduct]);
      expect(fs.readFileSync).toHaveBeenCalledWith('/mock/path/products.json', 'utf-8');
    });

    it('should throw error for invalid JSON', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      const repository = new JsonProductRepository();

      await expect(repository.getAllProducts())
        .rejects
        .toThrow();
    });

    it('should throw error for file read error', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });
      const repository = new JsonProductRepository();

      await expect(repository.getAllProducts())
        .rejects
        .toThrow('File read error');
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const repository = new JsonProductRepository();
      const product = await repository.getProductById('P1');

      expect(product).toEqual(mockProduct);
    });

    it('should return null for non-existent product', async () => {
      const repository = new JsonProductRepository();
      const product = await repository.getProductById('non-existent');

      expect(product).toBeNull();
    });

    it('should throw error for invalid JSON', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      const repository = new JsonProductRepository();

      await expect(repository.getProductById('P1'))
        .rejects
        .toThrow();
    });

    it('should throw error for file read error', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });
      const repository = new JsonProductRepository();

      await expect(repository.getProductById('P1'))
        .rejects
        .toThrow('File read error');
    });
  });
}); 