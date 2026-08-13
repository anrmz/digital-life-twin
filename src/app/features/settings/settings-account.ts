import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucidePencil, LucideSave, LucideUser } from '@lucide/angular';
import { Button } from '../../shared/ui/button/button';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { Field } from '../../shared/ui/field/field';
import { Toast, type ToastTone } from '../../shared/ui/toast/toast';
import { InputDirective, SelectDirective } from '../../shared/directives/field-control/field-control';
import { SettingsService, type ProfileSettings } from './services/settings.service';

const ACCOUNT_TIMEZONES = ['Europe/Paris', 'Africa/Casablanca', 'UTC'];
const ACCOUNT_LANGUAGES = ['Français', 'English', 'العربية'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-settings-account',
  imports: [
    FormsModule,
    Button,
    Avatar,
    Field,
    Toast,
    InputDirective,
    SelectDirective,
    LucidePencil,
    LucideSave,
    LucideUser,
  ],
  template: `
    <div class="space-y-5">
      <header>
        <h2 class="font-display text-xl font-semibold tracking-tight text-primary">Compte</h2>
        <p class="mt-1 text-sm leading-relaxed text-ink-muted">
          Gérez vos informations personnelles et votre profil.
        </p>
      </header>

      <!-- Carte identité -->
      <section
        class="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div class="flex items-center gap-4">
          <app-avatar [name]="fullName" size="xl" [ring]="true" />
          <div class="min-w-0">
            <p class="font-display text-lg font-semibold tracking-tight text-primary">
              {{ fullName }}
            </p>
            <p class="text-xs font-medium text-accent-dark">Utilisatrice</p>
            <p class="mt-1 truncate text-sm text-ink-muted">{{ profile().email }}</p>
          </div>
        </div>
        <button appButton variant="outline" size="md" (click)="focusForm()">
          <svg lucidePencil class="h-4 w-4" aria-hidden="true"></svg>
          Modifier le profil
        </button>
      </section>

      <!-- Formulaire -->
      <section class="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <div class="mb-5 flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-panel bg-primary/10 text-primary">
            <svg lucideUser class="h-5 w-5" aria-hidden="true"></svg>
          </span>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Identité
            </p>
            <h3 class="font-display text-base font-semibold tracking-tight text-primary">
              Informations personnelles
            </h3>
          </div>
        </div>

        <form #profileForm (ngSubmit)="save()" novalidate>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <app-field id="st-first" label="Prénom" [error]="firstNameError()">
              <input
                id="st-first"
                #firstNameInput
                appInput
                type="text"
                autocomplete="given-name"
                placeholder="Prénom"
                [appInputInvalid]="!!firstNameError()"
                [ngModel]="draft().firstName"
                name="firstName"
                (ngModelChange)="patchDraft({ firstName: $event })"
              />
            </app-field>

            <app-field id="st-last" label="Nom" [error]="lastNameError()">
              <input
                id="st-last"
                appInput
                type="text"
                autocomplete="family-name"
                placeholder="Nom"
                [appInputInvalid]="!!lastNameError()"
                [ngModel]="draft().lastName"
                name="lastName"
                (ngModelChange)="patchDraft({ lastName: $event })"
              />
            </app-field>
          </div>

          <div class="mt-4">
            <app-field id="st-email" label="Email" [error]="emailError()">
              <input
                id="st-email"
                appInput
                type="email"
                autocomplete="email"
                placeholder="prenom.nom@exemple.com"
                [appInputInvalid]="!!emailError()"
                [ngModel]="draft().email"
                name="email"
                (ngModelChange)="patchDraft({ email: $event })"
              />
            </app-field>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <app-field id="st-tz" label="Fuseau horaire">
              <select
                id="st-tz"
                appSelect
                [ngModel]="draft().timezone"
                name="timezone"
                (ngModelChange)="patchDraft({ timezone: $event })"
              >
                @for (tz of timezones; track tz) {
                  <option [value]="tz">{{ tz }}</option>
                }
              </select>
            </app-field>

            <app-field id="st-lang" label="Langue">
              <select
                id="st-lang"
                appSelect
                [ngModel]="draft().language"
                name="language"
                (ngModelChange)="patchDraft({ language: $event })"
              >
                @for (language of languages; track language) {
                  <option [value]="language">{{ language }}</option>
                }
              </select>
            </app-field>
          </div>

          <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              appButton
              variant="ghost"
              size="md"
              type="button"
              (click)="resetDraft()"
            >
              Annuler
            </button>
            <button appButton variant="primary" size="md" type="submit">
              <svg lucideSave class="h-4 w-4" aria-hidden="true"></svg>
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </section>
    </div>

    @if (toast(); as message) {
      <app-toast [message]="message" [tone]="toastTone()" (closed)="toast.set(null)" />
    }
  `,
})
export class SettingsAccount {
  private readonly service = inject(SettingsService);
  private readonly form = viewChild<ElementRef<HTMLElement>>('profileForm');
  private readonly firstNameInput = viewChild<ElementRef<HTMLInputElement>>('firstNameInput');

  protected readonly timezones = ACCOUNT_TIMEZONES;
  protected readonly languages = ACCOUNT_LANGUAGES;

  protected readonly profile = computed(() => this.service.state().profile);
  protected readonly draft = signal<ProfileSettings>(this.service.state().profile);
  protected readonly submitted = signal(false);
  protected readonly toast = signal<string | null>(null);
  protected readonly toastTone = signal<ToastTone>('primary');

  protected get fullName(): string {
    return `${this.profile().firstName} ${this.profile().lastName}`;
  }

  protected firstNameError(): string | null {
    if (!this.submitted()) {
      return null;
    }
    return this.draft().firstName.trim() ? null : 'Le prénom est obligatoire.';
  }

  protected lastNameError(): string | null {
    if (!this.submitted()) {
      return null;
    }
    return this.draft().lastName.trim() ? null : 'Le nom est obligatoire.';
  }

  protected emailError(): string | null {
    if (!this.submitted()) {
      return null;
    }
    const email = this.draft().email.trim();
    if (!email) {
      return "L'adresse email est obligatoire.";
    }
    return EMAIL_PATTERN.test(email) ? null : 'Adresse email invalide.';
  }

  protected patchDraft(patch: Partial<ProfileSettings>): void {
    this.draft.update((current) => ({ ...current, ...patch }));
  }

  protected save(): void {
    this.submitted.set(true);
    if (this.firstNameError() || this.lastNameError() || this.emailError()) {
      return;
    }
    this.service.saveProfile(this.draft());
    this.submitted.set(false);
    this.toastTone.set('success');
    this.toast.set('Modifications enregistrées avec succès.');
  }

  protected resetDraft(): void {
    this.submitted.set(false);
    this.draft.set({ ...this.service.state().profile });
  }

  protected focusForm(): void {
    this.form()?.nativeElement.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    this.firstNameInput()?.nativeElement.focus();
  }
}
