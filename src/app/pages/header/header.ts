import { Component, computed, inject, output, signal } from '@angular/core';
import { HEADER_IMPORTS } from './header-imports';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { BalancItem } from './header.model';
import { ABSOLUTE_ROUTES } from 'src/app/core/config/routes.config';
import { AuthService } from 'src/app/core/services/auth.service';
import { HeaderService } from './header.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '@shared/services/toast.service';
import { map } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { BlanceStatus } from '@shared/models/common.model';

@Component({
  selector: 'app-header',
  imports: [SHARED_IMPORTS, HEADER_IMPORTS],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  /** DI */
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  /** DI API */
  private headerService = inject(HeaderService);

  /** output */
  onMenuToggle = output<void>();

  /** variables */
  isAdmin = computed<boolean>(() => this.authService.isAdmin());
  balances = toSignal(
    this.headerService.getUserBlances(true).pipe(
      map((res: ApiResponse<BalancItem>) => res?.data ?? null),
      this.toastService.toastCatchError$()
    ),
    { initialValue: null }
  );
  
  BlanceStatus = BlanceStatus;

  constructor(){ }

  navigateToDashboard(): void {
    this.router.navigate([ABSOLUTE_ROUTES.DASHBOARD]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate([ABSOLUTE_ROUTES.LOGIN]);
  }

}
