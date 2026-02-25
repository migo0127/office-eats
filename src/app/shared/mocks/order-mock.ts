import { Orders } from "@shared/models/group-buy-common.model";

const ORDER_MAIN_DATA: Orders[] = [
  {
    gId: '1', // 團購活動 ID
    totalPrice: 230, // 該店小計
    shop: {
      sId: '1',
      shopName: '正忠排骨飯',
      address: '台北市...',
      tel: '02-12345678',
      // menu 放在這裡代表該店的「完整選單」
      menu: [
        { pId: '101', productName: '招牌排骨飯', price: 110, quantity: 0, productRating: 3.8, commentCount: 15 },
        { pId: '102', productName: '雞腿飯', price: 120, quantity: 0, productRating: 4, commentCount: 10 },
        { pId: '103', productName: '麻醬麵 (大)', price: 90, quantity: 0, productRating: 3, commentCount: 2 },
        { pId: '104', productName: '麻醬麵 (小)', price: 70, quantity: 0, productRating: 3.5, commentCount: 0 },
      ]
    },
  },
  {
    gId: '1',
    totalPrice: 65,
    shop: {
      sId: '2',
      shopName: '迷客夏 Milksha 臺北遼寧店',
      menu: [
        { pId: '201', productName: '珍珠紅茶拿鐵', price: 65, quantity: 0, productRating: 4.5, commentCount: 7, note: '最低2分糖' },
        { pId: '202', productName: '大正紅茶', price: 35, quantity: 0, productRating: 2.8, commentCount: 3, disabled: true }
      ]
    }
  },
  {
    gId: '2',
    totalPrice: 65,
    shop: {
      sId: '2',
      shopName: '迷客夏 Milksha 臺北遼寧店',
      menu: [
        { pId: '201', productName: '珍珠紅茶拿鐵', price: 65, quantity: 0, productRating: 4.5, commentCount: 7, note: '最低2分糖' },
        { pId: '202', productName: '大正紅茶', price: 35, quantity: 0, productRating: 2.8, commentCount: 3, disabled: true }
      ]
    }
  },
  {
    gId: '3',
    totalPrice: 65,
    shop: {
      sId: '2',
      shopName: 'Yellow Monday可頌鬆餅',
      menu: [
        { pId: '301', productName: '原味鬆餅', price: 45, quantity: 0, productRating: 4.5, commentCount: 17, note: null },
        { pId: '302', productName: '抹茶鬆餅', price: 55, quantity: 0, productRating: 3.8, commentCount: 3, disabled: true },
        { pId: '303', productName: '巧克力鬆餅', price: 65, quantity: 0, productRating: 4.7, commentCount: 26, note: null },
        { pId: '304', productName: '肉桂鬆餅', price: 65, quantity: 0, productRating: 4, commentCount: 12 , note: null }
      ]
    }
  }
];

export const ORDER_MOCK = {
  'GET:/group-buy/:gId/order': ({ params }: any) => {
    return ORDER_MAIN_DATA.filter((item) => item.gId === params.gId);
  },
  'POST:/group-buy/:gId/order/submit': ({ params, body }: any) => {
    const { orderedItems } = body;

    // 1. 檢查參數是否存在
    if (!orderedItems || !Array.isArray(orderedItems)) {
      return { success: false, message: '無效的訂單資料' };
    }

    // 2. 遍歷傳來的所有商品項
    orderedItems.forEach((incomingItem: any) => {
      // 針對每一件商品，去資料庫找「該團購」下「該商店」的資料物件
      const targetEntry = ORDER_MAIN_DATA.find(
        (item) => item.gId === params.gId && item.shop?.sId === incomingItem.sId
      );

      if (targetEntry && targetEntry.shop?.menu) {
        // 3. 在該商店的選單中找到對應商品
        const product = targetEntry.shop.menu.find((p: any) => p.pId === incomingItem.pId);
        
        if (product) {
          // 更新
          product.quantity = incomingItem.quantity;
        }
      }
    });

    // 4. 回傳成功狀態
    return {
      success: true,
      code: '200',
      message: '更新成功',
      data: true
    };
  }
}
