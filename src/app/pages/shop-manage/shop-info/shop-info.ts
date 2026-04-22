import { Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { SHOP_INFO_IMPORTS } from './shop-info-imports';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItem, Shop, SHOP_TAG_OPTS } from '@shared/models/group-buy-common.model';
import { ToastService } from '@shared/services/toast.service';
import { ABSOLUTE_ROUTES } from '@core/config/routes.config';
import { DeviceService } from '@shared/services/device.service';

@Component({
  selector: 'app-shop-info',
  imports: [SHARED_IMPORTS, SHOP_INFO_IMPORTS],
  templateUrl: './shop-info.html',
  styleUrl: './shop-info.scss',
})
export class ShopInfoComponent {
  /** DI */
  private router = inject(Router);
  private deviceService = inject(DeviceService);
  private toastService = inject(ToastService);

  sId = input.required<string>();
  
  shop = signal<Shop>({
    sId: '001',
    shopName: '正忠排骨飯',
    tel: '0912-345-678',
    offDays: [0, 6],
    businessHours: ['11:00-14:00', '17:00-20:00'],
    updatedAt: new Date(),
    menu: [
      {
        pId: '101',
        productName: '招牌排骨飯',
        price: 110,
        quantity: 99,
        imageUrl: null,
        disabled: false,
        note: null,
      },
      {
        pId: '101',
        productName: '雞腿飯',
        price: 120,
        quantity: 99,
        imageUrl: null,
        disabled: false,
        note: null,
      },
      {
        pId: '103',
        productName: '麻醬麵 (大)',
        price: 90,
        quantity: 99,
        imageUrl: null,
        disabled: true,
        note: '份量大!',
      },
      {
        pId: '104',
        productName: '麻醬麵 (小)',
        price: 70,
        quantity: 99,
        imageUrl: null,
        disabled: false,
        note: null,
      },
    ],
  });

  // 變數
  tagOptions = SHOP_TAG_OPTS;
  weekDays = [
    { label: '一', value: 1 },
    { label: '二', value: 2 },
    { label: '三', value: 3 },
    { label: '四', value: 4 },
    { label: '五', value: 5 },
    { label: '六', value: 6 },
    { label: '日', value: 0 },
  ];
  statusOptions = [
    { label: '供應中', value: false },
    { label: '暫停供應', value: true },
  ];

  tempStartTime: Date | null = null;
  tempEndTime: Date | null = null;

  isMobile = computed(() => this.deviceService.isMobile());

  constructor() { }

  goBack() {
    this.router.navigate([ABSOLUTE_ROUTES.SHOP_LIST]);
  }

  /** 更新 shop 欄位 */
  updateShopField<K extends keyof Shop>(field: K, value: Shop[K]) {
    this.shop.update((s) => ({ ...s, [field]: value }));
  }

  /** 更新 shop 欄位 */
  updateProdpField<K extends keyof OrderItem>(field: K, value: OrderItem[K]) {
    this.shop.update((s) => ({ ...s, [field]: value }));
  }

  /** 匯入 */
  importExcel(): void {}

  /** 匯出 */
  exportExcel(): void {}

  /** 全部更新 */
  onUpdateAll() {
    this.toastService.notify({ detail: '正在同步商家與商品資料...' });
    // console.log('Final Data:', this.shop());
  }

  // 基本資料更新
  onUpdateShop() {
    this.toastService.notify({ detail: '商家基本資料已存檔' });
  }

  // 營業時間處理
  addBusinessHour() {
    if (this.tempStartTime && this.tempEndTime) {
      const start = this.tempStartTime.toTimeString().slice(0, 5);
      const end = this.tempEndTime.toTimeString().slice(0, 5);
      const newTime = `${start}-${end}`;

      this.shop.update((s) => ({
        ...s,
        businessHours: [...(s.businessHours || []), newTime],
      }));
      this.tempStartTime = null;
      this.tempEndTime = null;
    }
  }

  /** 移除營業時間 */
  removeBusinessHour(index: number) {
    this.shop.update((s) => ({
      ...s,
      businessHours: s.businessHours?.filter((_, i) => i !== index),
    }));
  }

  /** 產品清單更新 */
  onUpdateProducts() {
    this.toastService.notify({ detail: '產品清單已存檔' });
  }

  /** 移除產品 */
  onRemoveProduct(index: number) {
    this.shop.update((s) => ({
      ...s,
      menu: s.menu?.filter((_, i) => i !== index),
    }));
  }

  /** 上傳產品圖片 */
  onProductImageUpload(event: any, product: OrderItem) {
    const file = event.files[0]; // 取得上傳的檔案
    if (file) {
      console.log(`正在處理產品 ${product.productName} 的圖片:`, file.name);

      // 將 file 物件暫存到該產品資料中
      product.imageUrl = file;
    }
  }

  // 商品增刪
  onAddProduct() {
    const newItem: OrderItem = {
      pId: '',
      productName: '',
      price: 0,
      quantity: 0,
      disabled: false,
    };
    this.shop.update((s) => ({
      ...s,
      menu: [...(s.menu || []), newItem],
    }));
  }
}
