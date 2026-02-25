import { LabelValue } from "./common.model";

export interface StatusItem extends LabelValue<number> {
  icon?: string;
  color?: string;
  unit?: string;
  isPrefix?: boolean;
  path?: string;
  queryParams?: Record<string, string>;
}