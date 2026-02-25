import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { ABSOLUTE_ROUTES } from "../config/routes.config";

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if(authService.isAdmin()) {
    return true;
  }

  return router.createUrlTree([ABSOLUTE_ROUTES.DASHBOARD]);
}