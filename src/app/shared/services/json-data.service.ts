import { Injectable, signal } from "@angular/core";
import { JsonData } from "@shared/models/common.model";

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {
  /** 要顯示的 JSON 資料 */
  private jsonDataSingal = signal<JsonData>(null);
  readonly jsonData = this.jsonDataSingal.asReadonly();

  /** 是否顯示 json-data dialog */
  showDialog = signal<boolean>(false);

  setJsonData(data: JsonData): void {
    this.jsonDataSingal.set(data);
  }

  openJsonDataDialog(): void {
    if(this.jsonData()) {
      this.showDialog.set(true);
    }
  }
}
