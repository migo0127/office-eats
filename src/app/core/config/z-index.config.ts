export const Z_INDEX = {
  /** 基礎層級 (預設) */
  BASE: 0,
  
  /** 導覽列、側邊欄 (Layout 級別) */
  NAVBAR: 100,
  
  /** 下拉選單、提示框 (Overlay 級別) */
  DROPDOWN: 200,
  TOOLTIP: 300,

  /** 彈窗、對話框 (Dialog 級別) */
  DIALOG: 1000,

  /** 全域通知 (Toast 級別) - 需高於 Dialog */
  TOAST: 2000,

  /** 全域讀取遮罩 (Loading 級別) - 最高層級，阻斷所有操作 */
  LOADING: 9999
} as const;