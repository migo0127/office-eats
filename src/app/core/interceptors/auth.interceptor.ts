import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  /** DI */
  const authService = inject(AuthService);
  /** 拿 token */
  const token: string = authService.uId();

  if(token) {
   /** 如果有 Token，就克隆請求並加上 Header */
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  } 

  return next(req);
}