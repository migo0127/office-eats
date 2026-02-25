import { TableModule } from 'primeng/table';

import { StatusCardComponent } from "@shared/components/status-card/status-card";
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

const MOULES = [
  TagModule,
  MenuModule,
  TableModule,
  SelectModule,
  TooltipModule,
  DatePickerModule,
  InputTextModule,
];

const COMPONENTS = [
  StatusCardComponent,
];

export const MY_ORDERS_IMPORTS = [
  ...MOULES,
  ...COMPONENTS,
];