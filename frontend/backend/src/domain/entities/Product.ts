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

export class ProductEntity implements Product {
  constructor(
    public product_id: string,
    public product_name: string,
    public product_type: string,
    public components: Component[]
  ) {}

  static create(productData: Product): ProductEntity {
    return new ProductEntity(
      productData.product_id,
      productData.product_name,
      productData.product_type,
      productData.components
    );
  }

  addComponent(component: Component): void {
    this.components.push(component);
  }

  getComponentCount(): number {
    return this.components.reduce((total, comp) => total + comp.quantity, 0);
  }
} 