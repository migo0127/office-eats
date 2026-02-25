import { ToastMessageOptions } from "primeng/api";


export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';

export type Severity = 'success' | 'info' | 'warn' |  'danger' | 'secondary';

export enum ToastActionType {
  CONFIRM = 'CONFIRM', // 點擊主按鈕
  CANCEL = 'CANCEL',   // 點擊自定義取消按鈕
  CLOSE = 'CLOSE'      // 點擊右上角 X 關閉
}

export interface ToastOptions extends ToastMessageOptions {
  showConfirmBtn?: boolean;
  confirmBtnText?: string;
  showCloseBtn?: boolean;
  closeBtnText?: string;
}