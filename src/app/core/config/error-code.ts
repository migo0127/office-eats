/** 業務錯誤碼 */
export const BIZ_ERROR_CODES = {
  /** 團購相關 1000 ~ 1999 */
  ORDER_CLOSED: '1001',      // 團購已截止
  ORDER_FULL: '1002',        // 團購人數已滿
  ITEM_OUT_OF_STOCK: '1003', // 商品庫存不足
  MIN_ORDER_NOT_MET: '1004', // 未達起訂門檻
  ORDER_NOT_FOUND: '1005',   // 找不到該團購活動
  DUPLICATE_ORDER: '1006',   // 重複下單 (例如限購一次)

  /** 支付相關 2000 ~ 2999 */
  PAYMENT_FAILED: '2001',    // 支付失敗
  PAYMENT_TIMEOUT: '2002',   // 支付超時
  BALANCE_INSUFFICIENT: '2003', // 餘額不足
  REFUND_ERROR: '2004',      // 退款處理異常

  /** 操作/資料檢核相關 8000 ~ 8999 */
  INVALID_OPERATION: '8001', // 無效操作
  INVALID_PARAMETER: '8002', // 請求參數格式錯誤
  UPLOAD_FAILED: '8003',     // 檔案上傳失敗
  DATA_CONFLICT: '8004',     // 資料衝突 (例如多人同時修改同一筆記錄)
  CAPTCHA_ERROR: '8005',     // 驗證碼錯誤
  MOCK_DATA_MISSING: '8999', // 找不到對應的 Mock 假資料設定
  

  /** 帳號/權限相關 9000 ~ 9999 */
  USER_UNAUTHORIZED: '9001', // 尚未登入 (Authentication Required)
  USER_FORBIDDEN: '9002',    // 權限不足 (Authorization Failed)
  USER_BANNED: '9999',       // 帳號被封鎖
} as const;

