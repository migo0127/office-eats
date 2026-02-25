export interface LabelValue<T = string> {
  label: string;
  value: T;
}

export type SeverityType = "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | null | undefined;

export interface JsonData {
  title: string;
  data: any[];
}

export interface ScrollOffset {
  pc: number; // PC 高度扣除額
  portrait: number; // 手機直向高度扣除額
  landscape: number;  // 手機橫向高度扣除額
}

export const BlanceStatus = {
  LOWER: 200,
  MIDDLE: 500,
} as const;