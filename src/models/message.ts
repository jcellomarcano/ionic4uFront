export interface Message {
  id: number,
  datetime: string,
  sent_by: {
    id: number,
    username: string
  },
  message: string
}
