import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { GROUP_FORM_IMPORTS } from './group-form-imports';
import { Router } from '@angular/router';
import {
  GroupBuyItem,
  Shop,
  SHOP_TAG_MAP,
  SHOP_TAG_OPTS,
  ShopTag,
} from '@shared/models/group-buy-common.model';
import { DeviceService } from '@shared/services/device.service';
import { DynamicDialogService } from '@shared/services/dynamic-dialog.service';
import { LabelValue } from '@shared/models/common.model';

@Component({
  selector: 'app-group-form',
  imports: [SHARED_IMPORTS, GROUP_FORM_IMPORTS],
  templateUrl: './group-form.html',
  styleUrl: './group-form.scss',
})
export class GroupFormComponent {
  /** DI */
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private deviceService = inject(DeviceService);
  private dynamicDialogService = inject(DynamicDialogService);

  // 模式判斷
  gId = input.required<string>();
  copyFrom = input.required<string>();
  isEdit = computed(() => !!this.gId());
  isCopy = computed(() => !!this.copyFrom());

  // 資料狀態
  groupData = signal<Partial<GroupBuyItem>>({
    groupName: '',
    category: 'tea',
    creator: 'Jason Wu',
    startTime: new Date().toISOString(),
    endTime: null,
    groupNote: '',
  });

  selectedShopIds = signal<string[]>([]);
  selectedShops = signal<Shop[]>([]);

  // 選項資料
  typeOptions = [
    { label: '下午茶', value: 'tea' },
    { label: '午餐', value: 'lunch' },
    { label: '加班晚餐', value: 'dinner' },
  ];

  statusOptions = [
    { label: '供應中', value: false },
    { label: '停售', value: true },
  ];

  tagOptions = signal<LabelValue<ShopTag>[]>(SHOP_TAG_OPTS);
  tagsDisplay = SHOP_TAG_MAP as any;

  dayLabels: string[] = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

  // 模擬商家資料庫 (應從 API 獲取)
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

  expandedRows = {};

  /** 檢查畫面的寬度與高度，以自適應設定最大高度 */
  dynamicScrollHeight = this.deviceService.getDynamicHeight({
    pc: 12,
    portrait: 18,
    landscape: 6,
  });
  isMobile = computed<boolean>(() => this.deviceService.isMobile());

  constructor() {}

  fetchGroupDetail(gid: string) {
    // API Call...
    // this.messageService.add({ severity: 'info', summary: '系統載入', detail: '正在讀取團購資料...' });
    // 假設帶入資料
    this.selectedShopIds.set(['S1']);
    this.loadSelectedShopsData();
  }

  loadSelectedShopsData() {
    // 根據 selectedShopIds 模擬從 API 撈取詳細 Shop (含 Menu)
    const shops = this.shops().filter((s) => this.selectedShopIds().includes(s.sId));
    // 補齊空的 menu 範例
    shops.forEach((s) => {
      if (!s.menu || s.menu.length === 0) {
        s.menu = [
          { pId: 'P1', productName: '大正紅茶', price: 35, disabled: false },
          { pId: 'P2', productName: '珍珠奶茶', price: 55, disabled: false },
        ];
      }
    });
    this.selectedShops.set(shops);
  }

  onCancel(): void {

  }

  onUpdateAll() {
    // this.messageService.add({ severity: 'success', summary: '成功', detail: '團購資料已更新' });
    setTimeout(() => this.router.navigate(['/group-manage']), 1000);
  }

  goBack() {
    this.router.navigate(['/group-manage']);
  }
}
