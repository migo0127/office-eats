export interface ApiResponse<T> {
  success: boolean;    // 業務執行結果
  code: string;       // 業務錯誤碼 (如 '1001')
  message: string;    // 錯誤或成功訊息
  data: T;            // 真正的資料主體
}