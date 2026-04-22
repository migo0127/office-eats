import { Component, computed, DestroyRef, inject, input, model, output, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { ORDER_SUMMARY_IMPORTS } from './order-summary-imports';
import { OrderItem, OrderStorage } from '@shared/models/group-buy-common.model';
import { DiffTimeService } from '@shared/services/diff-time.service';
import { StorageService } from '@shared/services/storage.service';
import { ToastService } from '@shared/services/toast.service';
import { Router } from '@angular/router';
import { ABSOLUTE_ROUTES } from 'src/app/core/config/routes.config';
import { AuthService } from 'src/app/core/services/auth.service';
import { concatMap, filter, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from 'src/app/core/services/loading.service';
import { OrderedItems } from './order-summary.model';
import { OrderService } from '../order.service';
import { ORDER_STORAGE } from '@shared/constants/storage-keys';

@Component({
  selector: 'app-order-summary',
  imports: [ SHARED_IMPORTS, ORDER_SUMMARY_IMPORTS ],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummaryComponent {

  /** DI */
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private storageService = inject(StorageService);
  private diffTimeService = inject(DiffTimeService);

  /** DI API */
  private orderService = inject(OrderService);

  /** input、output，當父組件 cart 變動時，會自動反應 */
  gId = input.required<string>();
  oId = input.required<string | null>();
  orderedItems = model.required<OrderItem[]>();
  remove = output<OrderItem>();

  orderData = signal<OrderStorage>(null);
  showDrawer = signal(false);

  /** 獲取剩餘時間 */
  leftTime = computed(() => {
    return this.diffTimeService.getDiff(this.orderData()?.endTime);
  });
  totalPrice = computed(() => this.orderedItems().reduce((s, i) => s + i.price * i.quantity, 0));
  totalCount = computed(() => this.orderedItems().reduce((s, i) => s + i.quantity, 0));
  uId = computed(() => this.authService.uId());

  constructor() {
    /** 獲取結單時間用來計算剩餘時間，進行送單卡控 */
    const orderStorage: OrderStorage = this.storageService.sessionStorageGetItem(ORDER_STORAGE.ORDER_DATA);
    if(orderStorage) {
      this.orderData.set(orderStorage);
    }
  }

  ngOnInit(): void { }

  /** 刪除項目 */
  handleDelete(item: OrderItem): void {
    this.remove.emit(item);
  }

  /** 更新 orderedItems 資料 */
  updateItemField(index: number, key: keyof OrderItem, value: string) {
    this.orderedItems.update(items => {
      const newItems: OrderItem[] = [...items];
      newItems[index] = { 
        ...newItems[index], 
        [key]: value 
      };
      return newItems;
    });
  }

  /** 送單 */
  submit(): void {

    let detail: string = this.uId() && this.orderedItems().length === 0 ? 
      '目前訂單無商品，確認送出訂單？' : 
      '確認送出訂單？';

    let severity: string = this.uId() && this.orderedItems().length === 0 ? 
      'warn' : 
      'info';

    const orderedItems: OrderedItems = {
      gId: this.gId(),
      uId: this.uId(),
      orderedItems: this.orderedItems(),
    }

    // console.log('submit: ', orderedItems);

    this.toastService.toastConfirm$(
      { severity, detail }
    ).pipe(
      filter((isConfirm: boolean) => isConfirm),
      // API層
      concatMap(() => this.orderService.submitOrder(this.gId(), orderedItems, true).pipe(
        tap(() => this.loadingService.show()),
        this.toastService.toastNotify$({ detail: '訂購成功' }),
        this.toastService.toastCatchError$(),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (_: any) => {
        this.loadingService.hide()
        
        this.router.navigate([ABSOLUTE_ROUTES.MY_ORDERS(this.uId())]);
      }
    });
  }

}
