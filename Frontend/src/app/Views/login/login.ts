import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.formBuilder.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  isRegistering = false;
  isLoading = false;
  errorMessage = '';

  async submit(): Promise<void> {
    this.errorMessage = '';

    if (this.form.invalid || (this.isRegistering && !this.form.controls.name.value.trim())) {
      this.form.markAllAsTouched();
      if (this.isRegistering && !this.form.controls.name.value.trim()) {
        this.errorMessage = 'Escribe tu nombre para crear la cuenta.';
      }
      return;
    }

    this.isLoading = true;
    const { name, email, password } = this.form.getRawValue();

    try {
      if (this.isRegistering) {
        await this.auth.register(name, email, password);
      } else {
        await this.auth.login(email, password);
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const destination =
        returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/ejercicios';
      await this.router.navigateByUrl(destination);
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : 'No se pudo completar el inicio de sesión.';
    } finally {
      this.isLoading = false;
    }
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.form.controls.name.reset('');
  }
}
