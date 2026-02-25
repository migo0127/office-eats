import { Component, computed, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { TRANSACTIONTORY_HISTORY_IMPORTS } from './transactiontory-history-imports';
import { Transaction, TRANSACTION_CONFIG } from '@shared/models/user-balance.model';
import { DeviceService } from '@shared/services/device.service';

@Component({
  selector: 'app-transactiontory-history',
  imports: [SHARED_IMPORTS, TRANSACTIONTORY_HISTORY_IMPORTS],
  templateUrl: './transactiontory-history.html',
  styleUrl: './transactiontory-history.scss',
})
export class TransactiontoryHistoryComponent {
  /** DI */
  private deviceService = inject(DeviceService);

  private transactions = signal<Transaction[]>([
      {
        bId: '1',
        transactionTime: '2024-05-20 14:30',
        type: 'DEPOSIT',
        amount: 1000,
        beforeBalance: 500,
        afterBalance: 1500,
        groupName: null,
      },
      {
        bId: '2',
        transactionTime: '2024-05-21 12:00',
        type: 'ORDER_PAY',
        amount: 150,
        beforeBalance: 1500,
        afterBalance: 1350,
        groupName: '正忠排骨飯',
      } 
    ]);

  // 下拉選單過濾狀態
  selectedType = signal<'ALL' | 'DEPOSIT' | 'ORDER_PAY' | 'REFUND'>('ALL');

  // 下拉選單選項
  typeOptions = [
    { label: '全部', value: 'ALL' },
    { label: '儲值', value: 'DEPOSIT' },
    { label: '支出', value: 'ORDER_PAY' },
    { label: '退款', value: 'REFUND' },
    { label: '其他', value: 'OTHER' },
  ];

  //交易類型的標籤與顏色
  protected readonly TransactionConfig = TRANSACTION_CONFIG;

  // 計算過濾後的資料
  filteredTransactions = computed(() => {
    const type = this.selectedType();
    if (type === 'ALL') return this.transactions();
    return this.transactions().filter((t) => t.type === type);
  });

  // Table 展開控制
  expandedRows = {};

  dynamicScrollHeight = this.deviceService.getDynamicHeight({
    pc: 12,
    portrait: 18,
    landscape: 6,
  });
  isMobile = computed(() => this.deviceService.isMobile());
  


  constructor() {}

  ngOnInit() {
    
  }

}
