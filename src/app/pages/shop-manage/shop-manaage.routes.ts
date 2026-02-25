import { Routes } from '@angular/router';
import { APP_ROUTES } from '@core/config/routes.config';

export const shop_manage_routes: Routes = [
  { path: '', redirectTo: APP_ROUTES.SHOP_MANAGE.SHOP_LIST, pathMatch: 'full' },
  {
    path: APP_ROUTES.SHOP_MANAGE.SHOP_LIST,
    loadComponent: () => import('./shop-list/shop-list').then((m) => m.ShopListComponent),
  },
  /** 編輯商家資訊，有 /:sId */
  {
    path: APP_ROUTES.SHOP_MANAGE.EDIT_SHOP_INFO,
    loadComponent: () => import('./shop-info/shop-info').then((m) => m.ShopInfoComponent),
  },
  /** 新增商家資訊，沒有 /:sId */
  {
    path: APP_ROUTES.SHOP_MANAGE.ADD_SHOP_INFO,
    loadComponent: () => import('./shop-info/shop-info').then((m) => m.ShopInfoComponent),
  },
  { path: '**', redirectTo: APP_ROUTES.SHOP_MANAGE.SHOP_LIST },
];
