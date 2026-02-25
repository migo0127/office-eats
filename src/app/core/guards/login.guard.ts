import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ABSOLUTE_ROUTES } from "../config/routes.config";

/** 保護登入頁 (防止已登入又跑去登入頁重複登入) */
export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isAuthenticate() ?  router.parseUrl(ABSOLUTE_ROUTES.DASHBOARD) : true;
} 