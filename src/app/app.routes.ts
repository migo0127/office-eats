import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { APP_ROUTES } from './core/config/routes.config';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
      path: APP_ROUTES.LOGIN,
      canActivate: [loginGuard],
      loadComponent: () =>  import('./auth/login/login').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: APP_ROUTES.DASHBOARD,
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent)
      },
      {
        path: APP_ROUTES.USER_MANAGE.ROOT,
        loadChildren: () => import('./pages/user-manage/user-manage.routes').then((m) => m.user_manage_routes)
      },
      {
        path: APP_ROUTES.ORDER.ROOT,
        loadChildren: () => import('./pages/order/order.routes').then((m) => m.order_routes)
      },
      {
        path: APP_ROUTES.GROUP_MANAGE.ROOT,
        canActivate: [adminGuard],
        loadChildren: () => import('./pages/group-manage/group-manage.routes').then((m) => m.group_manage_routes)
      },
      {
        path: APP_ROUTES.SHOP_MANAGE.ROOT,
        canActivate: [adminGuard],
        loadChildren: () => import('./pages/shop-manage/shop-manaage.routes').then((m) => m.shop_manage_routes)
      },
    ]
  },
  { path: '**', redirectTo: APP_ROUTES.DASHBOARD }
];
