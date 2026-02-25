import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@pages/header/header';
import { MenuComponent } from '@pages/menu/menu';
import { JsonDialogComponent } from '@shared/components/json-dialog/json-dialog';
import { DrawerModule } from 'primeng/drawer';

export const LAYOUT_IMPORTS = [
  RouterOutlet,
  DrawerModule,
  HeaderComponent,
  MenuComponent,
  JsonDialogComponent,
];