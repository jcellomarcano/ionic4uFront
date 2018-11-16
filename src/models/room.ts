import { User } from "./user";
export interface Room {
  id: number,
  vendor1: User,
  vendor2: User,
  unread_messages: number
}
