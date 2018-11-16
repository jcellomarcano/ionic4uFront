import { ProductOrder } from "./product-order";
import { Tracking } from "./tracking";

export interface Sale {
  id?: number,
  sale_reference?: string,
  approved?: boolean,
  products? : ProductOrder[],
  photo?: string,
  vendor : number,          // must match the <id> in the url.
  vendor_name? : string,    // Vendor name
  client: string,
  phone: string,
  country: number,         // country id
  currency: number,        // country id
  address: string,
  dep_amount: number,      // amount of the deposit, if needed.
  dep_reference: string,   // deposit reference, if needed.
  total_sale?: number,     // total of the sale equals sum(products.quantity*price).
  other_charges?: number,  // total of charges
  charge_type: string,     // charge types: Na : No Charges, Sh : Standard Shipment, Si : International Shipment.
  sale_type: string,       // S : Standard, C: Credit, M: Mixed
  comment : string,        // a comment. Max 512char.
  approval_date? : string, // Approval date
  tracking?: Tracking,     // Tracking info
  sale_date?: string       // Sale date
}
