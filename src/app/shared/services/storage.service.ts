import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  /**
   * 存儲 localStorage
   * @param key 鍵名
   * @param data 資料
   */
  localStorageSetItem(key: string, data: any): void {
    this.setItem(localStorage, key, data);
  }
  
  /**
   * 存取 localStorage
   * @param key 鍵名
   */
  localStorageGetItem<T = any>(key: string): T | null {
    return this.getItem(localStorage, key);
  }

  /** 
   * 移除 localStorage 
   * @param key 鍵名
   * */
  localStorageRemoveItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * 存儲 sessionStorage
   * @param key 鍵名
   * @param data 資料
   */
  sessionStorageSetItem(key: string, data: any): void {
    this.setItem(sessionStorage, key, data);
  }

  /**
   * 存取 sessionStorage
   * @param key 鍵名
   */
  sessionStorageGetItem<T = any>(key: string): T | null {
   return this.getItem(sessionStorage, key);
  }

  /** 
   * 移除 sessionStorage 
   * @param key 鍵名
   * */
  sessionStorageRemoveItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /** 
   * 封裝儲存操作
   * @param store localStorage 或 sessionStorage
   * @param key 鍵名
   * @param data 資料
   *  */
  private setItem(store: Storage, key: string, data: any): void {
    let valueToStore: string;
    // 自動判斷：如果是物件或陣列，就進行 JSON.stringify
    valueToStore = typeof data === 'object' && data !== null 
      ? JSON.stringify(data) 
      : String(data);

    store.setItem(key, valueToStore);
  }

  /** 
   * 封裝存取操作
   * @param store localStorage 或 sessionStorage
   * @param key 鍵名
   *  */
  private getItem<T = any>(store: Storage, key: string): T | null {
    const data: string | null = store.getItem(key);
    // 找不到 key，返回 null
    if(!data) return null;

    try {
      // 先當成 JSON 解析（物件、陣列、帶引號的字串）
      return JSON.parse(data) as T;
    } catch (e) {
      // 如果解析失敗，表示它是「一般純文字」，直接回傳原始字串
      // 使用 unknown 強制轉型回 T
      return data as unknown as T;
    }
  }

}