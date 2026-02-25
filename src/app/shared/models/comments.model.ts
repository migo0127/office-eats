export interface CommentItem {
  sId: string;
  pId: string;
  productName: string;
  /** 產品評分 */
  productRating: number; 
  /** 總評論數 */
  totalComments: number;
  /** 是否正在編輯自己的評論 (UI 狀態) */
  isEdit: boolean;
  /** 其他人的評論列表 */
  comments: UserComment[];
  /** 當前使用者輸入的評論內容 */
  myComment?: string;
  /** 當前使用者給的評分 */
  myRating?: number; 
}

export interface UserComment {
  userName: string;
  /** 其他使用者給的評分 */
  userRating: number;
  date: string;
  content: string;
}