import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SanitizePipe } from '@shared/pipes/sanitize.pipe';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ButtonModule,
  RippleModule,
  ToastModule,
];

const PIPES = [
  SanitizePipe,
]

export const TOAST_IMPORTS = [
  ...MODULES,
  ...PIPES,
];
