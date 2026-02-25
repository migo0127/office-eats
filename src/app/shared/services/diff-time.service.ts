import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { interval } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiffTimeService {

  /** 計時器 */
  readonly now = signal<Date>(new Date());

  private destroyRef = inject(DestroyRef);

  constructor() {
    /** 每秒更新當前時間 */
    interval(1000).pipe(
      // 防呆：使用 takeUntilDestroyed，以防 Service 被銷毀時會自動停止計時
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe(() => this.now.set(new Date()));
  }

  /**
   * 計算與現在時間的毫秒差(ms)
   * @param endTime 結束時間 (支援字串、日期物件或數字)
   */
  getDiff(endTime: string | Date | number | undefined | null): number {
    if (!endTime) return 0;

    const endTs: number = new Date(endTime).getTime();
    const nowTs: number = this.now().getTime();
    // 確保不回傳負數
    return Math.max(0, endTs - nowTs);
  }

}