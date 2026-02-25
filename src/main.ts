import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { enableProdMode, isDevMode } from '@angular/core';
import { environment } from '@env/environment';

/** 1. 如果是正式環境配置，啟動 ProdMode 最佳化 */
if (environment.production) {
  /** 告訴 Angular 關閉開發模式檢查 */
  enableProdMode(); 
}

/** 
 * 2. 判斷現在是否為「非開發模式」
 *  - 如果不是開發模式 (也就是正式環境)，就執行靜音
 */
if(!isDevMode()) {
  (window as any).console.log = () => {};
  (window as any).console.warn = () => {};
  (window as any).console.info = () => {};
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

