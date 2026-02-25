import { Component, computed, inject } from "@angular/core";
import { JsonDataService } from "@shared/services/json-data.service";
import { SHARED_IMPORTS } from "@shared/shared-imports";
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.html',
  styleUrls: ['./json-dialog.scss'],
  imports: [ SHARED_IMPORTS, DialogModule ]
})
export class JsonDialogComponent {

  private jsonDataService = inject(JsonDataService);

  vm = computed(() => ({
    title: this.jsonDataService.jsonData()?.title ?? 'JSON',
    isVisible: this.jsonDataService.showDialog(),
    data: this.jsonDataService.jsonData()?.data ?? [],
  }));
  
  constructor() { }

  ngOnInit(): void { }

  onHide(): void {
    this.jsonDataService.showDialog.set(false);
  }

}