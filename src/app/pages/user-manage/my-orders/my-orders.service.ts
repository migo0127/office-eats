import { inject, Injectable, signal } from "@angular/core";
import { ApiResponse } from "@core/models/api-response.model";
import { HttpService } from "@core/services/http.service";
import { GroupBuyItem } from "@shared/models/group-buy-common.model";
import { StatusItem } from "@shared/models/status-card.model";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyOrderService {

  /** DI */
  private http = inject(HttpService);

  private _stats = signal<StatusItem[]>([]);
  readonly stats = this._stats.asReadonly();

  constructor() { }

  /** 獲取統計數據 
   * @param useMock 是否使用假資料 
   * */
  refreshStats(uId: string, useMock: boolean = false): Observable<ApiResponse<StatusItem[]>> {
    return this.http.get<ApiResponse<StatusItem[]>>(`/my-orders/${uId}/stats`, {}, useMock).pipe(
      tap((res: ApiResponse<StatusItem[]>) => this._stats.set(res?.data ?? []))
    );
  }

  /** 獲取個人紀錄資料列表 */
  getMyOrders(uId: string, useMock: boolean = false): Observable<ApiResponse<GroupBuyItem[]>> {
    return this.http.get<ApiResponse<GroupBuyItem[]>>(`/my-orders/${uId}`, {}, useMock);
  }

  /** 刪除訂單 */
  deleteMyOrder(uId: string, oId: string, useMock: boolean = false): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`/my-orders/${uId}/delete/${oId}`, {}, useMock);
  }
}