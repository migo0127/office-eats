import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { OrderItem, Orders, OrderStorage } from '@shared/models/group-buy-common.model';
import { Router } from '@angular/router';
import { JsonDataService } from '@shared/services/json-data.service';
import { JsonData } from '@shared/models/common.model';
import { ORDER_MAIN_IMPORTS } from './order-main-imports';
import { StorageService } from '@shared/services/storage.service';
import { ORDER_STORAGE } from '@shared/constants/storage-keys';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { OrderService } from '../order.service';
import { ToastService } from '@shared/services/toast.service';
import { filter, map, of, switchMap, tap } from 'rxjs';
import { ABSOLUTE_ROUTES } from '@core/config/routes.config';
import { ApiResponse } from '@core/models/api-response.model';

@Component({
  selector: 'app-order-main',
  imports: [SHARED_IMPORTS, ORDER_MAIN_IMPORTS],
  templateUrl: './order-main.html',
  styleUrl: './order-main.scss',
})
export class OrderMainComponent {
  /** DI */
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private storageService = inject(StorageService);
  private jsonDataService = inject(JsonDataService);
  /** DI API */
  private orderService = inject(OrderService);

  /** input */
  /**
   * gId 透過 app.config.ts 的 withComponentInputBinding
   *  - 路由參數 會自動對應到組件中名稱相同的變數 ，在傳給 order-summary
   * */
  gId = input.required<string>();
  /** 來自查詢參數 ?oId：若帶有 oId 表示曾訂過，要編輯 */
  oId = input<string>();
  // 將 gId oId Signal 轉為 Observable
  private param$ = toObservable(computed(() =>({ gId: this.gId(), oId: this.oId() })));

  /** 3. 使用 switchMap 監聽 gId、oId 的變化並抓取資料，並初始化購物車資料 */
  stores = toSignal(
    this.param$.pipe(
      filter(({ gId }) => !!gId),
      switchMap(({ gId, oId }) => {
        return this.orderService.getGroupbuyOrder(gId, oId, true).pipe(
          tap((res: ApiResponse<Orders[]>) => {
            if(res.success) {
              this.initCart(res.data);
            }
          }),
          map((res:  ApiResponse<Orders[]>) => res.data),
          this.toastService.toastCatchError$(of([]))
        );
      })
    ),
    { initialValue: [] as Orders[] }
  );

  // 購物車
  cart = signal<OrderItem[]>([]);
  orderData = signal<OrderStorage>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.storageService.sessionStorageRemoveItem(ORDER_STORAGE.ORDER_DATA);
    });
  }

  ngOnInit(): void {
    /** 獲取該筆團購的基本資料 (類型、時間..等) */
    const orderStorage: OrderStorage = this.storageService.sessionStorageGetItem(ORDER_STORAGE.ORDER_DATA);
    if(orderStorage) {
      this.orderData.set(orderStorage);
    }
  }

  /** 購物車內容 */
  private initCart(orders: Orders[]) {
    const initCart: OrderItem[] = orders.flatMap((order) => 
      order.shop.menu
        .filter((product) => product.quantity > 0)
        .map((product) => ({ ...product, sId: order.shop.sId }))
    );
    this.cart.set(initCart);
  }

  goToDashboard(): void {
    this.router.navigate([ABSOLUTE_ROUTES.DASHBOARD]);
  }

  /** 加入購物車邏輯 */
  handleAddToCart(item: OrderItem, sId: string) {
    this.cart.update((current) => {
      // 檢查商品是否已存在，如果存在就是重新計算數量
      const existing: OrderItem = current.find((i) => i.pId === item.pId);
      if (existing) {
        return current.map((i) =>
          i.pId === item.pId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // 如果是第一次加入，加上該店的 sId 方便識別
      return [...current, { ...item, sId, quantity: 1 }];
    });
  }

  /** 從購物車移除邏輯 */
  handleRemoveFromCart(item: OrderItem) {
    this.cart.update((current) => {
      // 檢查商品的數量是否大於 1，如果大餘 1，就是做減法即可
      const existing: OrderItem = current.find((i) => i.pId === item.pId);
      if (existing && existing.quantity > 1) {
        return current.map((i) =>
          i.pId === item.pId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      // 若數量未大餘 1，就是完全移除該商品
      return current.filter((i) => i.pId !== item.pId);
    });
  }

  ngAfterViewInit(): void {
    const jsonData: JsonData = {
      title: 'order',
      data: [
        { key: 'stores', value: this.stores() },
      ]
    }
    this.jsonDataService.setJsonData(jsonData);
  }
}
