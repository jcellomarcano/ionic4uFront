import { Role } from "./role";
import { Profile } from "./profile";

export interface User {
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  last_login: string,
  date_joined: string,
  groups?: Role[],
  profile?: Profile,

}
