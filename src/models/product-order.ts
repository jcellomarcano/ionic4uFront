export interface ProductOrder {
  product: number, // id of the product
  product_name?: string, // Product name
  quantity: number, // quantity of the order
  name?: string,
  price: number  // single price
}
