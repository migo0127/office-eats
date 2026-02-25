import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "../services/loading.service";
import { finalize } from "rxjs";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  /** DI */
  const loadingService = inject(LoadingService);

  // 可以在這裡判斷特定的 Header，決定是否要跳過遮罩 (例如背景自動更新的 API 等，需加上 skip-loading)
  if(req.headers.has('skip-loading')){
    return next(req);
  }

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
}