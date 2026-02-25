import { Component, computed, inject, input, output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { OrderItem, Orders } from '@shared/models/group-buy-common.model';
import { CommentsComponent } from '@shared/components/comments/comments';
import { DynamicDialogService } from '@shared/services/dynamic-dialog.service';

@Component({
  selector: 'app-store-list',
  imports: [SHARED_IMPORTS, PanelModule, RatingModule],
  templateUrl: './store-list.html',
  styleUrl: './store-list.scss',
})
export class StroeListComponent {

  /** DI */
  private dynamicDialogService = inject(DynamicDialogService);

  // 接收父組件的購物車狀態
  stores = input.required<Orders[]>();
  cart = input.required<OrderItem[]>();

  add = output<{ item: OrderItem, sId: string }>();
  remove = output<OrderItem>();
  /** 將 cart 的資料轉成 Map { pId: qty }，在透過 computed 自動偵測 singal 變化 */
  cartMap = computed(() => new Map(this.cart().map(i => [i.pId, i.quantity])));

  ngOnInit(): void { }

  /** 查看評論：開啟對話框 */
  checkComment(sId: string, item: OrderItem): void {
    if (!item.commentCount || item.commentCount <= 0) return;

    this.dynamicDialogService.open(CommentsComponent, {
      header: '產品評論',
      data: {
        sId: sId,
        pId: item.pId,
        productName: item.productName,
        productRating: item.productRating,
        totalComments: item.commentCount,
        comments: [
          { userName: '路人甲', userRating: 3, date: '2026-01-26 14:32:21', content: '飯太少，排骨有點乾。' },
          { userName: '路人乙', userRating: 5, date: '2026-01-24 15:01:02', content: '很好吃，下次會再訂！' },
        ]
      }
    });
  }

  // 取得該商品在購物車中的數量
  getItemQuantity(itemId: string): number {
    const item = this.cart().find(i => i.pId === itemId);
    return item ? item.quantity : 0;
  }


}
