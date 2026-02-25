import { inject, Pipe, PipeTransform, SecurityContext } from "@angular/core";
import { DomSanitizer, SafeValue } from "@angular/platform-browser";

type SanitizeType =
  'html' | 'style' | 'script' | 'url' | 'resourceUrl' |
  'trustHtml' | 'trustStyle' | 'trustScript' | 'trustUrl' | 'trustResourceUrl';

@Pipe({
  name: 'sanitize',
  standalone: true,
})
export class SanitizePipe implements PipeTransform {

  private domSanitizer = inject(DomSanitizer);

  transform(value: any, type: SanitizeType = 'trustHtml'): string | SafeValue | null {

    // 防呆
    if (value === null || value === undefined) return value;

    switch(type) {
      /* 1. Sanitize: 回傳清理後的字串，移除危險內容 => string | null */
      case 'html': return this.domSanitizer.sanitize(SecurityContext.HTML, value);
      case 'style': return this.domSanitizer.sanitize(SecurityContext.STYLE, value);
      case 'script': return this.domSanitizer.sanitize(SecurityContext.SCRIPT, value);
      case 'url': return this.domSanitizer.sanitize(SecurityContext.URL, value);
      case 'resourceUrl': return this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, value);

      /* 2. Trust: 告訴 Angular 這是安全的物件，完全跳過檢查 => SafeValue */
      case 'trustHtml': return this.domSanitizer.bypassSecurityTrustHtml(value);
      case 'trustStyle': return this.domSanitizer.bypassSecurityTrustStyle(value);
      case 'trustScript': return this.domSanitizer.bypassSecurityTrustScript(value);
      case 'trustUrl': return this.domSanitizer.bypassSecurityTrustUrl(value);
      case 'trustResourceUrl': return this.domSanitizer.bypassSecurityTrustResourceUrl(value);

      /** 不支援的類型 */
      default: throw new Error(`[SanitizePipe] 不支援的類型: ${type}`);
    }
  }

}
