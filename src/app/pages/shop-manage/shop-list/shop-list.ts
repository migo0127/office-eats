import { Component, computed, DestroyRef, inject, signal  } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { MenuItem } from 'primeng/api';
import { OrderItem, Shop, SHOP_TAG_MAP, SHOP_TAG_OPTS, ShopTag } from '@shared/models/group-buy-common.model';
import { DeviceService } from '@shared/services/device.service';
import { LabelValue } from '@shared/models/common.model';
import { DynamicDialogService } from '@shared/services/dynamic-dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SHOP_LIST_IMPORTS } from './shop-list-import';
import { ProductQuickEditComponent } from '../product-quick-edit/product-quick-edit';
import { Router } from '@angular/router';
import { ABSOLUTE_ROUTES } from '@core/config/routes.config';

@Component({
  selector: 'app-shop-list',
  imports: [SHARED_IMPORTS, SHOP_LIST_IMPORTS],
  templateUrl: './shop-list.html',
  styleUrl: './shop-list.scss',
})
export class ShopListComponent {

  /** DI */
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private deviceService = inject(DeviceService);
  private dynamicDialogService = inject(DynamicDialogService);

  // 模擬資料 (使用 Signal)
  shops = signal<Shop[]>([
    {
      sId: '1',
      shopName: '正忠排骨飯',
      shopTags: ['BENTO'],
      shopRating: 4,
      offDays: [0, 3],
      businessHours: ['11:00-14:00', '17:00-20:00'],
      address: '臺北市大安區建國南路一段',
      tel: '02-27026493',
      note: '快速快速快',
      menu: [
          { pId: '101', productName: '招牌排骨飯', price: 110, note: null, imageUrl: null },
          { pId: '102', productName: '雞腿飯', price: 120, note: null, imageUrl: null },
          { pId: '103', productName: '麻醬麵 (大)', price: 90, note: '份量大!', imageUrl: null },
          { pId: '104', productName: '麻醬麵 (小)', price: 70, note: null, imageUrl: null },
        ]
    },
    {
      sId: '2',
      shopName: '迷客夏 Milksha 臺北遼寧店',
      shopTags: ['DRINK'],
      shopRating: 3.5,
      offDays: [2],
      businessHours: ['10:00-22:00'],
      address: '臺北市中山區遼寧街38號',
      tel: '02-27755569',
      note: null,
      menu: [
          { pId: '201', productName: '珍珠紅茶拿鐵', price: 65, note: '最少2分糖', imageUrl: null },
          { pId: '202', productName: '大正紅茶', price: 35, note: null, imageUrl: null, disabled: true }
        ]
    },
    {
      sId: '3',
      shopName: 'Yellow Monday可頌鬆餅',
      shopTags: ['DRINK', 'DESSERT'],
      shopRating: 2.8,
      offDays: [1],
      businessHours: ['11:00-22:00'],
      address: '臺北市松山區民生東路四段124號',
      tel: '02-25466126',
      note: '準時',
      menu: [
        { pId: "304", productName: "肉桂鬆餅", price: 30, note: null, imageUrl: null }
      ]
    },
    {
      sId: '4',
      shopName: '50嵐 復興店',
      shopTags: ['DRINK'],
      shopRating: 3,
      offDays: [6],
      businessHours: ['10:00-22:00'],
      address: '臺北市大安區復興南路二段182號',
      tel: '02-27093698',
      note: null,
      menu: [
        { pId: "404", productName: "四季春(大)", price: 40, note: null, imageUrl: null }
      ]
    },
  ]);

  // 篩選用的 Signal
  selectedTags = signal<ShopTag[]>([]);
  searchKey = signal<string>('');

  tagOptions = signal<LabelValue<ShopTag>[]>(SHOP_TAG_OPTS);
  tagsDisplay = SHOP_TAG_MAP as any;

  // 當前操作的商家
  currentShop = signal<Shop | null>(null);

  isMobile = computed<boolean>(() => this.deviceService.isMobile());
  // 操作選單 model
  menuItems = computed<MenuItem[]>(() => {
    const currentShop = this.currentShop();

    if(!currentShop) return [];

      return [
      {
        label: '編輯商家',
        icon: 'pi pi-pencil',
        command: () => this.editShop(currentShop)
      },
      {
        label: '匯出商家',
        icon: 'pi pi-file-export',
        command: () => this.exportShop(currentShop)
      },
      {
        // 加入分隔線，將「刪除」操作隔開
        separator: true
      },
      {
        label: '刪除商家',
        icon: 'pi pi-trash',
        severity: 'danger',
        command: () => this.deleteShop(currentShop),
      },
    ]
  });

  // 篩選邏輯
  filterShops = computed<Shop[]>(() => {
    const keyword: string = this.searchKey().trim();
    const shopTags: ShopTag[] = this.selectedTags();
    // 都是空時，直接返回全部資料
    if(!keyword && !shopTags.length) return this.shops();

      return this.shops().filter((shop) => {
        /** 1. 匹配符合的標籤 */
        const matchTags: boolean =
          this.selectedTags().length === 0 || shopTags.some((t) => shop.shopTags.includes(t));
        /** 1. 匹配符合的關鍵字: 商家名稱 或 地址 或 商品名 */
        const matchKeyword: boolean =
          shop.shopName.includes(this.searchKey()) ||
          shop.address.includes(this.searchKey()) ||
          shop.menu?.some((item) => item.productName.includes(this.searchKey()))
        return matchKeyword && matchTags;
      });
  });

  /** 檢查畫面的寬度與高度，以自適應設定最大高度 */
  dynamicScrollHeight = this.deviceService.getDynamicHeight({
    pc: 12,
    portrait: 18,
    landscape: 6
  });

  dayLabels: string[] = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

  expandedRows = {};

  constructor() {}

  /** 新增商家資訊 */
  goToShopForm(): void {
    this.router.navigate([ABSOLUTE_ROUTES.ADD_SHOP_INFO]);
  }

  /** 批次匯入 */
  batchImportShops(): void {}

  /** 批次匯出 */
  batchExportShops(): void {}

  /** 開啟操作選單 */
  openMenu(event: Event, menu: any, shop: Shop) {
    this.currentShop.set(shop);
    menu.toggle(event);
  }

  /** 編輯商家資訊 */
  editShop(shop: Shop | null) {
    this.router.navigate([ABSOLUTE_ROUTES.EDIT_SHOP_INFO(shop.sId)]);
  }

  /** 匯出商家資訊 */
  exportShop(shop: Shop | null) {
    console.log('匯出商家:', shop);
  }

  /** 刪除商家資訊 */
  deleteShop(shop: Shop | null): void {
    console.log('刪除商家:', shop);
  }

  /** 編輯商品資訊 */
  editProductInfo(shop: Shop, item: OrderItem): void {
    const ref = this.dynamicDialogService.open(ProductQuickEditComponent, {
      width: '35vw',
      header: '編輯商品',
      data: {
        sId: shop.sId,
        product: { 
          ...item 
        } 
      }
    });

    ref.onClose.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((result) => {
      if(result) {
        console.log(result);
      }
    });
  }

}
