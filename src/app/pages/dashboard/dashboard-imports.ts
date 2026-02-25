import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StatusCardComponent } from '@shared/components/status-card/status-card';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { DiffTimeDisplayComponent } from '@shared/components/diff-time-display/diff-time-display';

const PIPES = [
  DurationPipe,
]

const MODUES = [
  CardModule,
  TagModule,
  AvatarModule,
  AvatarGroupModule,
  SelectButtonModule, 
];

const COMPONENTS = [
  StatusCardComponent,
  DiffTimeDisplayComponent,
];

export const DASHBOARD_IMPORTS = [
  ...PIPES,
  ...MODUES,
  ...COMPONENTS,
];