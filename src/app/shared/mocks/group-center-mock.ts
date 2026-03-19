import { GroupBuyItem } from "@shared/models/group-buy-common.model";
import { setTime } from "./util-function";

const GROUP_CENTER_DATA: GroupBuyItem[] = [
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
    startTime: setTime(9, 0, 0),
    endTime: setTime(9, 40, 0),
    estimateTime: setTime(12, 0, 0),
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
    startTime: setTime(10, 0, 0),
    endTime: setTime(11, 30, 0),
    estimateTime: setTime(14, 30, 0),
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
    startTime: setTime(9, 0, 0),
    endTime: setTime(16, 0, 1),
    estimateTime: setTime(14, 0, 2),
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
    startTime: setTime(10, 0, 0),
    endTime: setTime(11, 30, 0),
    estimateTime: setTime(14, 30, 0),
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
    startTime: setTime(9, 0, 0),
    endTime: setTime(9, 30, 0),
    estimateTime: setTime(14, 30, 0),
    totalQty: 16,
    total: 2730,
    groupNote: null,
    link: null
  }
];

export const GROUP_CENTER_MOCK = {
  'GET:/group-center/list': () => { 
    console.log('list', [...GROUP_CENTER_DATA])
    return [...GROUP_CENTER_DATA];
  },
  'PUT:/group-center/cancel/:gId': ({ params }: any) => {
    const index: number = GROUP_CENTER_DATA.findIndex((item) => String(item.gId) === String(params.gId));

    if(index !== -1) {
      GROUP_CENTER_DATA[index] = { 
        ...GROUP_CENTER_DATA[index], 
        status: 'CANCEL' 
      };
    }

    return {
      status: 200,
      message: "取消團購成功",
      success: true,
    }
  },
  'DELETE:/group-center/delete/:gId': ({ params }: any) => {
    const index: number = GROUP_CENTER_DATA.findIndex((item) => item.gId === params.gId);
    
    if(index !== -1) {
      GROUP_CENTER_DATA.splice(index, 1);   
    }

    return {
      status: 200,
      message: "刪除團購成功",
      success: true,
    }
  },
}