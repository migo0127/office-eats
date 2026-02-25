import { Component, computed, inject, input } from '@angular/core';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { DiffTimeService } from '@shared/services/diff-time.service';

@Component({
  selector: 'app-diff-time-display',
  imports: [DurationPipe],
  templateUrl: './diff-time-display.html',
  styleUrl: './diff-time-display.scss',
})
export class DiffTimeDisplayComponent {

  /** 結束時間 */
  endTime = input.required<string | Date | number>();
  
  private diffTimeService = inject(DiffTimeService);

  /** 每秒隨 Service 的 now() 自動更新 */
  timeLeft = computed<number>(() => this.diffTimeService.getDiff(this.endTime()));

  constructor() { }

  ngOnInit(): void { }
  
}
