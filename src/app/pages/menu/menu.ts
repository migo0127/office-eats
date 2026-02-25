import { Component, computed, inject, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { MENU_IMPORTS } from './menu-imports';
import { Router, RouterModule } from '@angular/router';
import { JsonDataService } from '@shared/services/json-data.service';
import { ABSOLUTE_ROUTES } from 'src/app/core/config/routes.config';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuItem } from 'primeng/api';
import { UserInfo } from '@shared/models/auth.model';

@Component({
  selector: 'app-menu',
  imports: [SHARED_IMPORTS, MENU_IMPORTS, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuComponent {

  /** DI */
  private router = inject(Router);
  private authService = inject(AuthService);
  private jsonDataService = inject(JsonDataService);

  /** input */
  userInfo = computed(() => (this.authService.userInfo()));
  collapsed = input<boolean>(false);

  /** variables */

  // 選單資料
  displayMenu = computed<MenuItem[]>(() => {
    const user: UserInfo = this.authService.userInfo(); // 監聽使用者狀態
    
    if(!user) return [];

    // 定義原始選單結構
    const rawItems = [
      { 
        label: '儀表版', 
        icon: 'pi pi-home', 
        routerLink: ABSOLUTE_ROUTES.DASHBOARD, 
        visible: true 
      },
      { 
        label: '個人管理', 
        icon: 'pi pi-list-check', 
        visible: !!user.uId,
        items: [
          { label: '訂單列表', icon: 'pi pi-list', routerLink: ABSOLUTE_ROUTES.MY_ORDERS(user.uId) },
          { label: '金流紀錄', icon: 'pi pi-dollar', routerLink: ABSOLUTE_ROUTES.TRANSACTIONTORY_HISTORY(user.uId)},
        ]
      },
      { 
        label: '團購管理', 
        icon: 'pi pi-shopping-cart', 
        visible: user.isAdmin ?? false, 
        items: [ 
          { label: '團購列表', icon: 'pi pi-list', routerLink: ABSOLUTE_ROUTES.GROUP_CENTER },
          { label: '儲值管理', icon: 'pi pi-dollar', routerLink: ABSOLUTE_ROUTES.ORDER_USER_BALANCE },
        ]
      },
      { 
        label: '商家管理', 
        icon: 'pi pi-building', 
        routerLink: ABSOLUTE_ROUTES.SHOP_MANAGE, 
        visible: user.isAdmin ?? false, 
         items: [ 
          { label: '商家列表', icon: 'pi pi-list', routerLink: ABSOLUTE_ROUTES.SHOP_MANAGE },
        ]
      },
      { 
        label: '顯示 JSON', 
        icon: 'pi pi-code', 
        visible: user.isAdmin ?? false, 
      },
    ];

    // 只回傳 visible 為 true 的項目
    return rawItems.filter(item => item.visible);
  });

  /** * 處理選單點擊 
   */
  handleItemClick(item: MenuItem) {
    // 1. 如果有子選單，開啟子選單
    if (item.items) {
      this.toggleSubmenu(item);
      return;
    }

    // 2. 如果是顯示 JSON
    if (item.label.includes('JSON')) {
      this.showDialog(null);
      return;
    }

    // 3. 一般導航
    this.navigate(item.routerLink);
  }

  private toggleSubmenu(item: MenuItem) {
    // 如果目前是收合狀態，點擊子選單父項不導航
    // 如果收合，點擊後不開子選單 
    if (this.collapsed()) return; 

    item.expanded = !item.expanded;
    
    if (item.expanded) {
      this.displayMenu().forEach(i => {
        if (i !== item) i.expanded = false;
      });
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  onLogout(): void {
    this.authService.logout();
  }

  showDialog(routerLink: string | null): void {
    if (routerLink === null) {
      this.jsonDataService.openJsonDataDialog();
    }
  }
}
