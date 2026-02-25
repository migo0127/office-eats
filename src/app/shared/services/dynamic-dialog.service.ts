import { computed, inject, Injectable, Type } from "@angular/core";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DeviceService } from "./device.service";

@Injectable({
  providedIn: 'root'
})
export class DynamicDialogService {

  /** DI */
  private dialogService = inject(DialogService);
  private deviceService = inject(DeviceService);

  isMobile = computed(() => this.deviceService.isMobile());

  private _baseConfig: DynamicDialogConfig = {
    width: '60vw',
    position: this.isMobile() ? 'center' : 'top',
    style: { 
      'margin-top': '5vh',
      'min-width': '350px', 
      'max-width': '900px', 
      // 'min-height': '30vh',
      'max-height': this.isMobile() ? '70vh' : '90vh',
    },
    // 內容區自動捲軸
    contentStyle: { 'overflow': 'hidden' },
    
    closable: true,
    // 點外側不關閉
    dismissableMask: false, 
    // 焦點不鎖定 
    focusTrap: false,
    // 禁止拖拽  
    draggable: false,     
    
    // 樣式類名（方便 CSS 全域微調）
    styleClass: 'custom-dy-dialog',
    
    // 響應式：手機版自動變寬
    breakpoints: {
      '960px': '75vw',
      '640px': '95vw'
    },

    // 不要讓 Dialog 消失時動畫閃爍 (選填)
    transitionOptions: '150ms cubic-bezier(0, 0, 0.2, 1)',
  };

  constructor() {}

  /**
   * 開啟通用 Dialog 的封裝方法
   * @param component 要渲染的組件 (例如 CommentsComponent)
   * @param config 傳入的資料與配置
   */
  open(component: Type<any>, config: DynamicDialogConfig): DynamicDialogRef {
    const mergeConfig: DynamicDialogConfig = {
      ...this._baseConfig,
      ...config,
      // 確保 data 永遠是一個物件，避免在組件中 inject(DynamicDialogConfig).data 時拿到 null
      data: { ...(config.data || {}) },
      style: { ...this._baseConfig.style, ...config.style },
      contentStyle: { ...this._baseConfig.contentStyle, ...config.contentStyle }
    };

    return this.dialogService.open(component, mergeConfig);
  }

}