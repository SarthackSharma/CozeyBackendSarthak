export interface Product {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface Component {
  component_id: string;
  name: string;
  quantity: number;
  location: string;
}

export interface GiftBox {
  product_id: string;
  product_name: string;
  price: number;
  description: string;
  components: Component[];
}

export interface GiftBoxes {
  [key: string]: GiftBox;
}

export interface LineItem {
  line_item_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity?: number; // Optional quantity field, defaults to 1 if not provided
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

export interface PickingItem {
  product_id: string;
  name: string;
  quantity: number;
  location: string;
}

export interface PackingOrder {
  order_id: string;
  order_date: string;
  customer_name: string;
  shipping_address: string;
  items: {
    gift_box_name: string;
    components: Component[];
  }[];
} 