import { Product } from '../entities/Product';

export interface IProductRepository {
  getProductById(productId: string): Promise<Product | null>;
  getAllProducts(): Promise<Product[]>;
} 