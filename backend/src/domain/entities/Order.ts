export interface LineItem {
  line_item_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
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

export class OrderEntity implements Order {
  constructor(
    public order_id: string,
    public order_total: number,
    public order_date: string,
    public shipping_address: string,
    public customer_name: string,
    public customer_email: string,
    public line_items: LineItem[]
  ) {}

  static create(orderData: Order): OrderEntity {
    return new OrderEntity(
      orderData.order_id,
      orderData.order_total,
      orderData.order_date,
      orderData.shipping_address,
      orderData.customer_name,
      orderData.customer_email,
      orderData.line_items
    );
  }

  addLineItem(lineItem: LineItem): void {
    this.line_items.push(lineItem);
    this.recalculateTotal();
  }

  private recalculateTotal(): void {
    this.order_total = this.line_items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
} 