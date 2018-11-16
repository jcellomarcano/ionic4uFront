import { Price } from "./price";
export interface Product {
  id?: number,
  name: string,
  reference: string,
  prices?: Price[],
}
