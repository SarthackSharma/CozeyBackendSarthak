import { OrderEntity, Order } from '../Order';

describe('OrderEntity', () => {
  const mockOrderData = {
    order_id: '123',
    order_total: 200,
    order_date: '2024-02-14',
    shipping_address: '123 Test St',
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    line_items: [
      {
        line_item_id: '1',
        product_id: 'P1',
        product_name: 'Test Product',
        price: 100,
        quantity: 1
      }
    ]
  };

  it('should create an order', () => {
    const order = OrderEntity.create(mockOrderData);
    expect(order).toBeInstanceOf(OrderEntity);
    expect(order.order_id).toBe(mockOrderData.order_id);
  });

  it('should calculate total correctly', () => {
    const order = OrderEntity.create(mockOrderData);
    expect(order.order_total).toBe(200);
  });

  it('should add line item and recalculate total', () => {
    const order = OrderEntity.create(mockOrderData);
    const newLineItem = {
      line_item_id: '2',
      product_id: 'P2',
      product_name: 'Another Product',
      price: 150,
      quantity: 1
    };
    order.addLineItem(newLineItem);
    expect(order.line_items.length).toBe(2);
    expect(order.order_total).toBe(250);
  });
}); 