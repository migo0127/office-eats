import { Severity } from "./toast.model";

export interface UserBalanceBase {
  uId: string;
  name: string;
  email: string;
  balance: number;
}

export interface UserBalanceExt extends UserBalanceBase {
  updatedAt: string;
  note: string;
  isActive: boolean;
  depositHistory?: Transaction[];
}

export interface Transaction {
  bId?: string;
  transactionTime?: string;
  type?: 'DEPOSIT' | 'ORDER_PAY' | 'REFUND' | 'OTHER';
  amount: number;
  beforeBalance: number;
  afterBalance: number;

  /** 個人管理 - 金流紀錄 */
  gId?: string;
  groupName?: string;
}

export const TRANSACTION_CONFIG: Record<string, { 
  label: string; 
  color: Severity; 
}> = {
  DEPOSIT: { label: '儲值', color: 'success' },
  ORDER_PAY: { label: '支出', color: 'danger' },
  REFUND: { label: '退款', color: 'info' },
  OTHER: { label: '其他', color: 'secondary' }
};