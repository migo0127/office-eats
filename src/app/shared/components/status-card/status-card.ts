import { Component, inject, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { STATUS_CARD_IMPORTS } from './status-card-imports';
import { Router } from '@angular/router';
import { StatusItem } from '@shared/models/status-card.model';

@Component({
  selector: 'app-status-card',
  imports: [SHARED_IMPORTS, STATUS_CARD_IMPORTS],
  templateUrl: './status-card.html',
  styleUrl: './status-card.scss',
})
export class StatusCardComponent {
  /** DI */
  private router = inject(Router);

  /** input */
  stats = input<StatusItem[]>([]);

  constructor() { }

  ngOnInit(): void { }

  goToPage(item: StatusItem): void {
    if(item) {
        this.router.navigate([item.path], { 
        queryParams: item.queryParams,
        queryParamsHandling: 'merge'
      });
    }
  }

}
