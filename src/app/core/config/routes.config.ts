/** routes path config only */
export const APP_ROUTES = {
  /** 登入頁 */
  LOGIN: 'login',
  /** dashboard */
  DASHBOARD: 'dashboard',
  /** 個人模組 */
  USER_MANAGE: {
    /** 個人模組 */
    ROOT: 'user-manage',
    /** 個人訂單紀錄 */
    MY_ORDERS: 'my-orders/:uId',
    /** 個人金流紀錄 */ 
    TRANSACTIONTORY_HISTORY: 'transactiontory-history/:uId',
  },
  /** 團購訂單模組 */
  ORDER: {
    /** 團購訂單模組  (Partent) */
    ROOT: 'order',
    /** 團購訂單頁面 */
    MAIN: 'main/:gId', 
  },
  /** 訂單管理模組 */
  GROUP_MANAGE: {
    /** 訂單管理模組 (Partent) */
    ROOT: 'group-manage',
    /** 訂單中心 */
    GROUP_CENTER: 'group-center',
    /** 團購資訊 */
    GROUP_INFO: 'group-info/:gId',
    /** 新增 & 複製 團購 */
    ADD_GROUP_FORM: 'group-form',
    /** 編輯 團購 */
    EDIT_GROUP_FORM: 'group-form/:gId',
    /** 管理儲值金 */
    USER_BALANCE: 'user-balance',
  },
  /** 商家管理模組 */
  SHOP_MANAGE: {
    /** 商家管理模組*/
    ROOT: 'shop-manage',
    /** 商家列表 */
    SHOP_LIST: 'shop-list',
    /** 新增商家 */
    ADD_SHOP_INFO: 'shop-info',
    /** 編輯商家 */
    EDIT_SHOP_INFO: 'shop-info/:sId',
  },
} as const;

/** navigator */
export const ABSOLUTE_ROUTES = {
  /** 登入頁 */
  LOGIN: `/${APP_ROUTES.LOGIN}`,
  /** dashboard */
  DASHBOARD: `/${APP_ROUTES.DASHBOARD}`,
  /** 個人模組 */
  USER_MANAGE: `/${APP_ROUTES.USER_MANAGE.ROOT}`,
  /** 個人訂單紀錄*/
  MY_ORDERS: (uId: string | number) => `/${APP_ROUTES.USER_MANAGE.ROOT}/my-orders/${uId}`,
  /** 個人金流紀錄 */ 
  TRANSACTIONTORY_HISTORY: (uId: string | number) => `/${APP_ROUTES.USER_MANAGE.ROOT}/transactiontory-history/${uId}`,
  /** 團購模組 */
  ORDER: `/${APP_ROUTES.ORDER.ROOT}`,
  /** 團購頁面 */
  ORDER_MAIN: (gId: string | number) => `/${APP_ROUTES.ORDER.ROOT}/main/${gId}`,
  /** 訂單管理 - 團購管理 */
  GROUP_CENTER: `/${APP_ROUTES.GROUP_MANAGE.ROOT}/${APP_ROUTES.GROUP_MANAGE.GROUP_CENTER}`,
  /** 團購資訊 */
  GROUP_INFO: (gId: string) => `/${APP_ROUTES.GROUP_MANAGE.ROOT}/group-info/${gId}`,
  /** 新增 & 複製團購 */
  ADD_GROUP_FORM: `/${APP_ROUTES.GROUP_MANAGE.ROOT}/${APP_ROUTES.GROUP_MANAGE.ADD_GROUP_FORM}`,
  /** 編輯團購資訊 */
  EDIT_GROUP_FORM: (gId: string) => `/${APP_ROUTES.GROUP_MANAGE.ROOT}/${APP_ROUTES.GROUP_MANAGE.ADD_GROUP_FORM}/${gId}`,
  /** 訂單管理 - 統計中心 */
  ORDER_USER_BALANCE: `/${APP_ROUTES.GROUP_MANAGE.ROOT}/${APP_ROUTES.GROUP_MANAGE.USER_BALANCE}`,
  /** 商家模組 */
  SHOP_MANAGE: `/${APP_ROUTES.SHOP_MANAGE.ROOT}`,
  /** 商家列表 */
  SHOP_LIST: `/${APP_ROUTES.SHOP_MANAGE.ROOT}/${APP_ROUTES.SHOP_MANAGE.SHOP_LIST}`,
  /** 新增商家 */
  ADD_SHOP_INFO: `/${APP_ROUTES.SHOP_MANAGE.ROOT}/shop-info`, 
  /** 編輯商家 */
  EDIT_SHOP_INFO: (sId: string) => `/${APP_ROUTES.SHOP_MANAGE.ROOT}/shop-info/${sId}`, 
} as const;