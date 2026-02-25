import { inject, Injectable } from "@angular/core";
import { HttpService } from "src/app/core/services/http.service";
import { BalancItem } from "./header.model";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  /** DI */
  private http = inject(HttpService);

  constructor() { }

  getUserBlances(userMock: boolean): Observable<ApiResponse<BalancItem>> {
    return this.http.get<ApiResponse<BalancItem>>('/user/blances', {}, userMock);
  }
}