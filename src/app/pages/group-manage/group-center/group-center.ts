import { Component, linkedSignal, inject, signal, computed, DestroyRef } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { StatusItem } from '@shared/models/status-card.model';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonData, LabelValue, SeverityType } from '@shared/models/common.model';
import { DateRangeService } from '@shared/services/date-range.service';
import { GROUP_BUY_STATUS_MAP, GROUP_BUY_STATUS_OPTS, GroupBuyItem, GroupBuyStatus } from '@shared/models/group-buy-common.model';
import { MenuItem } from 'primeng/api';
import { GROUP_CENTER_IMPORTS } from './group-center-imports';
import { ABSOLUTE_ROUTES } from 'src/app/core/config/routes.config';
import { Menu } from 'primeng/menu';
import { DeviceService } from '@shared/services/device.service';
import { ToastService } from '@shared/services/toast.service';
import { concatMap, filter, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JsonDataService } from '@shared/services/json-data.service';
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: 'app-group-center',
  imports: [SHARED_IMPORTS, GROUP_CENTER_IMPORTS, Tooltip],
  templateUrl: './group-center.html',
  styleUrl: './group-center.scss',
})
export class GroupCenterComponent {
  /** DI */
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private deviceService = inject(DeviceService);
  private activatedRoute = inject(ActivatedRoute);
  private dateRangeService = inject(DateRangeService);
  private jsonDataService = inject(JsonDataService);

  /** 是否為手機 */
  isMobile = computed(() => this.deviceService.isMobile());

  /** 日期 */
  rangeDates = linkedSignal<Date, Date[]>({
    source: () => this.dateRangeService.now(),

    // 計算 [本月1號, 本月最後一天]
    computation: (newNow: Date) => {
      return this.dateRangeService.setMonth(newNow);
    }
  });

  minDate = computed(() => this.dateRangeService.setMinDate());
  maxDate = computed(() => this.dateRangeService.setMaxDate());

  /** 模擬統計數據 */
  stats = signal<StatusItem[]>([
    {
      label: '本月消費',
      value: 1250,
      isPrefix: true,
      unit: '$',
      icon: 'pi pi-wallet',
      color: 'text-pink-500',
      path: `/order/my-orders/1`,
      queryParams: { mode: 'month' }
    },
    {
      label: '本週消費',
      value: 750,
      isPrefix: true,
      unit: '$',
      icon: 'pi pi-dollar',
      color: 'text-blue-500',
      path: `/order/my-orders/1`,
      queryParams: { mode: 'week' }
    },
    {
      label: '當日訂單',
      value: 1,
      isPrefix: false,
      unit: '份',
      icon: 'pi pi-bell',
      color: 'text-green-500',
      path: `/order/my-orders/1`,
      queryParams: { mode: 'day' }
    },
    {
      label: '當日消費',
      value: 150,
      isPrefix: true,
      unit: '$',
      icon: 'pi pi-shopping-cart',
      color: 'text-orange-500',
      path: `/order/my-orders/1`,
      queryParams: { mode: 'day' }
    },
  ]);

  /** 狀態 */
  readonly statusOpts: LabelValue<GroupBuyStatus | 'ALL'>[] = GROUP_BUY_STATUS_OPTS;
  readonly statusDisplay: Record<string, LabelValue<SeverityType>> = GROUP_BUY_STATUS_MAP as any;
  selectedStatus = signal<GroupBuyStatus | 'ALL'>('ALL');

  /** 類型 */
  categoryOptions: LabelValue[] = [
    { label: '全部', value: 'all' },
    { label: '午餐', value: 'lunch' },
    { label: '飲料', value: 'drink' },
    { label: '下午茶', value: 'teaTime' },
  ];
  selectedCategory = signal<string>('all');

  /** 關鍵字 */
  searchKey = signal<string>(null);

  groupBuys = signal<GroupBuyItem[]>([
    {
      gId: "1",
      groupName: "正忠排骨飯",
      category: 'lunch',
      label: '午餐',
      status: 'OPEN',
      creator: 'Sarah Lin',
      shops: [
        {
          sId: '001',
          shopName: '正忠排骨飯',
          address: '臺北市大安區建國南路一段',
          tel: '02-27026493'
        }
      ],
      totalQty: 15,
      startTime: '2026-02-27T09:00:00',
      endTime: '2026-02-27T09:40:00',
      estimateTime: '2026-02-27T12:00:00',
      total: 3450,
      groupNote: '最少12份送',
      link: null
    },
    {
      gId: "2",
      groupName: "迷客夏 Milksha 臺北遼寧店",
      category: 'drink',
      label: '飲料',
      status: 'CLOSED',
      creator: 'Jason Wu',
      shops: [
        {
          sId: '002',
          shopName: '迷客夏 Milksha 臺北遼寧店',
          address: '臺北市中山區遼寧街38號',
          tel: '02-27755569'
        }
      ],
      startTime: '2026-02-26T09:00:00',
      endTime: '2026-02-26T16:30:00',
      estimateTime: '2026-02-26T15:30:00',
      totalQty: 4,
      total: 390,
      groupNote: null,
      link: null,
    },
    {
      gId: "3",
      groupName: "Yellow Monday可頌鬆餅",
      category: 'teaTime',
      label: '下午茶',
      status: 'OPEN',
      creator: 'Jason Wu',
      shops: [
        {
          sId: '003',
          shopName: 'Yellow Monday可頌鬆餅',
          address: '臺北市松山區民生東路四段124號',
          tel: '02-25466126'
        },
        {
          sId: '004',
          shopName: '50嵐 復興店',
          address: '臺北市大安區復興南路二段182號' ,
          tel: '02-27093698'
        },
      ],
      startTime: '2026-02-27T09:00:00',
      endTime: '2026-02-27T12:00:00',
      estimateTime: '2026-02-28T14:30:00',
      totalQty: 54,
      total: 6910,
      groupNote: '每人上限 130 元',
      link: 'xxxx'
    },
    {
      gId: "4",
      groupName: "50嵐 復興店",
      category: 'drink',
      label: '飲料',
      status: 'CANCEL',
      creator: 'Jason Wu',
      shops: [
        {
          sId: '004',
          shopName: '50嵐 復興店',
          address: '臺北市大安區復興南路二段182號' ,
          tel: '02-27093698'
        },
      ],
      startTime: '2026-02-23T09:00:00',
      endTime: '2026-02-23T10:30:00',
      estimateTime: '2026-02-23T15:30:00',
      totalQty: 14,
      total: 2530,
      groupNote: null,
      link: null
    },
    {
      gId: "5",
      groupName: "50嵐 復興店",
      category: 'drink',
      label: '飲料',
      status: 'CANCEL',
      creator: 'Jason Wu',
      shops: [
        {
          sId: '004',
          shopName: '50嵐 復興店',
          address: '臺北市大安區復興南路二段182號' ,
          tel: '02-27093698'
        },
      ],
      startTime: '2025-12-25T09:00:00',
      endTime: '2025-12-25T11:00:00',
      estimateTime: '2025-12-26T15:30:00',
      totalQty: 16,
      total: 2730,
      groupNote: null,
      link: null
    }
  ]);

  /** table 資料 */
  filterGroupBuysDatas = computed<GroupBuyItem[]>(() => {
    const datas = this.groupBuys();
    const rangeDates: Date[] = this.rangeDates();
    const word: string = this.searchKey()?.trim().toLowerCase() ?? '';
    const category: string = this.selectedCategory();
    const status = this.selectedStatus();

    // 1. 如果 rangeDates 格式不完整（例如只選了開始還沒選結束）
    const hasValidRange: boolean = !!rangeDates?.[0] && !!rangeDates?.[1];

    return datas.filter((data) => {
      // 1. 過濾狀態: 如果是 ALL 就不過濾狀態
      const matchStatus: boolean = status === 'ALL' || data.status === status;

      // 2. 過濾類型: 如果是 all 就不過濾分類
      const matchCategory: boolean = category === 'all' || data.category === category;

      // 3. 過濾關鍵字: 訂單名稱或產品名稱
      const matchWord: boolean =
        word === '' ||
        data.groupName?.toLowerCase().includes(word) ||
        data.shops?.some((copmay) => copmay?.shopName?.toLowerCase().includes(word));

      // 4.過濾時間區間
      let matchDates: boolean = false;
      if(hasValidRange) {
        const endTime: number = new Date(data.endTime).getTime();
        const start: number = rangeDates[0].getTime();
        const end: number = rangeDates[1].getTime();
        matchDates = endTime >= start && endTime <= end;
      }

      // console.log('filterDatas: ', {hasValidRange, matchDates, matchWord, matchCategory});

      return matchStatus && matchDates && matchWord && matchCategory;
    });
  });
  /** 勾選的團購項目 */
  selectOrders = signal<GroupBuyItem[]>([]);

  /** 操作選單 */
  menuItems = computed<MenuItem[]>(() => {
    const data = this.selectedRowData();
    // 若無資料則不顯示選單
    if (!data) return [];

    const isOpen: boolean = data.status === GroupBuyStatus.OPEN;

    return [
      {
        label: '查看訂單',
        icon: 'pi pi-list-check',
        command: () => this.goToGroupInfo(data.gId)
      },
      {
        label: '編輯訂單',
        icon: 'pi pi-pencil',
        disabled: !isOpen, // 非開啟狀態不可編輯
        command: () => this.goToGroupForm('edit' ,data.gId)
      },
      {
        label: '複製訂單',
        icon: 'pi pi-copy',
        command: () => this.goToGroupForm('copy', data.gId)
      },
      {
        label: '匯出訂單',
        icon: 'pi pi-file-export',
        command: () => this.exportOrder(data)
      },
      {
        label: '取消團購',
        icon: 'pi pi-stop-circle',
        disabled: !isOpen, // 只有開啟中的團購可以取消
        command: () => this.cancelGroup(data)
      },
      {
        // 加入分隔線，將「刪除」操作隔開
        separator: true
      },
      {
        label: '刪除團購',
        icon: 'pi pi-trash',
        severity: 'danger',
        disabled: isOpen,   // 開啟中的團購不能直接刪除，要先取消再刪除
        command: () => this.deleteGroup(data)
      }
    ];
  });
  /** 點擊的當前 row data */
  selectedRowData = signal<GroupBuyItem | null>(null);

   /** 檢查畫面的寬度與高度，以自適應設定最大高度 */
  dynamicScrollHeight = this.deviceService.getDynamicHeight({
    pc: 21,
    portrait: 20,
    landscape: 5
  });

  constructor() { }

  ngOnInit(): void {

  }

  /** 當日 */
  today(): void {
    this.rangeDates.set(this.dateRangeService.setToday());
  }

  /** 本週 */
  currentWeek(): void {
    this.rangeDates.set(this.dateRangeService.setWeek());
  }

  /** 本月 */
  currentMonth(): void {
    this.rangeDates.set(this.dateRangeService.setMonth());
  }

  /** 前往店家管理頁 */
  goToShop(event: MouseEvent, sId: string): void {
    event.stopPropagation();
    if(sId) {
      this.router.navigate([ABSOLUTE_ROUTES.EDIT_SHOP_INFO(sId)]);
    }
  }

  // 開啟選單的方法
  openMenu(event: MouseEvent, menu: Menu, rowData: GroupBuyItem) {
    event.stopPropagation();
    if(menu){
      this.selectedRowData.set(rowData);
      menu.toggle(event);
    }
  }

  /** 前往當前訂單資訊頁 */
  goToGroupInfo(gId: string): void {
    if(gId) {
      this.router.navigate([ABSOLUTE_ROUTES.GROUP_INFO(gId)], { relativeTo: this.activatedRoute });
    }
  }

  batchExportOrders(): void {
    console.log('batchExportOrders: ', this.selectOrders);
  }

  /** 新增 or 編輯團購資訊 */
  goToGroupForm(action: 'copy' | 'edit' | 'add', gId?: string): void {
    switch(action) {
      case 'edit':
        if (gId) {
          // /group-manage/group-form/gId
          this.router.navigate([ABSOLUTE_ROUTES.EDIT_GROUP_FORM(gId)]);
        }
        break;

      case 'add':
        // /group-manage/group-form
        this.router.navigate([ABSOLUTE_ROUTES.ADD_GROUP_FORM]);
        break;

      case 'copy':
        // /group-manage/group-form?gId='xxx'
        if (gId) {
          this.router.navigate([ABSOLUTE_ROUTES.ADD_GROUP_FORM], { 
            queryParams: { copyFrom: gId } 
          });
        }
        break;
    }
  }

  /** 匯出訂單 */
  exportOrder(data: GroupBuyItem): void {

  }

  /** 取消團購 */
  cancelGroup(data: GroupBuyItem): void {
    this.toastService.toastConfirm$(
      { severity: 'info', detail: `確認要取消此筆 ${data.groupName} 團購？`}
    ).pipe(
      filter((isConfirm: boolean) => isConfirm),
      // API層
      concatMap(() => of(data.gId).pipe(
        this.toastService.toastCatchError$(),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (gId: string) => {
        this.toastService.notify({ detail: '取消成功' });
        this.groupBuys.update((curList) =>
          curList.map(item => item.gId === gId
            ? { ...item, status: GroupBuyStatus.CANCEL }
            : item
          )
        );
      }
    });
  }

  /** 取消團購 */
  deleteGroup(data: GroupBuyItem): void {
    this.toastService.toastConfirm$(
      { severity: 'warn', detail: `確認要刪除此筆 ${data.groupName} 團購？`}
    ).pipe(
      filter((isConfirm: boolean) => isConfirm),
      // API層
      concatMap(() => of(data.gId).pipe(
        this.toastService.toastCatchError$(),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (gId: string) => {
        this.toastService.notify({ detail: '刪除成功' });
        this.groupBuys.update((group) => group.filter(item => item.gId !== gId));
      }
    });
  }

  ngAfterViewInit(): void {
    const jsonData: JsonData = {
      title: 'my-orders',
      data: [
        { key: 'stats', value: this.stats() },
        { key: 'rangeDates', value: this.rangeDates() },
        { key: 'groupBuys', value: this.groupBuys() },
      ]
    }
    this.jsonDataService.setJsonData(jsonData);
  }

}
