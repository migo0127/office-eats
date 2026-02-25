import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { LOGIN_IMPORTS } from './login-imports';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginItem } from '@shared/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [SHARED_IMPORTS, LOGIN_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  /** DI */
  private authService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);

  /** variables */
  loginForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    // 定義表單
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  /** 登入 */
  onLogin() {
    if (this.loginForm.valid) {
      const loginItem: LoginItem = this.loginForm.getRawValue();
      this.authService.login(loginItem);
    } else {
      // 觸發所有欄位驗證顯示
      this.loginForm.markAllAsTouched();
    }
  }

  value: any;
}
