import { HEADER_MOCK } from "./header-mock";
import { DASHBOARD_MOCK } from "./dashboard-mock";
import { ORDER_MOCK } from "./order-mock";
import { MY_ORDERS_MOCK } from "./my-orders-mock";

export const MOCK_REGISTRY: Record<string, any> = {
  ...HEADER_MOCK,
  ...DASHBOARD_MOCK,
  ...ORDER_MOCK,
  ...MY_ORDERS_MOCK,
}