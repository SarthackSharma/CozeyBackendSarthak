import { Product, Component, ProductEntity } from '../Product';

describe('ProductEntity', () => {
  const mockComponent: Component = {
    component_id: 'C1',
    name: 'Test Component',
    quantity: 2,
    location: 'A1'
  };

  const mockProduct: Product = {
    product_id: 'P1',
    product_name: 'Test Product',
    product_type: 'Test Type',
    components: [mockComponent]
  };

  it('should create a product entity', () => {
    const product = new ProductEntity(
      mockProduct.product_id,
      mockProduct.product_name,
      mockProduct.product_type,
      mockProduct.components
    );

    expect(product.product_id).toBe(mockProduct.product_id);
    expect(product.product_name).toBe(mockProduct.product_name);
    expect(product.product_type).toBe(mockProduct.product_type);
    expect(product.components).toEqual(mockProduct.components);
  });

  it('should create a product entity using static create method', () => {
    const product = ProductEntity.create(mockProduct);

    expect(product).toBeInstanceOf(ProductEntity);
    expect(product.product_id).toBe(mockProduct.product_id);
    expect(product.product_name).toBe(mockProduct.product_name);
    expect(product.product_type).toBe(mockProduct.product_type);
    expect(product.components).toEqual(mockProduct.components);
  });

  it('should add a component', () => {
    const product = ProductEntity.create(mockProduct);
    const newComponent: Component = {
      component_id: 'C2',
      name: 'New Component',
      quantity: 3,
      location: 'B1'
    };

    product.addComponent(newComponent);

    expect(product.components).toHaveLength(2);
    expect(product.components).toContainEqual(newComponent);
  });

  it('should calculate total component count', () => {
    const product = ProductEntity.create({
      ...mockProduct,
      components: [
        {
          component_id: 'C1',
          name: 'Component 1',
          quantity: 2,
          location: 'A1'
        },
        {
          component_id: 'C2',
          name: 'Component 2',
          quantity: 3,
          location: 'B1'
        }
      ]
    });

    expect(product.getComponentCount()).toBe(5); // 2 + 3
  });

  it('should handle empty components array', () => {
    const product = ProductEntity.create({
      ...mockProduct,
      components: []
    });

    expect(product.getComponentCount()).toBe(0);
  });

  it('should handle multiple components with zero quantity', () => {
    const product = ProductEntity.create({
      ...mockProduct,
      components: [
        {
          component_id: 'C1',
          name: 'Component 1',
          quantity: 0,
          location: 'A1'
        },
        {
          component_id: 'C2',
          name: 'Component 2',
          quantity: 0,
          location: 'B1'
        }
      ]
    });

    expect(product.getComponentCount()).toBe(0);
  });
}); 