import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Order, LineItem } from '../../domain/entities/Order';
import { Product } from '../../domain/entities/Product';

interface PackingListItem {
  product_id: string;
  product_name: string;
  quantity: number;
}

interface PackingListOrder {
  order_id: string;
  customer_name: string;
  shipping_address: string;
  items: PackingListItem[];
}

export class GeneratePackingList {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(date: string): Promise<PackingListOrder[]> {
    const orders = await this.orderRepository.getOrdersByDate(date);

    if (!orders.length) {
      return [];
    }

    return Promise.all(orders.map(async (order: Order) => {
      const items = await Promise.all(order.line_items.map(async (lineItem: LineItem) => {
        const product = await this.productRepository.getProductById(lineItem.product_id);
        if (!product) {
          throw new Error(`Product not found: ${lineItem.product_id}`);
        }

        return {
          product_id: lineItem.product_id,
          product_name: lineItem.product_name,
          quantity: lineItem.quantity
        };
      }));

      return {
        order_id: order.order_id,
        customer_name: order.customer_name,
        shipping_address: order.shipping_address,
        items
      };
    }));
  }
} 