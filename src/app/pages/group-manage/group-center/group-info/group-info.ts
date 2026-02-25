import { Component, computed, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { GROUP_INFO_GROUP } from './group-info-imports';
import { GROUP_BUY_STATUS_MAP, GroupBuyItem, Shop } from '@shared/models/group-buy-common.model';
import { LabelValue, SeverityType } from '@shared/models/common.model';
import { Router } from '@angular/router';
import { ABSOLUTE_ROUTES } from 'src/app/core/config/routes.config';
import { DeviceService } from '@shared/services/device.service';

@Component({
  selector: 'app-group-info',
  imports: [SHARED_IMPORTS, GROUP_INFO_GROUP],
  templateUrl: './group-info.html',
  styleUrl: './group-info.scss',
})
export class GroupInfoComponent {

  /** DI */
  private router = inject(Router);
  private deviceService = inject(DeviceService);

  constructor() {}

  // 模擬訂單基本資訊
  orderInfo = signal<GroupBuyItem>({
    gId: '3',
    groupName: 'Yellow Monday可頌鬆餅',
    category: 'teaTime',
    label: '下午茶',
    status: 'OPEN',
    creator: 'Jason Wu',
    shops: [
      {
        sId: '003',
        shopName: 'Yellow Monday可頌鬆餅',
        address: '臺北市松山區民生東路四段124號',
        tel: '02-25466126',
        orderedItems: [
          {
            pId: '304',
            productName: '肉桂鬆餅',
            uId: '1',
            userName: "路人甲",
            quantity: 2,
            price: 65,
            remark: null,
          },
          {
            pId: '301',
            productName: '原味鬆餅',
            uId: '2',
            userName: "路人乙",
            quantity: 1,
            price: 45,
            remark: null,
          },
          {
            pId: '302',
            productName: '抹茶鬆餅',
            uId: '3',
            userName: "路人丙",
            quantity: 1,
            price: 55,
            remark: null,
          },
          {
            pId: '304',
            productName: '肉桂鬆餅',
            uId: '3',
            userName: "路人丙",
            quantity: 1,
            price: 65,
            remark: null,
          },
          {
            pId: '305',
            productName: '火腿鬆餅',
            uId: '4',
            userName: "路人丁",
            quantity: 1,
            price: 75,
            remark: null,
          },
          {
            pId: '305',
            productName: '火腿鬆餅',
            uId: '5',
            userName: "路人戊",
            quantity: 1,
            price: 75,
            remark: null,
          },
          {
            pId: '306',
            productName: '雞排鬆餅',
            uId: '6',
            userName: "路人己",
            quantity: 1,
            price: 95,
            remark: null,
          },
          {
            pId: '306',
            productName: '雞排鬆餅',
            uId: '7',
            userName: "路人庚",
            quantity: 1,
            price: 95,
            remark: null,
          },
          {
            pId: '302',
            productName: '抹茶鬆餅',
            uId: '8',
            userName: "路人辛",
            quantity: 2,
            price: 55,
            remark: null,
          },
          {
            pId: '303',
            productName: '巧克力鬆餅',
            uId: '7',
            userName: "路人庚",
            quantity: 1,
            price: 65,
            remark: null,
          },
          {
            pId: '303',
            productName: '巧克力鬆餅',
            uId: '9',
            userName: "路人壬",
            quantity: 1,
            price: 65,
            remark: null,
          },
          {
            pId: '303',
            productName: '巧克力鬆餅',
            uId: '10',
            userName: "路人癸",
            quantity: 1,
            price: 65,
            remark: null,
          },
          {
            pId: '301',
            productName: '原味鬆餅',
            uId: '5',
            userName: "路人戊",
            quantity: 1,
            price: 45,
            remark: null,
          },
        ],
      },
      {
        sId: '004',
        shopName: '50嵐',
        address: '臺北市大安區復興南路二段182號' ,
        tel: '02-27093698',
        orderedItems: [
          {
            pId: '201',
            productName: '珍珠紅茶拿鐵',
            uId: '1',
            userName: "路人甲",
            quantity: 1,
            price: 65,
            remark: '2分糖、去冰',
          },
          {
            pId: '202',
            productName: '大正紅茶',
            uId: '2',
            userName: "路人乙",
            quantity: 1,
            price: 35,
            remark: '去冰',
          },
          {
            pId: '202',
            productName: '大正紅茶',
            uId: '3',
            userName: "路人丙",
            quantity: 2,
            price: 35,
            remark: '',
          },
          {
            pId: '201',
            productName: '珍珠紅茶拿鐵',
            uId: '4',
            userName: "路人丁",
            quantity: 1,
            price: 65,
            remark: '無糖、去冰',
          },
          {
            pId: '202',
            productName: '大正紅茶',
            uId: '5',
            userName: "路人戊",
            quantity: 1,
            price: 35,
            remark: '無糖',
          },
        ],
      },
    ],
    startTime: '2026-01-30T09:00:00',
    endTime: '2026-01-30T12:00:00',
    estimateTime: '2026-01-31T14:30:00',
    totalQty: 3,
    total: 130,
    groupNote: '每人上限 130 元',
  });

  // 計算每個商家的小計
  shopStats = computed(() => {
    return this.orderInfo().shops.map((shop: Shop) => {
      const qty: number = shop.orderedItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
      const total: number = shop.orderedItems?.reduce((acc, item) => acc + item.quantity * item.price, 0) ?? 0;
      return { ...shop, qty, total };
    });
  });

  isMobile = computed<boolean>(() => this.deviceService.isMobile());

  /** 檢查畫面的寬度與高度，以自適應設定最大高度 */
  dynamicScrollHeight = this.deviceService.getDynamicHeight({
    pc: 21,
    portrait: 27,
    landscape: 15
  })

  readonly statusDisplay: Record<string, LabelValue<SeverityType>> = GROUP_BUY_STATUS_MAP as any;

  ngOnInit(): void { }

  goBack(): void {
    this.router.navigate([ABSOLUTE_ROUTES.GROUP_CENTER]);
  }

}
