import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { LAYOUT_IMPORTS } from './layout-imports';
import { environment } from '@env/environment';

@Component({
  selector: 'app-layout',
  imports: [SHARED_IMPORTS, LAYOUT_IMPORTS],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {

  /** 是否為 prod */
  isProd: boolean = environment.production;
  /** 桌面版收合狀態 */
  isCollapsed = signal(false);   
  /** 手機版選單顯示狀態 */
  mobileMenuVisible = signal(false);

  constructor() { }
  
  toggleAside() {
    this.isCollapsed.update(v => !v);
  }

}
