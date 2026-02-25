import { setTime } from "./util-function";

export const DASHBOARD_MOCK = {
  'GET:/dashboard': [
    {
      gId: '1',
      groupName: '正忠排骨飯',
      category: 'lunch',
      label: '午餐',
      status: 'OPEN',
      creator: 'Sarah Lin',
      shops: [
        { sId: '001', shopName: '正忠排骨飯' }
      ],
      startTime: setTime(9,0 ,1),
      endTime: setTime(9, 40, 1),
      estimateTime: setTime(12, 0, 1),
      totalQty: 12,
      groupNote: '最少12份送',
      link: null as string | null
    },
    {
      gId: '2',
      groupName: '迷客夏 Milksha',
      category: 'drink',
      label: '飲料',
      status: 'OPEN',
      creator: 'Jason Wu',
      shops: [
        { sId: '002', shopName: '迷客夏 Milksha' }
      ],
      startTime: setTime(10 ,0, 1),
      endTime: setTime(11, 40, 1),
      estimateTime: setTime(14, 30, 1),
      totalQty: 5,
      groupNote: null,
      link: null
    },
    {
      gId: '3',
      groupName: 'Yellow Monday可頌鬆餅',
      category: 'teaTime',
      label: '下午茶',
      status: 'OPEN',
      creator: 'Jason Wu',
      shops: [
        { sId: '003', shopName: 'Yellow Monday可頌鬆餅' },
        { sId: '004', shopName: '50嵐' },
      ],
      startTime: setTime(10 ,0, 1),
      endTime: setTime(11, 40, 1),
      estimateTime: setTime(14, 30, 2),
      totalQty: null,
      groupNote: '每人上限 130 元',
      link: 'xxxx'
    },
    {
      gId: '4',
      groupName: '50嵐',
      category: 'drink',
      label: '飲料',
      status: 'CLOSED',
      creator: 'Jason Wu',
      shops: [
        { sId: '004', shopName: '50嵐' }
      ],
      startTime: setTime(10 ,0),
      endTime: setTime(11, 40),
      estimateTime: setTime(14, 30),
      totalQty: 11,
      groupNote: null,
      link: null
    },
    {
      gId: '5',
      groupName: '50嵐',
      category: 'drink',
      label: '飲料',
      status: 'CLOSED',
      creator: 'Jason Wu',
      shops: [
        { sId: '004', shopName: '50嵐' }
      ],
      startTime: setTime(10 ,0),
      endTime: setTime(11, 40),
      estimateTime: setTime(14, 30, -1),
      totalQty: 8,
      groupNote: null,
      link: null
    },
  ],
}