import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideCheck, LucideEye, LucideEyeOff, LucideInfo, LucideLock, LucideMail, LucideUser } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { Button } from '../../../shared/ui/button/button';
import { Checkbox } from '../../../shared/ui/checkbox/checkbox';
import { Field } from '../../../shared/ui/field/field';
import { InputDirective } from '../../../shared/directives/field-control/field-control';
import { AuthShell } from '../components/auth-shell/auth-shell';

type FormStatus = 'idle' | 'loading' | 'success';

@Component({
  selector: 'app-register',
  template: `
    <app-auth-shell
      [title]="shellTitle()"
      [subtitle]="shellSubtitle()"
      [points]="registerPoints()"
      [quote]="quote()"
    >
      @if (status() !== 'success') {
        <div>
          <h1 class="font-display text-h1 tracking-tight text-primary">{{ title() }}</h1>
          <p class="mt-2 text-body-lg leading-relaxed text-ink-muted">
            {{ subtitle() }}
          </p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-8 space-y-5" novalidate>
            <div class="grid gap-5 sm:grid-cols-2">
              <app-field [label]="firstNameLabel()" [id]="'register-first'" [error]="errorFor('firstName')">
                <div class="relative">
                  <svg
                    lucideUser
                    class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                    aria-hidden="true"
                  ></svg>
                  <input
                    appInput
                    id="register-first"
                    type="text"
                    formControlName="firstName"
                    [placeholder]="firstNamePlaceholder()"
                    autocomplete="given-name"
                    class="pl-10"
                    [appInputInvalid]="form.controls.firstName.touched && form.controls.firstName.invalid"
                  />
                </div>
              </app-field>
              <app-field [label]="lastNameLabel()" [id]="'register-last'" [error]="errorFor('lastName')">
                <input
                  appInput
                  id="register-last"
                  type="text"
                  formControlName="lastName"
                  [placeholder]="lastNamePlaceholder()"
                  autocomplete="family-name"
                  [appInputInvalid]="form.controls.lastName.touched && form.controls.lastName.invalid"
                />
              </app-field>
            </div>

            <app-field [label]="emailLabel()" [id]="'register-email'" [error]="errorFor('email')">
              <div class="relative">
                <svg
                  lucideMail
                  class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                  aria-hidden="true"
                ></svg>
                <input
                  appInput
                  id="register-email"
                  type="email"
                  formControlName="email"
                  [placeholder]="emailPlaceholder()"
                  autocomplete="email"
                  class="pl-10"
                  [appInputInvalid]="form.controls.email.touched && form.controls.email.invalid"
                />
              </div>
            </app-field>

            <div class="grid gap-5 sm:grid-cols-2">
              <app-field
                [label]="passwordLabel()"
                [id]="'register-password'"
                [hint]="passwordHint()"
                [error]="errorFor('password')"
              >
                <div class="relative">
                  <svg
                    lucideLock
                    class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
                    aria-hidden="true"
                  ></svg>
                  <input
                    appInput
                    id="register-password"
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="••••••••"
                    autocomplete="new-password"
                    class="pl-10 pr-11"
                    [appInputInvalid]="form.controls.password.touched && form.controls.password.invalid"
                  />
                  <button
                    type="button"
                    class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-panel text-ink-faint transition-colors hover:bg-surface-muted hover:text-primary"
                    (click)="showPassword.set(!showPassword())"
                    [attr.aria-label]="showPassword() ? hidePassword() : showPasswordLabel()"
                  >
                    @if (showPassword()) {
                      <svg lucideEyeOff class="h-4 w-4" aria-hidden="true"></svg>
                    } @else {
                      <svg lucideEye class="h-4 w-4" aria-hidden="true"></svg>
                    }
                  </button>
                </div>
              </app-field>
              <app-field [label]="confirmLabel()" [id]="'register-confirm'" [error]="confirmError()">
                <input
                  appInput
                  id="register-confirm"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  [appInputInvalid]="confirmInvalid()"
                />
              </app-field>
            </div>

            <div>
              <div class="flex flex-col gap-2">
                <app-checkbox [(checked)]="termsAccepted" [ariaLabel]="termsAria()">
                  <span>
                    {{ termsPrefix() }} <span class="font-medium text-accent-dark">{{ termsLink() }}</span>
                    {{ termsAnd() }} <span class="font-medium text-accent-dark">{{ privacyLink() }}</span>.
                  </span>
                </app-checkbox>
                @if (termsError()) {
                  <p class="flex items-center gap-1.5 text-xs font-medium text-danger">
                    <svg lucideInfo class="h-3.5 w-3.5 shrink-0" aria-hidden="true"></svg>
                    {{ termsErrorMessage() }}
                  </p>
                }
              </div>
            </div>

            <button
              appButton
              variant="accent"
              type="submit"
              class="w-full"
              size="lg"
              [loading]="status() === 'loading'"
              [disabled]="status() === 'loading'"
            >
              {{ submit() }}
            </button>
          </form>

          <p class="mt-7 text-center text-sm text-ink-muted">
            {{ haveAccount() }}
            <a routerLink="/login" class="font-semibold text-accent-dark transition-colors hover:text-accent">
              {{ loginLink() }}
            </a>
          </p>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center gap-5 py-8 text-center">
          <span class="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-accent-dark">
            <svg lucideCheck class="h-8 w-8" stroke-width="2.5" aria-hidden="true"></svg>
          </span>
          <div>
            <h1 class="font-display text-h1 tracking-tight text-primary">{{ successTitle() }}</h1>
            <p class="mx-auto mt-2 max-w-sm text-body-lg leading-relaxed text-ink-muted">
              {{ successText() }}
            </p>
          </div>
          <button appButton variant="primary" size="lg" (click)="goToDashboard()">
            {{ goDashboard() }}
          </button>
        </div>
      }
    </app-auth-shell>
  `,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Button,
    Checkbox,
    Field,
    InputDirective,
    AuthShell,
    LucideCheck,
    LucideEye,
    LucideEyeOff,
    LucideInfo,
    LucideLock,
    LucideMail,
    LucideUser,
  ],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  private readonly tr = <T = string>(key: string): T => this.languageService.translate<T>(key);
  private readonly trSignal = (key: string) => this.languageService.translateSignal(key);

  protected readonly shellTitle = this.trSignal('auth.register.shellTitle');
  protected readonly shellSubtitle = this.trSignal('auth.register.shellSubtitle');
  protected readonly registerPoints = computed(() => this.tr<string[]>('auth.register.points'));
  protected readonly quote = this.trSignal('auth.register.quote');
  protected readonly title = this.trSignal('auth.register.title');
  protected readonly subtitle = this.trSignal('auth.register.subtitle');

  protected readonly firstNameLabel = this.trSignal('auth.register.firstNameLabel');
  protected readonly firstNamePlaceholder = this.trSignal('auth.register.firstNamePlaceholder');
  protected readonly lastNameLabel = this.trSignal('auth.register.lastNameLabel');
  protected readonly lastNamePlaceholder = this.trSignal('auth.register.lastNamePlaceholder');
  protected readonly emailLabel = this.trSignal('auth.register.emailLabel');
  protected readonly emailPlaceholder = this.trSignal('auth.register.emailPlaceholder');
  protected readonly passwordLabel = this.trSignal('auth.register.passwordLabel');
  protected readonly passwordHint = this.trSignal('auth.errors.passwordHint');
  protected readonly showPasswordLabel = this.trSignal('auth.login.showPassword');
  protected readonly hidePassword = this.trSignal('auth.login.hidePassword');
  protected readonly confirmLabel = this.trSignal('auth.register.confirmLabel');

  protected readonly termsAria = this.trSignal('auth.register.termsAria');
  protected readonly termsPrefix = this.trSignal('auth.register.termsPrefix');
  protected readonly termsLink = this.trSignal('auth.register.termsLink');
  protected readonly termsAnd = this.trSignal('auth.register.termsAnd');
  protected readonly privacyLink = this.trSignal('auth.register.privacyLink');
  protected readonly termsErrorMessage = this.trSignal('auth.register.termsError');
  protected readonly submit = this.trSignal('auth.register.submit');
  protected readonly haveAccount = this.trSignal('auth.register.haveAccount');
  protected readonly loginLink = this.trSignal('auth.register.loginLink');

  protected readonly successTitle = this.trSignal('auth.register.successTitle');
  protected readonly goDashboard = this.trSignal('auth.register.goDashboard');

  protected readonly successText = computed(() => {
    const name = this.form.controls.firstName.value || this.tr('auth.register.firstNamePlaceholder');
    return this.languageService.translate('auth.register.successText', { name });
  });

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  protected readonly showPassword = signal(false);
  protected readonly termsAccepted = signal(false);
  protected readonly termsError = signal(false);
  protected readonly status = signal<FormStatus>('idle');

  protected errorFor(control: keyof RegisterComponent['form']['controls']): string | null {
    const field = this.form.controls[control];
    if (!field.touched || !field.invalid) {
      return null;
    }
    if (field.hasError('required')) {
      return this.tr('auth.errors.required');
    }
    if (field.hasError('email')) {
      return this.tr('auth.errors.invalidEmail');
    }
    if (field.hasError('minlength')) {
      return this.tr('auth.errors.tooShort');
    }
    return this.tr('auth.errors.invalid');
  }

  protected confirmInvalid(): boolean {
    const confirm = this.form.controls.confirmPassword;
    const mismatch = confirm.touched && confirm.value !== this.form.controls.password.value;
    return (confirm.touched && confirm.invalid) || mismatch;
  }

  protected confirmError(): string | null {
    const confirm = this.form.controls.confirmPassword;
    if (confirm.touched && confirm.value !== this.form.controls.password.value) {
      return this.tr('auth.errors.passwordMismatch');
    }
    if (confirm.touched && confirm.invalid) {
      return this.tr('auth.errors.required');
    }
    return null;
  }

  protected onSubmit(): void {
    const confirm = this.form.controls.confirmPassword;
    const mismatch = confirm.value !== this.form.controls.password.value;

    if (this.form.invalid || mismatch) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.termsAccepted()) {
      this.termsError.set(true);
      return;
    }
    this.termsError.set(false);
    this.status.set('loading');

    const { firstName, lastName, email, password } = this.form.getRawValue();
    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: (user) => {
        this.authService.setCurrentUser(user);
        this.status.set('success');
      },
      error: () => {
        this.status.set('idle');
      },
    });
  }

  protected goToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }
}
