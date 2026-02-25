import { Component, computed, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { DEPOSIT_DIALOG_IMPORTS } from './deposit-dialog-imports';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserBalanceBase } from '@shared/models/user-balance.model';

@Component({
  selector: 'app-deposit-dialog',
  imports: [SHARED_IMPORTS, DEPOSIT_DIALOG_IMPORTS],
  templateUrl: './deposit-dialog.html',
  styleUrl: './deposit-dialog.scss',
})
export class DepositDialogComponent {
  /** DI */
  private dynamicConfig = inject(DynamicDialogConfig);
  protected ref = inject(DynamicDialogRef)

  // 接收原始資料
  userData = signal<UserBalanceBase>(null);

  // 狀態管理
  amount = signal<number>(0); // 預設為 0
  
  // 計算最終額度
  finalBalance = computed(() => this.userData()?.balance + (this.amount() ?? 0));

  // 判斷是否為「扣款」樣式
  isNegative = computed(() => this.amount() < 0);

  ngOnInit(): void {
    const data: UserBalanceBase = this.dynamicConfig.data;

    if (data) {
      this.userData.set(data);
    } else {
      console.warn('DepositDialog: No user data received!');
    }
  }

  save() {
    if (this.amount() === 0) return;
    // 回傳給呼叫端
    this.ref.close({
      uId: this.userData().uId,
      amount: this.amount(),
      beforeBalance: this.userData().balance,
      afterBalance: this.finalBalance()
    });
  }

  cancel() {
    this.ref.close();
  }
}
