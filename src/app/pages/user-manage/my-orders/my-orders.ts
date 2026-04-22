import { Component, linkedSignal, inject, signal, computed, DestroyRef, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { MY_ORDERS_IMPORTS } from './my-orders-imports';
import { StatusItem } from '@shared/models/status-card.model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, concatMap, filter, map, of, startWith, Subject, switchMap } from 'rxjs';
import { ABSOLUTE_ROUTES } from 'src/app/core/config/routes.config';
import { JsonData, LabelValue, SeverityType } from '@shared/models/common.model';
import { DateRangeService } from '@shared/services/date-range.service';
import { GROUP_BUY_STATUS_MAP, GROUP_BUY_STATUS_OPTS, GroupBuyItem, GroupBuyStatus } from '@shared/models/group-buy-common.model';
import { JsonDataService } from '@shared/services/json-data.service';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ToastService } from '@shared/services/toast.service';
import { DynamicDialogService } from '@shared/services/dynamic-dialog.service';
import { CommentsComponent } from '@shared/components/comments/comments';
import { CommentItem } from '@shared/models/comments.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DeviceService } from '@shared/services/device.service';
import { MyOrderService } from './my-orders.service';
import { ApiResponse } from '@core/models/api-response.model';
import { StorageService } from '@shared/services/storage.service';
import { ORDER_STORAGE } from '@shared/constants/storage-keys';

@Component({
  selector: 'app-my-orders',
  imports: [SHARED_IMPORTS, MY_ORDERS_IMPORTS],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrdersComponent {

  /** DI */
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private deviceService = inject(DeviceService);
  private storeService = inject(StorageService);
  private activatedRoute = inject(ActivatedRoute);
  private jsonDataService = inject(JsonDataService);
  private dateRangeService = inject(DateRangeService);
  private dynamicDialogService = inject(DynamicDialogService);

  /** DI API */
  private myOrderService = inject(MyOrderService);

  /** uId */
  uId = input.required<string>();
  /** 日期 mode: month、week、day */
  mode = toSignal(
    this.activatedRoute.queryParamMap.pipe(map(p => p.get('mode') ?? 'month')),
    { requireSync: true }
  );

  /** 日期 */
  rangeDates = linkedSignal<string, Date[]>({
    source: () => this.mode(),
    computation: (newMode) => {
      // 映射 mode
      const strategy: Record<string, () => Date[]> = {
        'month': () => this.dateRangeService.setMonth(),
        'week':  () => this.dateRangeService.setWeek(),
        'day':   () => this.dateRangeService.setToday(),
      };

      return (strategy[newMode] || strategy['day'])();
    }
  });

  minDate = computed(() => this.dateRangeService.setMinDate());
  maxDate = computed(() => this.dateRangeService.setMaxDate());

  /** 模擬統計數據 */
  private rehreshStats$: Subject<void> = new Subject();
  stats = toSignal(
    combineLatest([
      toObservable(this.uId),
      this.rehreshStats$.pipe(startWith(undefined))
    ]).pipe(
      filter(([uId]) => !!uId),
      switchMap(([uId]) => this.myOrderService.refreshStats(uId, true).pipe(
        map((res: ApiResponse<StatusItem[]>) => res?.data ?? []),
        this.toastService.toastCatchError$(of([]))
      ))
    ),
    { initialValue: [] as StatusItem[] }
  );

  /** 狀態 */
  readonly groupBuyStatus = GroupBuyStatus;
  readonly statusOpts = GROUP_BUY_STATUS_OPTS;
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

  rehreshDatas$: Subject<void> = new Subject();
  datas = toSignal(
    combineLatest([
      toObservable(this.uId),
      this.rehreshDatas$.pipe(startWith(undefined))
    ]).pipe(
      filter(([uId]) => !!uId),
      switchMap(([uId]) => this.myOrderService.getMyOrders(uId, true).pipe(
        map((res: ApiResponse<GroupBuyItem[]>) => res?.data ?? []),
        this.toastService.toastCatchError$(of([]))
      ))
    ),
    { initialValue: [] as GroupBuyItem[] }
  )

  /** table 資料 */
  filterDatas = computed<GroupBuyItem[]>(() => {
    const datas = this.datas();
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
        data.groupName?.toLowerCase().includes(word.toLowerCase()) ||
        data.shops.some((company: any) =>
          company.orderedItems.some((item: any) =>
            item.productName.toLowerCase().includes(word.toLowerCase())
          )
        );

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

  /** 操作選單 */
  menuItems = computed<MenuItem[]>(() => {
    const data: GroupBuyItem = this.selectedRowData();
    // 若無資料則不顯示選單
    if (!data) return [];

    const isOpen: boolean = data.status === GroupBuyStatus.OPEN;

    return [
      {
        label: '評論商品',
        icon: 'pi pi-comment',
        disabled: isOpen,
        command: () => this.openCommentsDialog(data)
      },
      {
        label: '編輯訂單',
        icon: 'pi pi-pencil',
        disabled: !isOpen, // 非開啟狀態不可編輯
        command: () => this.goToOrder(data)
      },
      {
        // 加入分隔線，將「刪除」操作隔開
        separator: true
      },
      {
        label: '刪除訂單',
        icon: 'pi pi-trash',
        severity: 'danger',
        disabled: !isOpen,
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

  expandedRows = {};

  constructor() { }

  ngOnInit(): void { }

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

  updateRangeDates(newRangeDate: Date[]): void {
    this.rangeDates.set(newRangeDate);
  }

  /** 打開評分、評論 dialog */
  openCommentsDialog(item: GroupBuyItem): void {
    if(item.status  === this.groupBuyStatus.CLOSED) {
      const ref: DynamicDialogRef<CommentItem> = this.dynamicDialogService.open(CommentsComponent, {
        header: '撰寫評論',
        data: this.getProductItem(item)
      });

      ref.onClose.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((result: CommentItem) => {
        if(result) {
          console.log('addComment: ', { uId: this.uId(), result });
        }
      });
    }
  }

  /** 查看商品評論 */
  private getProductItem(item: GroupBuyItem): CommentItem[] {
    const productMap = new Map<string, CommentItem>();

    item.shops.forEach(shop => {
      shop.orderedItems?.forEach(orderItem => {
        // 使用 pId 作為 Key，確保產品不重複
        if (!productMap.has(orderItem.pId)) {
          productMap.set(orderItem.pId, {
            sId: shop.sId,
            pId: orderItem.pId,
            productName: orderItem.productName,
            productRating: orderItem.productRating || 0,
            myRating: 0,
            totalComments: orderItem.commentCount || 0,
            isEdit: true,
            myComment: '',
            comments: []
          });
        }
      });
    });

    return Array.from(productMap.values());
  }

  /** 開啟選單的方法 */
  openMenu(event: MouseEvent, menu: Menu, rowData: GroupBuyItem) {
    event.stopPropagation();
    if(menu){
      this.selectedRowData.set(rowData);
      menu.toggle(event);
    }
  }

  /** 前往團購單 */
  goToOrder(data: GroupBuyItem): void {
    this.storeService.sessionStorageSetItem(
      ORDER_STORAGE.ORDER_DATA,
      {
        'endTime': data.endTime,
        'label': data.label,
        'category': data.category,
        'groupNote': data.groupNote
      },
    );
    this.router.navigate([ABSOLUTE_ROUTES.ORDER_MAIN(data.gId)], { queryParams: { oId: data.oId} });
  }

  /** 刪除訂單 */
  deleteGroup(data: GroupBuyItem): void {
    this.toastService.toastConfirm$(
      { severity: 'warn' ,detail: `確認要刪除此訂購資訊 ${data.groupName}？` }
    ).pipe(
      filter((isConfirm: boolean) => isConfirm),
      concatMap(() => this.myOrderService.deleteMyOrder(this.uId(), data.oId, true).pipe(
        map((res: ApiResponse<boolean>) => res?.success ?? false),
        this.toastService.toastCatchError$(),
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res: boolean) => {
        if(res) {
          this.toastService.notify({ detail: '刪除訂單成功' });
          this.rehreshDatas$.next();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const jsonData: JsonData = {
      title: 'my-orders',
      data: [
        { key: 'stats', value: this.stats() },
        { key: 'rangeDates', value: this.rangeDates() },
        { key: 'groupBuyStatus', value: this.groupBuyStatus },
        { key: 'statusOpts', value: this.statusOpts },
        { key: 'datas', value: this.datas() },
      ]
    }
    this.jsonDataService.setJsonData(jsonData);
  }

}
