import {  HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { delay, of } from "rxjs";
import { USE_MOCK } from "../tokens/http.tokens";
import { BIZ_ERROR_CODES } from "../config/error-code";
import { MOCK_REGISTRY } from "@shared/mocks";

export const mockIntercepter: HttpInterceptorFn = (req, next) => {
  // 檢查是否標記為 USE_MOCK
  if(req.context.get(USE_MOCK)) {
    // console.log('mockIntercepter: ', {req, window});

    /** 1. 建立比對用的 Key，例如 "GET:/dashboard" */
    const url: URL = new URL(req.url, window.location.origin);
    const urlPath: string = url.pathname;
    const mockKey: string = `${req.method}:${urlPath}`;

    // console.log('mockIntercepter: ', {url, urlPath, mockKey});

    /** 2. 查找是否有假資料存在 "GET:/dashboard" */
    let responseData: any = MOCK_REGISTRY[mockKey];
    /** 用來存取多個參數，如: { gId: '1', oId: '100' } */
    let pathParams: any = {};

    // console.log('mockIntercepter: ', {urlPath, mockKey, responseData, pathParams});

    /** 3. 如果完全比對失敗，嘗試「路徑參數匹配」（例如 /order/1 匹配 /order/:gId） */
    if(!responseData) {
      // 3-1. 取得所有定義的 Key
      const registryKeyss: string[] = Object.keys(MOCK_REGISTRY);

      const dynamicKey = registryKeyss.find((key) => {
        // 若不包含 :gId 參數寫法就不理會
        if(!key.includes(':')) return false;

        /**  
         * 將 ":gId" 轉換為捕獲組 "([^\\/]+)"，以便後續抓取內容 
         * 轉換後會像這樣: ^GET:/group-buy/([^/]+)/order/([^/]+)$
         * */
        const pattern: string = key.replace(/:[^\/]+/g, '([^/]+)');
        const regex: RegExp = new RegExp(`^${pattern}$`);
        const match: RegExpMatchArray = mockKey.match(regex);

        // console.log('pattern: ', {pattern, regex, match});

        if(match) {
          // 3-2. 如果匹配成功，把參數名稱與值配對
          const paramNames: string[] = key.match(/:[^\/]+/g) || [];
          paramNames.forEach((paramName: string, index: number) => {
            // 移除冒號，例如 ":gId" -> "gId"
            pathParams[paramName.slice(1)] = match[index + 1];
          });
          return true;  
        }
        return false;
      });

      if (dynamicKey) {
        responseData = MOCK_REGISTRY[dynamicKey];
      }
    }

    if(responseData) {
      const isFunction = typeof responseData === 'function';
      const hasPathParams = Object.keys(pathParams).length > 0;

      // console.log('hasPathParams: ', {pathParams, hasPathParams})

      /** 如果映射表裡是 function，就執行它並傳入 body */
      const body = isFunction
      ? responseData({ 
          params: pathParams,  // URL 路徑參數 (:gId)
          body: req.body,      // POST 的資料
          query: req.params    // URL 問號後的參數 (?oId=...)
        })
      : responseData;
        
      // console.warn(`[Mock] 攔截請求: ${mockKey}`, { request: req.body, response: body });

      return of(new HttpResponse({ status: 200, body})).pipe(
        delay(800) // 模擬網路延遲
      );
    } else {

      console.log(`** mockIntercepter mockKey Error: ${mockKey} 不存在 **`);

      return of(new HttpResponse({
        status: 200,
        body: {
          success: false, 
          code: BIZ_ERROR_CODES.MOCK_DATA_MISSING,
          message: `找不到對應的 Mock 假資料設定。`, 
          data: null
        }
      })).pipe(
        delay(800) // 模擬網路延遲
      );
    }
    
  } 
  return next(req);
}