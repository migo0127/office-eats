import { TableModule } from 'primeng/table';

import { StatusCardComponent } from "@shared/components/status-card/status-card";
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';

const MOULES = [
  MenuModule,
  TagModule,
  TableModule,
  SelectModule,
  DatePickerModule,
  InputTextModule,
];

const COMPONENTS = [
  StatusCardComponent,
];

export const GROUP_CENTER_IMPORTS = [
  ...MOULES,
  ...COMPONENTS,
];

