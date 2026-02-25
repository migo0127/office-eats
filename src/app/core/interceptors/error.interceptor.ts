import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { ABSOLUTE_ROUTES } from "../config/routes.config";
import { ERROR_LOOKUP } from "../config/error-side-effect";
import { ErrorConfig, ErrorSideEffect } from "../models/error-config.model";
import { AuthService } from "../services/auth.service";
import { ToastService } from "@shared/services/toast.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1.匹配到業務代碼
      const bizCode: string | null = error.error?.code ? String(error.error.code) : null;
      let config: ErrorConfig = ERROR_LOOKUP[bizCode || ''];

      // console.log('errorInterceptor: ', {error, bizCode, config});

      // 2. 如果沒有匹配到業務代碼，檢查 HTTP Status 狀態碼
      if (!config) {
        switch (error.status) {
          case 401:
            config = { code: '401', message: '登入逾時，請重新登入', action: ErrorSideEffect.LOGOUT };
            break;
          case 403:
            config = { code: '403', message: '沒有權限執行此操作', action: ErrorSideEffect.REDIRECT };
            break;
          case 500:
            config = { code: '500', message: '伺服器維護中，請稍後再試', action: ErrorSideEffect.REFRESH };
            break;
          default:
            // 完全沒匹配到的保底處理
            toastService.toastError({ severity: 'error', summary: '錯誤', detail: error.error?.message || '未知錯誤' });
            // 標記這個錯誤已經被攔截器處理過了
            (error as any).isHandled = true;
            break;
        }
      }

      // 只要有 config (不論是 BIZ 或 HTTP 來的)，就統一交由 handle 執行後續行為
      if (config) {
        handleErrorSideEffect(router, authService, toastService, config);
        // 標記這個錯誤已經被攔截器處理過了
        (error as any).isHandled = true;
      }

      // 依然拋出錯誤，讓元件能執行 finalize 或局部邏輯
      return throwError(() => error);
    })
  );
};

function handleErrorSideEffect(
  router: Router, 
  authService: AuthService,
  toastService: ToastService, 
  config: ErrorConfig,
): void {
  const { message, action } = config;

  // 1. 顯示錯誤訊息
  toastService.toastError({ severity: 'error', summary: '系統提示', detail: message });

  // 2. 執行副作用
  switch (action) {
    case ErrorSideEffect.LOGOUT:
      authService.logout();
      break;
    case ErrorSideEffect.REFRESH:
      setTimeout(() => window.location.reload(), 3000);
      break;
    case ErrorSideEffect.REDIRECT:
      router.navigate([ABSOLUTE_ROUTES.DASHBOARD]); 
      break;
    default:
      break;
  }
}
