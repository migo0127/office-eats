import { LabelValue, SeverityType } from "./common.model";

export interface GroupBuyBase {
  gId: string;
  groupName: string;
  category: string;
  label: string;
  status: GroupBuyStatus;
  creator: string;
  shops: Shop[];
  /** 截止點餐時間 */
  endTime: string;
}

export interface GroupBuyItem extends GroupBuyBase {
  /** 訂單編號 (用於追蹤個人訂購紀錄) */
  oId?: string;
  /** 總數量 */
  totalQty?: number;
  /** 總金額 */
  total?: number;
  /** 開始時間 */
  startTime?: string;
  /** 預計到餐時間 */
  estimateTime?: string;
  /** 有值: 邀請連結  null: 平台點餐 */
  link?: string | null;
  /** for web: 剩於時間 - 前端計算 */
  timeLeft?: number;
  /** 團購備註 */
  groupNote: string;
}

export interface Shop {
  sId: string;
  shopName: string;
  shopTags?: ShopTag[];
  address?: string;
  tel?: string;
  shopRating?: number;
  /** 公休日：存 0~6 的數字陣列。例如 [0, 6] 代表週六日公休 */
  offDays?: number[];
  /** 營業時間  ['11:00-14:00', '17:00-20:00'] */
  businessHours?: string[];
  /** 更新日期 */
  updatedAt?: Date;
  note?: string;

  /** 店家的所有商品 (用於菜單頁面) */
  menu?: OrderItem[];
  /** 已被點購的項目 (用於訂單詳情或購物車) */
  orderedItems?: OrderItem[];
}

export interface Orders {
  /** 訂單編號: 新增時沒有，編輯時有 */
  oId?: string;
  gId: string;
  shop: Shop;
  totalPrice: number;
}

export interface OrderItem {
  pId: string;
  productName: string;
  price: number;
  quantity?: number;
  /** 產品評分 */
  productRating?: number;
  /** 產品本身的原始資訊備註 */
  note?: string;
  /** 使用者點餐時的客製化備註（如：去冰、加辣） */
  remark?: string;
  /** 是否可點 */
  disabled?: boolean;
  /** 產品圖片 */
  imageUrl?: string; 
  /** 更新日期 */
  updatedAt?: Date;

  uId?: string;
  userName?: string;
  commentCount?: number;
}

export interface OrderStorage {
  endTime: string;
  label: string;
  category: string;
  groupNote: string;
}

/** 團購狀態 */
export const GroupBuyStatus = {
  /** 取消 */
  CANCEL: 'CANCEL',
  /** 收單中 */
  OPEN: 'OPEN',
  /** 已截止 */
  CLOSED: 'CLOSED',
} as const;

export type GroupBuyStatus = typeof GroupBuyStatus[keyof typeof GroupBuyStatus];

export const GROUP_BUY_STATUS_OPTS: LabelValue<GroupBuyStatus | 'ALL'>[] = [
  { label: '全部', value: 'ALL' },
  { label: '收單中', value: GroupBuyStatus.OPEN },
  { label: '已截止', value: GroupBuyStatus.CLOSED },
  { label: '已取消', value: GroupBuyStatus.CANCEL },
];

/** 映射 GroupBuyStatus */
export const GROUP_BUY_STATUS_MAP: Record<GroupBuyStatus, LabelValue<SeverityType>> = {
  [GroupBuyStatus.CANCEL]: { label: '已取消', value: 'danger' },
  [GroupBuyStatus.OPEN]:   { label: '收單中', value: 'success' },
  [GroupBuyStatus.CLOSED]: { label: '已截止', value: 'secondary' },
};

/** 商家標籤 Enum 物件 */
export const ShopTag = {
  BENTO: 'BENTO',
  DRINK: 'DRINK',
  DESSERT: 'DESSERT',
  FAST_FOOD: 'FAST_FOOD',
  OTHER: 'OTHER',
} as const;

export type ShopTag = typeof ShopTag[keyof typeof ShopTag];

export const SHOP_TAG_OPTS: LabelValue<ShopTag>[] = [
  { label: '便當', value: ShopTag.BENTO },
  { label: '飲料', value: ShopTag.DRINK },
  { label: '甜點', value: ShopTag.DESSERT },
  { label: '速食店', value: ShopTag.FAST_FOOD },
];

/** 映射標籤顏色 tags */
export const SHOP_TAG_MAP: Record<ShopTag, LabelValue<SeverityType>> = {
  [ShopTag.BENTO]: { label: '便當', value: 'success' },
  [ShopTag.DRINK]: { label: '飲料', value: 'info' },
  [ShopTag.DESSERT]: { label: '甜點', value: 'warn' },
  [ShopTag.FAST_FOOD]: { label: '速食店', value: 'danger' },
  [ShopTag.OTHER]: { label: '其他', value: 'secondary' },
};
