import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation, withRouterConfig, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { responseInterceptor } from './core/interceptors/response.interceptor';
import { MessageService } from 'primeng/api';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { Z_INDEX } from './core/config/z-index.config';
import { DialogService } from 'primeng/dynamicdialog';
import { mockIntercepter } from './core/interceptors/mock.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes, 
      withHashLocation(),
      /** * 啟用路由參數輸入綁定 (Component Input Binding)：
       * - 自動將路由參數 (Params)、查詢參數 (QueryParams) 與資料 (Data) 
       * 映射至路由組件中名稱相同的 @Input 或 input()。
       * - 限制：僅對由 Router 直接實例化 (透過 <router-outlet>) 的頂層組件有效。
       */
      withComponentInputBinding(),
      withViewTransitions(), // 讓頁面切換有平滑動畫
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loadingInterceptor,    // 1. 最外層 (處理所有結束後的狀態)
        errorInterceptor,      // 2. 接住裡面丟出的所有錯誤 (包含 responseInterceptor 丟出的)
        responseInterceptor,   // 3. 判斷 success:false 並 throw Error
        authInterceptor,       // 4. 注入 Token
        mockIntercepter,       // 5. 最內層：產生假資料或去抓真 API
      ]),
    ),
    provideNoopAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      zIndex: {
        modal: Z_INDEX.DIALOG,
        overlay: Z_INDEX.DROPDOWN,
        menu: Z_INDEX.DROPDOWN,
        tooltip: Z_INDEX.TOOLTIP,
      }
    }),
    MessageService,
    DialogService,
  ]
};

