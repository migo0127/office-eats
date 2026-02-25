import { setTime } from "./util-function"

let MY_ORDERS_DATA = [
  {
    oId: "100",
    gId: "1",
    groupName: "正忠排骨飯",
    category: 'lunch',
    status: 'OPEN',
    creator: 'Sarah Lin',
    shops: [
      {
        sId: '001',
        shopName: '正忠排骨飯',
        orderedItems: [
          {
            pId: "102",
            productName: "雞腿飯",
            quantity: 1,
            price: 120,
            remark: "飯半",
          }
        ]
      }
    ],
    endTime: setTime(9, 40, 1),
    label: '午餐',
    totalQty: 1,
    total: 120,
    link: null as any,
    groupNote: null  as any
  },
  {
    oId: "200",
    gId: "2",
    groupName: "迷客夏 Milksha",
    category: 'drink',
    status: 'OPEN',
    creator: 'Jason Wu',
    shops: [
      {
        sId: '002',
        shopName: '迷客夏 Milksha',
        orderedItems: [
          {
            pId: "201",
            productName: "珍珠紅茶拿鐵",
            quantity: 1,
            price: 65,
            remark: "2分糖、去冰",
          }
        ]
      }
    ],
    endTime: setTime(11, 40, 1),
    label: '飲料',
    totalQty: 1,
    total: 65,
    link: null,
    groupNote: null
  },
  {
    oId: "300",
    gId: "3",
    groupName: "Yellow Monday可頌鬆餅",
    category: 'teaTime',
    status: 'CLOSED',
    creator: 'Jason Wu',
    shops: [
      {
        sId: '003',
        shopName: 'Yellow Monday可頌鬆餅',
        orderedItems: [
          {
            pId: "304",
            productName: "肉桂鬆餅",
            quantity: 2,
            price: 30,
            remark: null,
          }
        ]
      },
      {
        sId: '004',
        shopName: '50嵐',
        orderedItems: [
          {
            pId: "201",
            productName: "珍珠紅茶拿鐵",
            quantity: 1,
            price: 65,
            remark: "2分糖、去冰",
          },
          {
            pId: "202",
            productName: "大正紅茶",
            quantity: 1,
            price: 35,
            remark: "2分糖、去冰",
          }
        ]
      },
    ],
    endTime: setTime(11, 40, 1),
    label: '下午茶',
    totalQty: 3,
    total: 125,
    link: null,
    groupNote: null
  }
];

export const MY_ORDERS_MOCK = {
  'GET:/my-orders/:uId/stats': [
    {
      label: '本月消費',
      value: 1250,
      isPrefix: true,
      unit: '$',
      icon: 'pi pi-wallet',
      color: 'text-pink-500',
      path: `/user-manage/my-orders/1`,
      queryParams: { mode: 'month' }
    },
    {
      label: '本週消費',
      value: 750,
      isPrefix: true,
      unit: '$',
      icon: 'pi pi-dollar',
      color: 'text-blue-500',
      path: `/user-manage/my-orders/1`,
      queryParams: { mode: 'week' }
    },
    {
      label: '當日訂單',
      value: 1,
      isPrefix: false,
      unit: '份',
      icon: 'pi pi-bell',
      color: 'text-green-500',
      path: `/user-manage/my-orders/1`,
      queryParams: { mode: 'day' }
    },
    {
      label: '當日消費',
      value: 150,
      isPrefix: true,
      unit: '$',
      icon: 'pi pi-shopping-cart',
      color: 'text-orange-500',
      path: `/user-manage/my-orders/1`,
      queryParams: { mode: 'day' }
    },
  ],
  'GET:/my-orders/:uId': () => { 
    // console.log(MY_ORDERS_DATA)
    return [...MY_ORDERS_DATA]
  },
  'DELETE:/my-orders/:uId/delete/:oId': ({ params }: any) => {
    const index: number = MY_ORDERS_DATA.findIndex((item) => item.oId === params.oId);

    if(index !== -1) {
      MY_ORDERS_DATA.splice(index, 1);
    }

    // console.log({MY_ORDERS_DATA, uId: params.uId, oId: params.oId})

    return {
      status: 200,
      message: "刪除訂單成功",
      success: true,
    }
  }
}