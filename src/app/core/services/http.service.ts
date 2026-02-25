import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { USE_MOCK } from "../tokens/http.tokens";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  /**DI */
  private http = inject(HttpClient);

  private readonly baseUrl: string = environment.apiUrl;

  constructor() {} 

  private buildUrl(path: string): string {
    const cleanBaseUrl: string = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const cleanPath: string = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBaseUrl}${cleanPath}`;
  }

  private createMockContext(useMock: boolean): HttpContext {
    return new HttpContext().set(USE_MOCK, useMock);
  }

  /** get */
  get<T>(path: string, params: any = {}, useMock: boolean = false): Observable<T> {
    const options = {
      params: new HttpParams({ fromObject: params }),
      context: this.createMockContext(useMock)
    };

    return this.http.get<T>(this.buildUrl(path), options);
  }

  /** post */
  post<T>(path: string, body: any = {}, params: any = {}, useMock: boolean = false): Observable<T> {
    const options = {
      params: new HttpParams({ fromObject: params }),
      context: this.createMockContext(useMock)
    };
    return this.http.post<T>(this.buildUrl(path), body, options);
  }

  /** put */
  put<T>(path: string, body: any = {}, params: any = {}, useMock: boolean = false): Observable<T> {
     const options = {
      params: new HttpParams({ fromObject: params }),
      context: this.createMockContext(useMock)
    };
    return this.http.put<T>(this.buildUrl(path), body, options);
  }

  /** patch */
  patch<T>(path: string, body: any = {}, params: any = {}, useMock: boolean = false): Observable<T | any> {
    const options = {
      params: new HttpParams({ fromObject: params }),
      context: this.createMockContext(useMock)
    };
    return this.http.patch<T>(this.buildUrl(path), body, options);
  }

  /** delete */
  delete<T>(path: string, params: any = {}, useMock: boolean = false): Observable<T | any> {
    const options = {
      params: new HttpParams({ fromObject: params }),
      context: this.createMockContext(useMock)
    };
    return this.http.delete<T>(this.buildUrl(path), options);
  }

}