import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { USER_BLANCE_IMPORTS } from './user-balance-imports';
import { MenuItem } from 'primeng/api';
import { DeviceService } from '@shared/services/device.service';
import { BlanceStatus } from '@shared/models/common.model';
import { DynamicDialogService } from '@shared/services/dynamic-dialog.service';
import { DepositDialogComponent } from './deposit-dialog/deposit-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transaction, UserBalanceExt } from '@shared/models/user-balance.model';

@Component({
  selector: 'app-user-balance',
  imports: [SHARED_IMPORTS, USER_BLANCE_IMPORTS],
  templateUrl: './user-balance.html',
  styleUrl: './user-balance.scss',
})
export class UserBalanceComponent {
  /** DI */
  private deviceService = inject(DeviceService);
  private destroyRef = inject(DestroyRef);
  private dynamicDialogService = inject(DynamicDialogService);

  // 篩選狀態 Signals
  selectedStatus = signal<string | null>('all');
  selectedUsers = signal<string[]>([]);
  rangeBlance = signal<number[]>([0, 5000]);

   /** 檢查畫面的寬度與高度，以自適應設定最大高度 */
  dynamicScrollHeight = this.deviceService.getDynamicHeight({
    pc: 12,
    portrait: 18,
    landscape: 6
  });
  isMobile = computed(() => this.deviceService.isMobile());

  // 模擬資料
  users = signal<UserBalanceExt[]>([
    {
      uId: '123',
      name: 'Jason Wu',
      email: 'jason@migo.com',
      balance: 1250,
      updatedAt: '2026-02-08 14:00',
      note: '',
      isActive: true,
      depositHistory: [
        { transactionTime: '2026-02-01 10:00', amount: 500, beforeBalance: 750, afterBalance: 1250 },
        { transactionTime: '2026-01-15 09:30', amount: 1000, beforeBalance: 0, afterBalance: 1000 },
      ],
    },
    {
      uId: '456',
      name: 'Sarah Lin',
      email: 'sarah@migo.com',
      balance: 85,
      updatedAt: '2026-02-07 11:20',
      note: '',
      isActive: false,
    }
  ]);

 filterUsers = computed(() => {
    const allUsers: UserBalanceExt[] = this.users();
    const selectedStatus: string = this.selectedStatus();
    const selectedUsers: string[] = this.selectedUsers();
    const rangeBalance: number[] = this.rangeBlance();

    // 直接回傳 filter 後的結果
    return allUsers.filter((user) => {
      // 1. 檢查帳號狀態
      const matchesStatus: boolean = 
        !selectedStatus || selectedStatus === 'all' 
          ? true 
          : selectedStatus === 'active' ? user.isActive : !user.isActive;

      // 2. 檢查選擇的使用者 (多選)
      const isUserSelected: boolean = selectedUsers.length === 0 || selectedUsers.includes(user.uId);

      // 3. 檢查餘額範圍
      const isBalanceInRange: boolean = user.balance >= rangeBalance[0] && user.balance <= rangeBalance[1];
      
      // 回傳布林值進行過濾
      return matchesStatus && isUserSelected && isBalanceInRange;
    });
  });

  // 下拉選單選項
  statusOpts = [
    { label: '全部', value: 'all' },
    { label: '啟用', value: 'active' },
    { label: '停用', value: 'inactive' },
  ];

  userOptions = computed(() => this.users().map((u) => ({ label: u.name, value: u.uId })));

  // Table 展開控制
  expandedRows = {};

  // 操作選單
  currentUser = signal<UserBalanceExt | null>(null);
  menuItems = computed<MenuItem[]>(() => {
    const user =  this.currentUser();

    if(!user || !user?.uId) return [];

    return [
      {
        label: '調整餘額',
        icon: 'pi pi-dollar',
        disabled: !user.isActive,
        command: () => this.openDepositDialog(user),
      },
      {
        label: '匯出儲值紀錄',
        icon: 'pi pi-file-export',
        command: () => this.exportUserBlance(user),
      },
      {
        label: '匯出訂單紀錄',
        icon: 'pi pi-shopping-cart',
        command: () => this.exportUserOrders(user),
      },
      {
        label: user?.isActive ? '停用帳號' : '啟用帳號',
        icon: user?.isActive ? 'pi pi-user-minus' : 'pi pi-user-plus',
        command: () => this.toggleAccStatus(),
      },
    ]
  });

  BlanceStatus = BlanceStatus;

  constructor() {}

  /** 批次匯入 */
  batchImportBlances(): void {
    
  }

  /** 批次匯出 */
  batcchExportBlances(): void {

  }

  /** 調整餘額 */
  openDepositDialog(user: UserBalanceExt): void {
    const ref = this.dynamicDialogService.open(DepositDialogComponent, {
      header: '調整餘額',
      data: {
        uId: user.uId,
        name: user.name,
        email: user.email,
        balance: user.balance
      },
    });

    ref.onClose.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((result: Transaction & { uId: string }) => {
      if (result) {
        console.log('result', result);
      }
    });
  }

  /** 匯出指定使用者儲值紀錄 */
  exportUserBlance(user: UserBalanceExt): void {

  }

  /** 匯出指定使用者訂單紀錄 */
  exportUserOrders(user: UserBalanceExt): void {

  }
  
  /** 啟用 or 停用帳號 */
  toggleAccStatus(): void {

  }

  openMenu(event: Event, menu: any, user: UserBalanceExt) {
    this.currentUser.set(user);
    menu.toggle(event);
  }

}
