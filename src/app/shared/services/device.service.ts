import { Injectable, Signal, computed, inject } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ScrollOffset } from '@shared/models/common.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private breakpointObs = inject(BreakpointObserver);

  // 1. 純寬度判斷 (直向手機)
  private readonly widthQuery: string = '(max-width: 767px)';
  // 2. 純高度判斷 (橫向手機)
  private readonly heightQuery: string = '(max-height: 500px)';

  constructor() { }

  /** 檢查寬度是否小於 767px: 例如手機直放時 */
  isPortraitMobile = toSignal(
    this.breakpointObs.observe(this.widthQuery).pipe(map((res: BreakpointState) => res.matches)),
    { initialValue: false }
  );

  /** 檢查高度是否小於 500px: 例如手機橫放時 */
  isLandscapeMobile = toSignal(
    this.breakpointObs.observe(this.heightQuery).pipe(map((res :BreakpointState) => res.matches)),
    { initialValue: false }
  );

  /**3. 檢查寬度小於 767px 或 高度也小於 500px 時: 寬度窄 或 高度矮 */
  isMobile = computed(() => this.isPortraitMobile() || this.isLandscapeMobile());

  /**
   * 通用的高度計算器
   * @param offsets 傳入各個模式下要扣除的 rem 數值
   */
  getDynamicHeight(offsets: ScrollOffset): Signal<string> {
    return computed(() => {
      /** 1.優先判定：手機橫放 (高度矮)
     * 此時雖然寬度可能很大(PC規格)，但高度極小
     */
      if (this.isLandscapeMobile()) {
        return `calc(100vh - ${offsets.landscape}rem)`;
      }

      /** 2. 次要判定：直向手機 (寬度窄) */
      if (this.isPortraitMobile()) {
        return `calc(100vh - ${offsets.portrait}rem)`;
      }

       /** 3. 最後判定：桌機 PC */
      return `calc(100vh - ${offsets.pc}rem)`;
    });
  }

}
