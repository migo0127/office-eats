import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ABSOLUTE_ROUTES} from "../config/routes.config";

/**  保護內部頁面，未登入時不可進入 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isAuthenticate() ? true :  router.parseUrl(ABSOLUTE_ROUTES.LOGIN);
};
