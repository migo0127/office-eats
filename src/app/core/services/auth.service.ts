import { computed, HostListener, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginItem, UserInfo } from '@shared/models/auth.model';
import { StorageService } from '@shared/services/storage.service';
import { APP_ROUTES } from '../config/routes.config';
import { AUTH_STORAGE } from '../config/auth-storage.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** DI */
  private router = inject(Router);
  private storageService = inject(StorageService);

  readonly userInfo = signal<UserInfo | null>(
    this.storageService.sessionStorageGetItem(AUTH_STORAGE.USER_INFO)
  );

  /** 是否有登入 */
  readonly isAuthenticate = computed<boolean>(() => !!this.userInfo());
  /** 帳號 uId */
  readonly uId = computed<string>(() => this.userInfo()?.uId ?? null);
  /** 取得 token */
  readonly token = computed<string>(() => this.userInfo()?.token ?? null);
  /** 是否為管理員 */
  readonly isAdmin = computed<boolean>(() => this.userInfo()?.isAdmin ?? null);

  constructor() {}

  /** 登入 */
  login(loginItem: LoginItem, ): void {
    const mockUser: UserInfo = {
      uId: '123',
      name: 'Chase',
      email: 'chase@chase.com.tw',
      token: 'bearer',
      isAdmin: loginItem.password === '1',
    };
    // console.log('loginItem :', loginItem);
    this.userInfo.set(mockUser);
    this.storageService.sessionStorageSetItem(AUTH_STORAGE.USER_INFO, mockUser);
    this.router.navigate([APP_ROUTES.DASHBOARD]);
  }

  /** 登出 */
  logout(): void {
    this.userInfo.set(null);
    this.storageService.sessionStorageRemoveItem(AUTH_STORAGE.USER_INFO);
    this.router.navigate([APP_ROUTES.LOGIN]);
  }

}
