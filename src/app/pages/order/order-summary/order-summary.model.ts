import { OrderItem } from "@shared/models/group-buy-common.model";

export interface OrderedItems {
  gId: string;
  uId: string;
  orderedItems: OrderItem[];
}