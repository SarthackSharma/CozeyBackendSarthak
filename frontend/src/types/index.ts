export interface Component {
  component_id: string;
  name: string;
  quantity: number;
  location: string;
}

export interface Product {
  product_id: string;
  product_name: string;
  product_type: string;
  components: Component[];
}

export interface PickingItem {
  product_id: string;
  name: string;
  quantity: number;
  location: string;
}

export interface PackingOrderItem {
  gift_box_name: string;
  components: Component[];
}

export interface PackingOrder {
  order_id: string;
  order_date: string;
  customer_name: string;
  shipping_address: string;
  items: PackingOrderItem[];
}

export interface Order {
  order_id: string;
  order_date: string;
  customer_name: string;
  shipping_address: string;
  line_items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
  }>;
} 