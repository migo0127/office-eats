import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastComponent } from './components/toast/toast';

const ANGULAR_MOUDLES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ButtonModule,
  FloatLabelModule,
  DragDropModule,
];

const COMPONENTS = [
  ToastComponent,
];

export const SHARED_IMPORTS = [
  ...ANGULAR_MOUDLES,
  ...COMPONENTS,
] as const;

export { ToastComponent };