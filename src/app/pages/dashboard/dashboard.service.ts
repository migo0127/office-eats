import { inject, Injectable } from "@angular/core";
import { ApiResponse } from "@core/models/api-response.model";
import { HttpService } from "@core/services/http.service";
import { GroupBuyItem } from "@shared/models/group-buy-common.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /** DI */
  private http = inject(HttpService);

  constructor() { }

  /** 獲取所有團購資料 
   * @param useMock 是否使用假資料 
   * */
  getGroupBuys(useMock: boolean = false): Observable<ApiResponse<GroupBuyItem[]>> {
    return this.http.get<ApiResponse<GroupBuyItem[]>> ('/dashboard', {}, useMock);
  }
}