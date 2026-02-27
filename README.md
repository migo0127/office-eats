# Office Eats

https://migo0127.github.io/office-eats/#/login

**Office Eats**

是一個現代化的辦公室訂餐系統，旨在簡化團購流程、管理店家資訊，並提供使用者一個便捷的訂餐體驗。

本專案採用最新的 **Angular 20** 框架開發，並結合 **PrimeNG** 與 **PrimeFlex** 打造美觀且響應式的網頁介面。

---

## 測試帳號

- 管理員:
  - 帳號: mail 格式
  - 密碼: 1

- 使用者:
  - 帳號: mail 格式
  - 密碼: 2

---

## 🛠️ 技術棧 (Tech Stack)

此專案基於以下核心技術構建：

- **框架 (Framework)**: [Angular 20](https://angular.io/)
- **UI 元件庫 (UI Components)**: [PrimeNG 20](https://primeng.org/)
- **CSS 工具 (CSS Utilities)**: [PrimeFlex](https://primeflex.org/)
- **程式語言**: TypeScript 5.9
- **建置工具**: Angular CLI

---

## 📂 專案架構 (Project Structure)

本專案遵循 Angular 的模組化架構設計，主要目錄結構如下：

```
chase-office-eats/
├── src/
│   ├── app/
│   │   ├── auth/           # 身份驗證模組 (登入頁面、相關邏輯)
│   │   ├── core/           # 核心模組 (全域配置、攔截器、Guards、核心服務)
│   │   ├── pages/          # 頁面模組 (主要功能頁面)
│   │   │   ├── dashboard/      # 儀表板
│   │   │   ├── group-manage/   # 團購管理 (開團、群組資訊、使用者餘額)
│   │   │   ├── shop-manage/    # 店家管理 (店家列表、商品編輯)
│   │   │   ├── order/          # 訂單功能 (點餐、訂單摘要)
│   │   │   ├── user-manage/    # 使用者管理 (我的訂單、交易紀錄)
│   │   │   └── ...
│   │   ├── shared/         # 共用模組 (共用元件、Pipes、Models、常數)
│   │   └── ...
│   ├── assets/             # 靜態資源 (圖片、Logo)
│   ├── environments/       # 環境變數配置 (Dev, Prod)
│   └── styles/             # 全域樣式 (SCSS)
└── ...
```

---

## ✨ 主要功能 (Key Features)

1.  **身份驗證與授權 (Authentication & Authorization)**
    - JWT 登入機制 (`AuthService`, `AuthInterceptor`)
    - 路由守衛 (`AuthGuard`, `AdminGuard`) 確保頁面存取權限。

2.  **團購管理 (Group Management)**
    - 建立與管理團購群組 (`GroupForm`, `GroupInfo`)。
    - 使用者餘額管理與儲值功能 (`UserBalance`, `DepositDialog`)。

3.  **店家管理 (Shop Management)**
    - 店家列表與詳細資訊 (`ShopList`, `ShopInfo`)。
    - 快速商品編輯功能 (`ProductQuickEdit`)。

4.  **訂單系統 (Ordering System)**
    - 瀏覽店家與菜單。
    - 建立訂單與購物車功能 (`OrderMain`, `OrderSummary`)。
    - 查看訂單狀態與歷史記錄。

5.  **使用者中心 (User Management)**
    - 查看個人訂單記錄 (`MyOrders`)。
    - 查看交易與儲值歷史 (`TransactionHistory`)。

6.  **共用元件 (Shared Components)**
    - 狀態卡片 (`StatusCard`)、評論區 (`Comments`)、時間顯示 (`DiffTimeDisplay`) 等可重用元件。
    - 全域錯誤處理與通知 (`ToastService`)。

---

## 🚀 快速開始 (Getting Started)

請確認您的開發環境已安裝 **Node.js** (建議 v20.19.2 或更高版本)。

### 1. 安裝依賴 (Install Dependencies)

```bash
npm install
```

### 2. 啟動開發伺服器 (Run Development Server)

```bash
npm start
```

與此同時，瀏覽器將自動開啟 `http://localhost:4300`。

### 3. 建置專案 (Build)

```bash
npm run build
```

建置後的檔案將輸出至 `dist/` 目錄。

---

## 📝 開發規範與配置 (Configuration)

- **環境變數**:

`src/environments/` 目錄下包含 `environment.ts` (開發) 與 `environment.prod.ts` (生產) 配置。

- **樣式**:

全域樣式定義於 `src/styles/`，支援 SCSS 預處理器。

- **Linting**:

使用 `prettier` 進行程式碼格式化，配置檔位於 `package.json` 中。

---

**Office Eats** - Make office lunch great again! 🍱
