import { TagModule } from 'primeng/tag';

import { OrderSummaryComponent } from "../order-summary/order-summary";
import { StroeListComponent } from "../store-list/store-list";
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { DiffTimeDisplayComponent } from '@shared/components/diff-time-display/diff-time-display';

const PIPES = [
  DurationPipe,
]

const MODULES = [
  TagModule,
];

const COMPONENTS = [
  StroeListComponent,
  OrderSummaryComponent,
  DiffTimeDisplayComponent,
];


export const ORDER_MAIN_IMPORTS = [
  ...PIPES,
  ...MODULES,
  ...COMPONENTS,
];
