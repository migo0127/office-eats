import { Routes } from "@angular/router";
import { APP_ROUTES } from "src/app/core/config/routes.config";

export const group_manage_routes: Routes = [
  { path: '', redirectTo: APP_ROUTES.GROUP_MANAGE.GROUP_CENTER, pathMatch: 'full' },
  {
    path: APP_ROUTES.GROUP_MANAGE.GROUP_CENTER,
    loadComponent: () => import('./group-center/group-center').then((m) => m.GroupCenterComponent)
  },
  {
    path: APP_ROUTES.GROUP_MANAGE.GROUP_INFO,
    loadComponent: () => import('./group-center/group-info/group-info').then(m => m.GroupInfoComponent)
  },
  // (先) 編輯團購 GroupFormComponent 有 gId
  {
    path: APP_ROUTES.GROUP_MANAGE.EDIT_GROUP_FORM,
    loadComponent: () => import('./group-center/group-form/group-form').then(m => m.GroupFormComponent)
  },
  // (後) 新增團購(無 gId) & 複製團購(?copyFrom=gId) GroupFormComponent
  {
    path: APP_ROUTES.GROUP_MANAGE.ADD_GROUP_FORM,
    loadComponent: () => import('./group-center/group-form/group-form').then(m => m.GroupFormComponent)
  },
  {
    path: APP_ROUTES.GROUP_MANAGE.USER_BALANCE,
    loadComponent: () => import('./user-balance/user-balance').then((m) => m.UserBalanceComponent)
  },
  { path: '**', redirectTo: '' },
];