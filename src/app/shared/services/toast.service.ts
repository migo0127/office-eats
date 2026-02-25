import { inject, Injectable } from "@angular/core";
import { ToastActionType, ToastOptions } from "@shared/models/toast.model";
import { MessageService } from "primeng/api";
import { catchError, concatMap, EMPTY, exhaustMap, map, Observable, ObservableInput, of, OperatorFunction, Subject, take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageService = inject(MessageService);

  /** 預設通知配置：用於自動消失的提示訊息 */
  private readonly _notifyBaseOpts: ToastOptions = {
    key: 'custom-default',
    life: 3000,
    summary: '提示',
  }

  /** 預設確認配置：用於需要使用者手動點擊按鈕的互動視窗 */
  private readonly _confirmBaseOpts: ToastOptions = {
    key: 'custom-confirm',
    severity: 'warn',
    summary: '提示',
    sticky: true,
    showConfirmBtn: true,
    confirmBtnText: '確認',
    showCloseBtn: true,
    closeBtnText: '取消',
    closable: false
  }

  private readonly _errorBaseOpts: ToastOptions = {
    key: 'custom-default',
    severity: 'error',
    summary: '錯誤',
    life: 3000,
  }

  constructor() { }

  /**
   * 核心發送方法：
   *   不帶預設樣式，只負責 PrimeNG 的對接，以及回傳 Obs
   */
  private _dispatch<T = any>(mergedOptions: ToastOptions, originalOptions?: Partial<ToastOptions>): Observable<T> {
    const action$: Subject<T> = new Subject<T>();
    this.messageService.add({
      ...mergedOptions,
      data: {
        ...mergedOptions,
        ...originalOptions?.data,
        action$
      }
    });

    return action$.asObservable();
  }

  /**
   * 一般通知：3秒消失 (右上 key: custom-default、Fire-and-forget)
   * @param options 配置項，可覆蓋預設 life, severity 等
   * @returns 返回 Observable，當 Toast 消失或觸發動作時發出訊號 (可不接)
   */
  notify<T = any>(options?: Partial<ToastOptions>): Observable<T> {
    const merged: ToastOptions = this.mergedOpts(this._notifyBaseOpts, options);
    return this._dispatch<T>(merged, options);
  }
  
  /**
   * 一般錯誤 toast：自動消失樣式
   * @param options 配置項，如 detail (詢問文字), severity 等
   * */
  toastError<T = any>(options?: Partial<ToastOptions>): Observable<T> {
    const merged: ToastOptions = this.mergedOpts(this._errorBaseOpts, options);
    return this._dispatch<T>(merged, options);
  }

  /**
   * 互動式確認視窗 (回傳布林值)
   * 將複雜的 ToastActionType 抽象化，僅告知使用者是否點擊了「確認」。
   * 使用 exhaustMap 確保在視窗關閉前，重複的觸發會被忽略。
   * * @param options 配置項，如 detail (詢問文字), severity 等
   * @returns Observable<boolean> - true: 確認, false: 取消/關閉
   */
  toastConfirm$(options?: Partial<ToastOptions>): Observable<boolean> {
    return this.confirm(options).pipe(
      exhaustMap((type: ToastActionType) => {
        return of(type === ToastActionType.CONFIRM);
      })
    );
  }

  /**
   * 底層互動式確認邏輯
   * 建立一個 Subject 並注入到 PrimeNG 的 Message 物件中，等待自定義組件回傳動作。
   */
  private confirm<T = any>(
    options?: Partial<ToastOptions>
  ): Observable<T> {
    const merged = this.mergedOpts(this._confirmBaseOpts, options);
    return this._dispatch<T>(merged, options);
  }

  /**
   * [RxJS Operator] 流程中斷型通知
   * 用於 API 成功後，強迫流程等待 Toast 消失 (或 life 到期) 後才繼續往下執行。
   * 會原封不動地傳遞上游的資料 (Transparent Pass-through)。
   * * @example
   * api.call().pipe(this.toastService.toastNotify$({ detail: '成功' })).subscribe(res => ...)
   */
  toastNotify$<T>(options?: Partial<ToastOptions>): OperatorFunction<T, T> {
    // 回傳一個 concatMap 運算子
    return concatMap((value: T) =>
      this.notify(options).pipe(
        take(1),
          // 這裡的 value 就是上游傳下來資料
        map(() => value)
      )
    );
  }

  /**
   * [RxJS Operator] 錯誤攔截型通知
   * 自動處理錯誤，彈出提示，並回傳 EMPTY 中斷主流。
   * @param options 配置項，如 detail (詢問文字), severity 等
   */
  toastCatchError$<T>(fallback: ObservableInput<T> = EMPTY, options?: Partial<ToastOptions>): OperatorFunction<T, T> {
    return catchError((err: any) => {
      /** 如果攔截器沒處理過，例如非預期的程式報錯或尚未定義的錯誤，元件才自己跳視窗 */
      if(!err?.isHandled) {
        const displayMsg = err.error?.message || err.message || '系統發生錯誤';
        this.toastError({ detail: displayMsg, ...options });
      }
      // 回傳 EMPTY
      return fallback;
    });
  }

  private mergedOpts(baseOpts: ToastOptions, opts?: ToastOptions): ToastOptions {
    return { ...baseOpts, ...opts };
  }

}
