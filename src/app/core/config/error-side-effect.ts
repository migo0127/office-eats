import { ErrorConfig, ErrorSideEffect } from "../models/error-config.model";
import { BIZ_ERROR_CODES } from "./error-code";

export const ERROR_DEFINITION: Record<keyof typeof BIZ_ERROR_CODES, ErrorConfig> = {
  /** 團購相關 */
  ORDER_CLOSED: {
    code: BIZ_ERROR_CODES.ORDER_CLOSED,
    message: '該團購已截止收單囉！',
    action: ErrorSideEffect.REFRESH
  },
  ORDER_FULL: {
    code: BIZ_ERROR_CODES.ORDER_FULL,
    message: '抱歉，參團人數已達上限。',
  },
  ITEM_OUT_OF_STOCK: {
    code: BIZ_ERROR_CODES.ITEM_OUT_OF_STOCK,
    message: '商品已經被搶購一空了！',
  },
  MIN_ORDER_NOT_MET: {
    code: BIZ_ERROR_CODES.MIN_ORDER_NOT_MET,
    message: '未達起訂門檻。',
  },
  ORDER_NOT_FOUND: {
    code: BIZ_ERROR_CODES.ORDER_NOT_FOUND,
    message: '找不到此團購活動，請確認連結是否正確。',
    action: ErrorSideEffect.REDIRECT
  },
  DUPLICATE_ORDER: {
    code: BIZ_ERROR_CODES.DUPLICATE_ORDER,
    message: '您已參加過此團購。',
  },

  /** 支付相關 */
  PAYMENT_FAILED: {
    code: BIZ_ERROR_CODES.PAYMENT_FAILED,
    message: '支付處理失敗，請重新嘗試。',
  },
  PAYMENT_TIMEOUT: {
    code: BIZ_ERROR_CODES.PAYMENT_TIMEOUT,
    message: '支付超時，請重新操作。',
  },
  BALANCE_INSUFFICIENT: {
    code: BIZ_ERROR_CODES.BALANCE_INSUFFICIENT,
    message: '帳戶餘額不足。',
  },
  REFUND_ERROR: {
    code: BIZ_ERROR_CODES.REFUND_ERROR,
    message: '退款處理異常，請聯繫客服。',
  },

  /** 操作/資料檢核相關 */
  INVALID_OPERATION: {
    code: BIZ_ERROR_CODES.INVALID_OPERATION,
    message: '無效的操作。',
  },
  INVALID_PARAMETER: {
    code: BIZ_ERROR_CODES.INVALID_PARAMETER,
    message: '輸入資料有誤，請檢查欄位。',
  },
  UPLOAD_FAILED: {
    code: BIZ_ERROR_CODES.UPLOAD_FAILED,
    message: '上傳失敗，請檢查檔案格式。',
  },
  DATA_CONFLICT: {
    code: BIZ_ERROR_CODES.DATA_CONFLICT,
    message: '資料已被他人修改，請重新整理頁面。',
    action: ErrorSideEffect.REFRESH
  },
  CAPTCHA_ERROR: {
    code: BIZ_ERROR_CODES.CAPTCHA_ERROR,
    message: '驗證碼錯誤或已過期。',
  },
  MOCK_DATA_MISSING: {
    code: BIZ_ERROR_CODES.MOCK_DATA_MISSING,
    message: '找不到對應的 Mock 假資料設定。'
  },

  /** 帳號/權限相關 */
  USER_UNAUTHORIZED: {
    code: BIZ_ERROR_CODES.USER_UNAUTHORIZED,
    message: '登入逾時，請重新登入。',
    action: ErrorSideEffect.LOGOUT
  },
  USER_FORBIDDEN: {
    code: BIZ_ERROR_CODES.USER_FORBIDDEN,
    message: '您沒有權限執行此操作。',
    action: ErrorSideEffect.REDIRECT
  },
  USER_BANNED: {
    code: BIZ_ERROR_CODES.USER_BANNED,
    message: '您的帳號已被停權，請洽管理員。',
    action: ErrorSideEffect.LOGOUT
  },
};

export const ERROR_LOOKUP = Object.values(ERROR_DEFINITION).reduce((acc, curr) => {
  acc[curr.code] = curr;
  return acc;
}, {} as Record<string, ErrorConfig>);