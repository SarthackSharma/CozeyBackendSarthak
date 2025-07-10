import { Order, GiftBoxes, PickingItem, PackingOrder, Product, Component } from '../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * I created this WarehouseService as the core of our system. 
 * 1. Load and manage product data
 * 2. Process daily orders
 * 3. Generate picking and packing lists
 * 
 * This service handles all that logic in one place, making it easier to maintain
 * and modify as our warehouse processes evolve.
 */
export class WarehouseService {
  private products: any;
  private ordersPath: string;

  constructor() {
    try {
      // Using path.join for better cross-platform compatibility
      // __dirname in compiled js will be in dist/services, so we need to go up to backend root
      const productsPath = path.join(__dirname, '..', '..', 'data', 'products.json');
      this.ordersPath = path.join(__dirname, '..', '..', 'data', 'orders.json');
      
      console.log('Loading products from:', productsPath);
      console.log('Loading orders from:', this.ordersPath);

      if (!fs.existsSync(productsPath)) {
        throw new Error(`Products file missing at: ${productsPath}. Please check data directory.`);
      }
      if (!fs.existsSync(this.ordersPath)) {
        throw new Error(`Orders file missing at: ${this.ordersPath}. Please check data directory.`);
      }

      const productsContent = fs.readFileSync(productsPath, 'utf-8');
      const productsData = JSON.parse(productsContent);
      
      if (!productsData.products) {
        throw new Error('Products data is invalid - missing products array');
      }
      
      this.products = productsData.products;
    } catch (error) {
      throw error;
    }
  }

  private getOrdersByDate(date: string): Order[] {
    try {
      console.log('Getting orders for date:', date);
      const ordersContent = fs.readFileSync(this.ordersPath, 'utf-8');
      const ordersData = JSON.parse(ordersContent);
      
      if (!Array.isArray(ordersData.orders)) {
        throw new Error('Orders data is invalid - missing orders array');
      }

      console.log('Total orders in system:', ordersData.orders.length);
      const filteredOrders = ordersData.orders.filter((order: Order) => {
        console.log('Comparing dates:', {
          orderDate: order.order_date,
          requestedDate: date,
          matches: order.order_date === date
        });
        return order.order_date === date;
      });
      console.log('Filtered orders:', filteredOrders.length);

      return filteredOrders;
    } catch (error) {
      console.error('Error in getOrdersByDate:', error);
      throw error;
    }
  }

  public generatePickingList(date: string): PickingItem[] {
    try {
      const orders = this.getOrdersByDate(date);
      const pickingMap = new Map<string, PickingItem>();

      orders.forEach(order => {
        order.line_items.forEach(lineItem => {
          const giftBox = this.products.find((box: any) => box.product_id === lineItem.product_id);
          
          if (!giftBox) {
            throw new Error(`Product ${lineItem.product_id} not found in catalog`);
          }

          giftBox.components.forEach((component: Component) => {
            const existingItem = pickingMap.get(component.component_id);
            if (existingItem) {
              existingItem.quantity += component.quantity * (lineItem.quantity || 1);
            } else {
              pickingMap.set(component.component_id, {
                product_id: component.component_id,
                name: component.name,
                quantity: component.quantity * (lineItem.quantity || 1),
                location: component.location
              });
            }
          });
        });
      });

      return Array.from(pickingMap.values());
    } catch (error) {
      throw error;
    }
  }

  public generatePackingList(date: string): PackingOrder[] {
    try {
      const orders = this.getOrdersByDate(date);
      
      return orders.map(order => {
        const items = order.line_items.map(lineItem => {
          const giftBox = this.products.find((box: any) => box.product_id === lineItem.product_id);
          
          if (!giftBox) {
            throw new Error(`Product ${lineItem.product_id} not found in catalog`);
          }

          return {
            gift_box_name: giftBox.product_name,
            components: giftBox.components.map((component: Component) => ({
              ...component,
              quantity: component.quantity * (lineItem.quantity || 1)
            }))
          };
        });

        return {
          order_id: order.order_id,
          order_date: order.order_date,
          customer_name: order.customer_name,
          shipping_address: order.shipping_address,
          items
        };
      });
    } catch (error) {
      throw error;
    }
  }
} 