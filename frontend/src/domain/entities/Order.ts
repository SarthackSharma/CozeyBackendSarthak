export interface LineItem {
  line_item_id: string;
  product_id: string;
  product_name: string;
  price: number;
}

export interface Order {
  order_id: string;
  order_total: number;
  order_date: string;
  shipping_address: string;
  customer_name: string;
  customer_email: string;
  line_items: LineItem[];
}

export class OrderModel {
  constructor(private readonly order: Order) {}

  get id(): string {
    return this.order.order_id;
  }

  get total(): number {
    return this.order.order_total;
  }

  get date(): string {
    return this.order.order_date;
  }

  get customerName(): string {
    return this.order.customer_name;
  }

  get shippingAddress(): string {
    return this.order.shipping_address;
  }

  get items(): LineItem[] {
    return [...this.order.line_items];
  }

  toJSON(): Order {
    return { ...this.order };
  }
} 