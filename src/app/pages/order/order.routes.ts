import { Routes } from "@angular/router";
import { APP_ROUTES } from "src/app/core/config/routes.config";

export const order_routes: Routes = [
  // 沒有 gId 返回 dashboard
  { path: '', redirectTo: APP_ROUTES.DASHBOARD, pathMatch: 'full' },
  { 
    path: APP_ROUTES.ORDER.MAIN, 
    loadComponent: () => import('./order-main/order-main').then((m) => m.OrderMainComponent) 
  },
  { path: '**', redirectTo: APP_ROUTES.DASHBOARD }
];