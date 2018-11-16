import { User } from "./user";
import { Country } from "./country";
export interface VendorScore {
  vendor: User;
  country: Country;
  sales: number
}
