import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { map } from "rxjs";
import { ApiResponse } from "../models/api-response.model";

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse && event.status === 200) {
        const body = event.body;

        // 1. 如果後端已經符合 ApiResponse 結構 (有 success 屬性)
        if (body && typeof body === 'object' && 'success' in body) {
          // 這裡不做任何「寫死」的動作，直接檢查後端的 success
          if (body.success === false) {
            throw new HttpErrorResponse({
              error: { code: body.code, message: body.message },
              status: 200,
              statusText: 'Business Logic Error',
            });
          }
          // 成功就原封不動回傳 (保留原始的 success, code, message)
          return event;
        }

        // 2. 如果後端只給「純資料」 (例如 Mock 或舊 API)，補上「標準外殼」
        const wrappedBody: ApiResponse<any> = {
          success: true, // 因為 HTTP 200 且沒有 business 錯誤，視為成功
          code: '200', 
          message: 'OK',
          data: body // 把純資料塞進 data
        };

        return event.clone({ body: wrappedBody });
      }
      return event;
    })
  );
};