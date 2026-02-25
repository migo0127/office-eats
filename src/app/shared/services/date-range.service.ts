import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  readonly now = signal<Date>(new Date());

  /** * 
   * 取得起算日，默認為當日
   */
  private getBase(base?: Date): Date {
    return base ? new Date(base) : new Date(this.now());
  }

  /**
   * 設定最小日期
   * @param value 往前推算的數值 (天數或月份)，默認 2 月
   * @param mode 模式：'month' 依月份扣除並回傳該月1號 (預設)，'day' 依天數扣除
   * @param base 非必填，自行設定起算日，默認為當日
   */
  setMinDate(value: number = 2, mode: 'day' | 'month' = 'month', base?: Date): Date {
    const date: Date = this.getBase(base);
    if (mode === 'day') {
      // 依天數：直接扣除天數並歸零時間
      date.setDate(date.getDate() - value);
      date.setHours(0, 0, 0, 0);
      return date;
    } else {
      // 依月份：推算到該月的 1 號 00:00:00
      // 例如：1月25號 傳入 1 -> 會變成 12月1號
      return new Date(date.getFullYear(), date.getMonth() - value, 1, 0, 0, 0);
    }
  }

   /**
   * 設定最大日期
   * @param isMonthLastDay 是否設定為當月的最後一天，預設為 true，否則設定為當日結束 (23:59:59)
   * @param base 非必填，自行設定起算日，默認為當日
   */
  setMaxDate(isMonthLastDay: boolean = true, base?: Date): Date {
    const date: Date = this.getBase(base);
    if (isMonthLastDay) {
      // 取得本月最後一天 23:59:59
      return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      // 取得當日 23:59:59
      date.setHours(23, 59, 59, 999);
      return date;
    }
  }

  /** 
   * 設定月份起迄日
   *  @param base 非必填，自行設定起算日，默認為當日
   */
  setMonth(base?: Date): Date[] {
    const date: Date = this.getBase(base);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return [firstDay, lastDate];
  }

  /** 
   * 設定該週起迄日 
   * @param base 非必填，自行設定起算日，默認為當日
   */
  setWeek(base?: Date): Date[] { 
    const date: Date = this.getBase(base);
    const day: number = date.getDay();
    // 計算指定日跟當週周一差幾天（如果今天是週日(0)，要減 6 天；其餘減去 (day - 1)）
    const diffToMonday: number = day === 0 ? -6 : 1 - day;
    
    // 週一 00:00:00
    const monday: Date = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    // 周日 23:59:59
    const sunday: Date = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    /** 檢查最後一天：若為非周日，那就改為當日 */
    const endDate = sunday > date ? date : sunday;
    return [monday, endDate];
  }

  /** 
   * 設定指定日，默認為當日
   * @param base 非必填，自行設定起算日，默認為當日
   */
  setToday(base?: Date): Date[] {
    const start: Date = this.getBase(base);
    start.setHours(0, 0, 0, 0);
    const end: Date = this.getBase(base);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }
}