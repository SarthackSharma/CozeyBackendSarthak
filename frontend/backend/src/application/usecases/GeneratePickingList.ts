import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Order } from '../../domain/entities/Order';
import { Product, Component } from '../../domain/entities/Product';

interface PickingListItem {
  component_id: string;
  name: string;
  quantity: number;
  location: string;
}

interface PickingListOrder {
  order_id: string;
  customer_name: string;
  shipping_address: string;
  items: PickingListItem[];
}

export class GeneratePickingList {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(date: string): Promise<PickingListOrder[]> {
    const orders = await this.orderRepository.getOrdersByDate(date);
    const products = await this.productRepository.getAllProducts();

    return Promise.all(orders.map(async (order: Order) => {
      const items = await Promise.all(order.line_items.map(async (lineItem) => {
        const product = products.find(p => p.product_id === lineItem.product_id);
        if (!product) {
          throw new Error(`Product not found: ${lineItem.product_id}`);
        }

        // For each line item, we need to get all components and multiply their quantities
        return product.components.map(component => ({
          component_id: component.component_id,
          name: component.name,
          quantity: component.quantity * lineItem.quantity,
          location: component.location
        }));
      }));

      return {
        order_id: order.order_id,
        customer_name: order.customer_name,
        shipping_address: order.shipping_address,
        items: items.flat()
      };
    }));
  }
} 