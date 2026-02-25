import { Routes } from "@angular/router";
import { APP_ROUTES } from "src/app/core/config/routes.config";

export const user_manage_routes: Routes = [
  // 沒有 gId 返回 dashboard
  { path: '', redirectTo: APP_ROUTES.DASHBOARD, pathMatch: 'full' },
  { 
    path: APP_ROUTES.USER_MANAGE.MY_ORDERS,
    loadComponent: () => import('../user-manage/my-orders/my-orders').then((m) => m.MyOrdersComponent) 
  },
  { 
    path: APP_ROUTES.USER_MANAGE.TRANSACTIONTORY_HISTORY, 
    loadComponent: () => import('../user-manage/transactiontory-history/transactiontory-history').then((m) => m.TransactiontoryHistoryComponent) 
  },
  { path: '**', redirectTo: APP_ROUTES.DASHBOARD }
];