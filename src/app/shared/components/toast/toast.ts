import { Component, computed, inject } from '@angular/core';
import { TOAST_IMPORTS } from './toast-imports';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ToastActionType, ToastOptions } from '@shared/models/toast.model';
import { ToastCloseEvent } from 'primeng/toast';
import { DeviceService } from '@shared/services/device.service';
import { Z_INDEX } from 'src/app/core/config/z-index.config';

@Component({
  selector: 'app-toast',
  imports: [TOAST_IMPORTS],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastComponent {

  /** DI */
  private deviceSerice = inject(DeviceService);
  private messageService = inject(MessageService);

  isMobile = computed<boolean>(() => this.deviceSerice.isMobile());

  readonly _tipIcons: { [key: string]: string } = {
    'success': 'pi-check-circle',
    'error': 'pi-times-circle',
    'info': 'pi-info-circle',
    'warn': 'pi-exclamation-triangle',
  }

  readonly z_index = Z_INDEX;

  constructor() { }

  /** 確認 BTN ToastActionType.CONFIRM */
  onConfirm(message: ToastOptions): void {
    this.emitAction(message, ToastActionType.CONFIRM);
  }

  /**
   * 右上 X 取消 ToastActionType.CANCEL
   *  - (onClose)="onClose($event)" => event?.message
   *  - (click)="onClose(message)" => event
   * */
  onClose(event: ToastCloseEvent | ToastOptions): void {
    const message = (event && 'message' in event) ? event?.message : event;

    if (message) {
      this.emitAction(message as ToastOptions, ToastActionType.CANCEL);
    }
  }

  /** 下方 關閉 BTN 等等 ToastActionType.CLOSE */
  onBtnClose(message: ToastOptions): void {
    this.emitAction(message, ToastActionType.CLOSE);
  }

  /** 統一處理發送訊號與清理 */
  private emitAction(message: ToastOptions, type: ToastActionType): void {
    const action$ = message?.data?.action$;
    if (action$) {
      action$.next(type);
      action$.complete();
    }
    // 手動清除該則訊息
    this.messageService.clear(message.key);
  }

}
