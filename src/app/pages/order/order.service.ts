import { inject, Injectable } from "@angular/core";
import { HttpService } from "@core/services/http.service";
import { Orders } from "@shared/models/group-buy-common.model";
import { Observable } from "rxjs";
import { OrderedItems } from "./order-summary/order-summary.model";
import { ApiResponse } from "@core/models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  /** DI */
  private http = inject(HttpService);

  constructor() { }

  /** 獲取該筆團購的商家菜單資料*/
  getGroupbuyOrder(gId: string, oId: string ,userMock: boolean = false): Observable<ApiResponse<Orders[]>> {
    const path: string = `/group-buy/${gId}/order`;
    const params = oId ? { oId } : {};
    return this.http.get<ApiResponse<Orders[]>>(path, params, userMock)
  }

  /** 送出訂單 */
  submitOrder(gId: string, orderedItems: OrderedItems, userMock: boolean = false): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`/group-buy/${gId}/order/submit`, orderedItems, {}, userMock);
  }
}