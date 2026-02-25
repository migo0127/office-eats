import { Component, computed, DOCUMENT, effect, inject, Renderer2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '@shared/shared-imports';
import { LoadingService } from './core/services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from './core/services/auth.service';
import { UserInfo } from '@shared/models/auth.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  /** DI */
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);

  protected readonly title = signal('chase-office-eats');

  readonly userInfo = computed(() => this.authService.userInfo());
  readonly isLoading = computed(() => this.loadingService.isLoading());

  constructor() {

    effect(() => {
      const body: HTMLElement = this.document.body;
      const user: UserInfo = this.userInfo();
      if(user) {
        if (user.isAdmin) {
          this.renderer.addClass(body, 'theme-admin');
          this.renderer.removeClass(body, 'theme-customer');
        } else {
          this.renderer.addClass(body, 'theme-customer');
          this.renderer.removeClass(body, 'theme-admin');
        }
      } else {
        this.renderer.removeClass(body, 'theme-admin');
        this.renderer.removeClass(body, 'theme-customer');
      }
    });
  }

}
