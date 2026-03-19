import { inject, Injectable } from "@angular/core";
import { ApiResponse } from "@core/models/api-response.model";
import { HttpService } from "@core/services/http.service";
import { GroupBuyItem } from "@shared/models/group-buy-common.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupCenterService {

  private http = inject(HttpService);

  constructor() { }

  /** 獲取團購列表資料 */
  getGroupCenterList(useMock: boolean = false): Observable<ApiResponse<GroupBuyItem[]>> {
    return this.http.get<ApiResponse<GroupBuyItem[]>>('/group-center/list', {}, useMock);
  }

  /** 取消團購 */
  cancelGroup(gId: string, useMock: boolean = false): Observable<ApiResponse<boolean>> {   
    return this.http.put<ApiResponse<boolean>>(`/group-center/cancel/${gId}`, {}, {}, useMock);
  }

  /** 刪除團購 */
  deleteGroup(gId: string, useMock: boolean = false): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`/group-center/delete/${gId}`, {}, useMock);
  }

}