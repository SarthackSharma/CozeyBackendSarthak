import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import * as fs from 'fs';
import * as path from 'path';

export class JsonProductRepository implements IProductRepository {
  private productsPath: string;

  constructor() {
    this.productsPath = path.join(__dirname, '..', '..', '..', 'data', 'products.json');
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      const products = await this.getAllProducts();
      return products.find(p => p.product_id === productId) || null;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const data = fs.readFileSync(this.productsPath, 'utf-8');
      const productsData = JSON.parse(data);
      return productsData.products;
    } catch (error) {
      throw error;
    }
  }
} 