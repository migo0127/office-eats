import { Component, computed, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { DASHBOARD_IMPORTS } from './dashboard-imports';
import { JsonData, LabelValue, SeverityType } from '@shared/models/common.model';
import { Router } from '@angular/router';
import { JsonDataService } from '@shared/services/json-data.service';
import { StatusItem } from '@shared/models/status-card.model';
import { StorageService } from '@shared/services/storage.service';
import { ABSOLUTE_ROUTES } from 'src/app/core/config/routes.config';
import { ORDER_STORAGE } from '@shared/constants/storage-keys';
import { GROUP_BUY_STATUS_MAP, GroupBuyItem, GroupBuyStatus } from '@shared/models/group-buy-common.model';
import { DeviceService } from '@shared/services/device.service';
import { DashboardService } from './dashboard.service';
import { ToastService } from '@shared/services/toast.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/services/auth.service';
import { combineLatest, filter, map, of, startWith, Subject, switchMap } from 'rxjs';
import { MyOrderService } from '@pages/user-manage/my-orders/my-orders.service';
import { ApiResponse } from '@core/models/api-response.model';

@Component({
  selector: 'app-dashboard',
  imports: [SHARED_IMPORTS, DASHBOARD_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {

  /** DI */
  private router = inject(Router);
  private authService = inject(AuthService);
  private deviceService = inject(DeviceService);
  private storeService = inject(StorageService);
  private toastService = inject(ToastService);
  private jsonDataService = inject(JsonDataService);

  /** DI API */
  private myOrderService = inject(MyOrderService);
  private dashboardService = inject(DashboardService);

  /** variables */
  /** 當 uId更動或進入頁面時，重新刷新 stats 資料*/
  uId = computed(() => this.authService.uId());
  private refresh$: Subject<void> = new Subject<void>();
  readonly isMobile = computed<boolean>(() => this.deviceService.isMobile());
  readonly groupBuyStatus = GroupBuyStatus;
  readonly statusDisplay: Record<string, LabelValue<SeverityType>> = GROUP_BUY_STATUS_MAP as any;

  /** 模擬統計數據 */
  stats = toSignal(
    combineLatest([
      toObservable(this.uId),
      this.refresh$.pipe(startWith(undefined))
    ]).pipe(
      filter(([uId]) => !!uId),
      switchMap(([uId]) => this.myOrderService.refreshStats(uId, true).pipe(
        map((res: ApiResponse<StatusItem[]>) => res?.data ?? []),
        this.toastService.toastCatchError$(of([]))
      ))
    ),
    { initialValue: [] as StatusItem[] }
  )

  /** 團購類別篩選 */
  categoryOptions: LabelValue[] = [
    { label: '全部', value: 'all' },
    { label: '午餐', value: 'lunch' },
    { label: '飲料', value: 'drink' },
    { label: '下午茶', value: 'teaTime' },
  ];
  selectedCategory = signal<string>('all');

  // 模擬團購列表數據
  groupBuys = toSignal(
    this.dashboardService.getGroupBuys(true).pipe(
      map((res: ApiResponse<GroupBuyItem[]>) => res?.data ?? []),
      this.toastService.toastCatchError$()
    ),
    { initialValue: [] as GroupBuyItem[] }
  );

  /** 根據選擇的 tab 篩選對應團購資料 */
  filterGroupBuys = computed<GroupBuyItem[]>(() => {
    const filter: string = this.selectedCategory();
    const groupBuys: GroupBuyItem[] = this.groupBuys();

    return filter === 'all' ?
      groupBuys :
      groupBuys.filter(group => group.category === filter);
  });

  constructor() { }

  ngOnInit(): void { }

  /** 點餐 */
  goToOrder(group: GroupBuyItem): void {
    if(group.link) {
      /** 另開外部頁面 */
      // window.open(gb.link, '_blank', 'noopener,noreferrer');
      alert('另開外部頁面');
    } else {
      // 平台點餐
      this.storeService.sessionStorageSetItem(
        ORDER_STORAGE.ORDER_DATA,
        {
          'endTime': group.endTime,
          'label': group.label,
          'category': group.category,
          'groupNote': group.groupNote
        },
      );
      this.router.navigate([ABSOLUTE_ROUTES.ORDER_MAIN(group.gId)]);
    }
  }

  ngAfterViewInit(): void {
    const jsonData: JsonData = {
      title: 'Dashboard',
      data: [
        { key: 'statusDisplay', value: this.statusDisplay },
        { key: 'stats', value: this.stats() },
        { key: 'categoryOptions', value: this.categoryOptions },
        { key: 'groupBuys', value: this.groupBuys() },
      ]
    }
    this.jsonDataService.setJsonData(jsonData);
  }

}
