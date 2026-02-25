import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuModule } from 'primeng/menu';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { ProductQuickEditComponent } from '../product-quick-edit/product-quick-edit';

const MOULES = [
  TagModule,
  MenuModule,
  TableModule,
  RatingModule,
  TooltipModule,
  InputTextModule,
  DatePickerModule,
  MultiSelectModule,
];

const COMPONENTS = [
  ProductQuickEditComponent,
];

export const SHOP_LIST_IMPORTS = [
  ...MOULES,
  ...COMPONENTS,
];