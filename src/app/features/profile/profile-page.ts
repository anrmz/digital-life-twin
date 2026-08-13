import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideActivity,
  LucideBellRing,
  LucideCalendarDays,
  LucideClock,
  LucideDroplets,
  LucideGlobe,
  LucideMail,
  LucideMapPin,
  LucideMoon,
  LucidePencil,
  LucideSave,
  LucideSmile,
  LucideSparkles,
  LucideTarget,
  LucideTimer,
  LucideUser,
} from '@lucide/angular';
import gsap from 'gsap';
import { Button } from '../../shared/ui/button/button';
import { Badge } from '../../shared/ui/badge/badge';
import { Avatar } from '../../shared/ui/avatar/avatar';
import { Modal } from '../../shared/ui/modal/modal';
import { Toast, type ToastTone } from '../../shared/ui/toast/toast';
import { ProfileService, type ProfileState } from './services/profile.service';
import { ACTIONS, ERROR_TEXT, FIELD, GRID_2, INPUT, LABEL, TEXTAREA } from '../../shared/ui/form-styles/form-styles';

const LANGUAGES = ['Français', 'English', 'العربية'];
const TIMEZONES = [
  'Europe/Paris (UTC+1)',
  'Europe/London (UTC+0)',
  'America/New_York (UTC-5)',
  'Asia/Tokyo (UTC+9)',
  'Africa/Casablanca (UTC+1)',
];

@Component({
  selector: 'app-profile-page',
  imports: [
    FormsModule,
    Button,
    Badge,
    Avatar,
    Modal,
    Toast,
    LucideActivity,
    LucideBellRing,
    LucideCalendarDays,
    LucideClock,
    LucideDroplets,
    LucideGlobe,
    LucideMail,
    LucideMapPin,
    LucideMoon,
    LucidePencil,
    LucideSave,
    LucideSmile,
    LucideSparkles,
    LucideTarget,
    LucideTimer,
    LucideUser,
  ],
  template: `
    <div class="space-y-6">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Compte
          </p>
          <h1 class="mt-0.5 font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Profil
          </h1>
          <p class="mt-1 text-sm text-ink-muted">
            Vos informations personnelles, vos objectifs et vos préférences.
          </p>
        </div>
        <button appButton variant="accent" size="md" (click)="editOpen.set(true)">
          <svg lucidePencil class="h-4 w-4" aria-hidden="true"></svg>
          Modifier le profil
        </button>
      </header>

      <div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <!-- Carte identité -->
        <section data-reveal class="rounded-card bg-gradient-to-br from-primary-darker via-primary to-primary-light p-6 text-white shadow-card xl:col-span-4">
          <div class="flex flex-col items-center text-center">
            <app-avatar [name]="fullName" size="xl" [ring]="true" />
            <h2 class="mt-4 font-display text-xl font-semibold tracking-tight text-white">{{ fullName }}</h2>
            <p class="mt-0.5 text-sm text-white/70">{{ state().email }}</p>
            <div class="mt-3 flex items-center gap-2">
              <app-badge variant="accent">Membre Digital Life Twin</app-badge>
            </div>
          </div>

          <div class="mt-6 space-y-2 border-t border-white/10 pt-5">
            <p class="flex items-center gap-2.5 text-sm text-white/80">
              <svg lucideGlobe class="h-4 w-4 text-teal-200" aria-hidden="true"></svg>
              {{ state().language }}
            </p>
            <p class="flex items-center gap-2.5 text-sm text-white/80">
              <svg lucideClock class="h-4 w-4 text-teal-200" aria-hidden="true"></svg>
              {{ state().timezone }}
            </p>
            <p class="flex items-center gap-2.5 text-sm text-white/80">
              <svg lucideMapPin class="h-4 w-4 text-teal-200" aria-hidden="true"></svg>
              Casablanca, Maroc
            </p>
          </div>
        </section>

        <div class="flex flex-col gap-5 xl:col-span-8">
          <!-- Résumé d'activité -->
          <section data-reveal class="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <span class="flex h-9 w-9 items-center justify-center rounded-panel bg-teal-50 text-accent-dark">
                  <svg lucideActivity class="h-5 w-5" aria-hidden="true"></svg>
                </span>
                <div>
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                    Activité
                  </p>
                  <h2 class="font-display text-base font-semibold tracking-tight text-primary">
                    Résumé du compte
                  </h2>
                </div>
              </div>
              <app-badge variant="success" [dot]="true">Actif</app-badge>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div class="rounded-panel border border-line bg-surface-muted/50 p-4">
                <svg lucideTarget class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
                <p class="mt-2 font-display text-2xl font-bold tabular-nums text-primary">156</p>
                <p class="text-[11px] text-ink-muted">tâches terminées</p>
              </div>
              <div class="rounded-panel border border-line bg-surface-muted/50 p-4">
                <svg lucideCalendarDays class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
                <p class="mt-2 font-display text-2xl font-bold tabular-nums text-primary">48</p>
                <p class="text-[11px] text-ink-muted">événements créés</p>
              </div>
              <div class="rounded-panel border border-line bg-surface-muted/50 p-4">
                <svg lucideTimer class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
                <p class="mt-2 font-display text-2xl font-bold tabular-nums text-primary">12</p>
                <p class="text-[11px] text-ink-muted">séances de sport</p>
              </div>
              <div class="rounded-panel border border-line bg-surface-muted/50 p-4">
                <svg lucideSmile class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
                <p class="mt-2 font-display text-2xl font-bold tabular-nums text-primary">82</p>
                <p class="text-[11px] text-ink-muted">équilibre /100</p>
              </div>
            </div>
          </section>

          <!-- Informations -->
          <section data-reveal class="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
            <div class="flex items-center gap-2.5">
              <span class="flex h-9 w-9 items-center justify-center rounded-panel bg-primary/10 text-primary">
                <svg lucideUser class="h-5 w-5" aria-hidden="true"></svg>
              </span>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Identité
                </p>
                <h2 class="font-display text-base font-semibold tracking-tight text-primary">
                  Informations personnelles
                </h2>
              </div>
            </div>
            <dl class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-xs text-ink-faint">Nom complet</dt>
                <dd class="mt-0.5 text-sm font-semibold text-primary">{{ fullName }}</dd>
              </div>
              <div>
                <dt class="flex items-center gap-1.5 text-xs text-ink-faint">
                  <svg lucideMail class="h-3.5 w-3.5" aria-hidden="true"></svg>
                  Email
                </dt>
                <dd class="mt-0.5 text-sm font-semibold text-primary">{{ state().email }}</dd>
              </div>
              <div>
                <dt class="text-xs text-ink-faint">Fuseau horaire</dt>
                <dd class="mt-0.5 text-sm font-semibold text-primary">{{ state().timezone }}</dd>
              </div>
              <div>
                <dt class="text-xs text-ink-faint">Langue</dt>
                <dd class="mt-0.5 text-sm font-semibold text-primary">{{ state().language }}</dd>
              </div>
            </dl>
            <div class="mt-5 rounded-panel border border-line bg-surface-muted/50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">À propos</p>
              <p class="mt-1.5 text-sm leading-relaxed text-ink">{{ state().bio }}</p>
            </div>
          </section>

          <!-- Préférences bien-être -->
          <section data-reveal class="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
            <div class="flex items-center gap-2.5">
              <span class="flex h-9 w-9 items-center justify-center rounded-panel bg-teal-50 text-accent-dark">
                <svg lucideSparkles class="h-5 w-5" aria-hidden="true"></svg>
              </span>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Objectifs
                </p>
                <h2 class="font-display text-base font-semibold tracking-tight text-primary">
                  Préférences de bien-être
                </h2>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="rounded-panel border border-line bg-surface p-4">
                <div class="flex items-center gap-2 text-accent-dark">
                  <svg lucideMoon class="h-4 w-4" aria-hidden="true"></svg>
                  <span class="text-xs font-medium">Sommeil</span>
                </div>
                <p class="mt-2 font-display text-2xl font-bold tabular-nums text-primary">
                  {{ wellness().sleepTarget }} h
                </p>
                <p class="text-[11px] text-ink-muted">objectif par nuit</p>
              </div>
              <div class="rounded-panel border border-line bg-surface p-4">
                <div class="flex items-center gap-2 text-accent-dark">
                  <svg lucideDroplets class="h-4 w-4" aria-hidden="true"></svg>
                  <span class="text-xs font-medium">Hydratation</span>
                </div>
                <p class="mt-2 font-display text-2xl font-bold tabular-nums text-primary">
                  {{ wellness().waterTarget }} L
                </p>
                <p class="text-[11px] text-ink-muted">objectif par jour</p>
              </div>
              <div class="rounded-panel border border-line bg-surface p-4">
                <div class="flex items-center gap-2 text-accent-dark">
                  <svg lucideTimer class="h-4 w-4" aria-hidden="true"></svg>
                  <span class="text-xs font-medium">Activité</span>
                </div>
                <p class="mt-2 font-display text-2xl font-bold tabular-nums text-primary">
                  {{ wellness().activeMinutesTarget }} min
                </p>
                <p class="text-[11px] text-ink-muted">minutes actives / jour</p>
              </div>
            </div>

            <div class="mt-5 space-y-3 border-t border-line pt-4">
              <div class="flex items-center justify-between gap-3">
                <span class="flex items-center gap-2 text-sm text-ink">
                  <svg lucideBellRing class="h-4 w-4 text-ink-muted" aria-hidden="true"></svg>
                  Rappels de bien-être
                </span>
                <span class="flex items-center gap-2 text-xs text-ink-muted">
                  {{ prefs().wellnessReminders ? 'Activés' : 'Désactivés' }}
                  <span class="h-2 w-2 rounded-full" [class.bg-accent]="prefs().wellnessReminders" [class.bg-surface-strong]="!prefs().wellnessReminders"></span>
                </span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="flex items-center gap-2 text-sm text-ink">
                  <svg lucideClock class="h-4 w-4 text-ink-muted" aria-hidden="true"></svg>
                  Heures calmes
                </span>
                <span class="text-xs tabular-nums text-ink-muted">
                  {{ prefs().quietHoursEnabled ? prefs().quietStart + ' — ' + prefs().quietEnd : 'Désactivées' }}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    @if (editOpen()) {
      <app-modal
        title="Modifier le profil"
        subtitle="Mettez à jour vos informations personnelles."
        (closed)="editOpen.set(false)"
      >
        <form (ngSubmit)="saveProfile()" novalidate>
          <div [class]="GRID_2">
            <div [class]="FIELD">
              <label [class]="LABEL" for="pf-first">Prénom</label>
              <input
                id="pf-first"
                [class]="INPUT"
                type="text"
                [ngModel]="draft().firstName"
                name="firstName"
                (ngModelChange)="patchDraft({ firstName: $event })"
              />
            </div>
            <div [class]="FIELD">
              <label [class]="LABEL" for="pf-last">Nom</label>
              <input
                id="pf-last"
                [class]="INPUT"
                type="text"
                [ngModel]="draft().lastName"
                name="lastName"
                (ngModelChange)="patchDraft({ lastName: $event })"
              />
            </div>
          </div>

          <div [class]="FIELD + ' mt-3'">
            <label [class]="LABEL" for="pf-email">Email</label>
            <input
              id="pf-email"
              [class]="INPUT"
              type="email"
              [ngModel]="draft().email"
              name="email"
              (ngModelChange)="patchDraft({ email: $event })"
            />
          </div>

          <div [class]="GRID_2 + ' mt-3'">
            <div [class]="FIELD">
              <label [class]="LABEL" for="pf-tz">Fuseau horaire</label>
              <select
                id="pf-tz"
                [class]="INPUT"
                [ngModel]="draft().timezone"
                name="timezone"
                (ngModelChange)="patchDraft({ timezone: $event })"
              >
                @for (tz of TIMEZONES; track tz) {
                  <option [value]="tz">{{ tz }}</option>
                }
              </select>
            </div>
            <div [class]="FIELD">
              <label [class]="LABEL" for="pf-lang">Langue</label>
              <select
                id="pf-lang"
                [class]="INPUT"
                [ngModel]="draft().language"
                name="language"
                (ngModelChange)="patchDraft({ language: $event })"
              >
                @for (language of LANGUAGES; track language) {
                  <option [value]="language">{{ language }}</option>
                }
              </select>
            </div>
          </div>

          <div [class]="FIELD + ' mt-3'">
            <label [class]="LABEL" for="pf-bio">À propos</label>
            <textarea
              id="pf-bio"
              [class]="TEXTAREA"
              rows="3"
              [ngModel]="draft().bio"
              name="bio"
              (ngModelChange)="patchDraft({ bio: $event })"
            ></textarea>
          </div>

          @if (submitted() && !draft().firstName.trim()) {
            <p [class]="ERROR_TEXT + ' mt-3'">Le prénom est obligatoire.</p>
          }

          <div [class]="ACTIONS">
            <button appButton variant="ghost" size="md" type="button" (click)="editOpen.set(false)">
              Annuler
            </button>
            <button appButton variant="primary" size="md" type="submit">
              <svg lucideSave class="h-4 w-4" aria-hidden="true"></svg>
              Enregistrer
            </button>
          </div>
        </form>
      </app-modal>
    }

    @if (toast(); as message) {
      <app-toast [message]="message" [tone]="toastTone()" (closed)="toast.set(null)" />
    }
  `,
})
export class ProfilePage implements AfterViewInit {
  private readonly service = inject(ProfileService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly state = this.service.state;
  protected readonly prefs = this.service.prefs;
  protected readonly wellness = this.service.wellness;
  protected readonly TIMEZONES = TIMEZONES;
  protected readonly LANGUAGES = LANGUAGES;
  protected readonly FIELD = FIELD;
  protected readonly LABEL = LABEL;
  protected readonly INPUT = INPUT;
  protected readonly TEXTAREA = TEXTAREA;
  protected readonly GRID_2 = GRID_2;
  protected readonly ACTIONS = ACTIONS;
  protected readonly ERROR_TEXT = ERROR_TEXT;

  protected readonly editOpen = signal(false);
  protected readonly draft = signal<ProfileState>(this.service.state());
  protected readonly submitted = signal(false);
  protected readonly toast = signal<string | null>(null);
  protected readonly toastTone = signal<ToastTone>('primary');

  protected get fullName(): string {
    return `${this.service.state().firstName} ${this.service.state().lastName}`;
  }

  protected patchDraft(patch: Partial<ProfileState>): void {
    this.draft.update((current) => ({ ...current, ...patch }));
  }

  protected saveProfile(): void {
    this.submitted.set(true);
    if (!this.draft().firstName.trim() || !this.draft().lastName.trim()) {
      return;
    }
    this.service.saveProfile(this.draft());
    this.editOpen.set(false);
    this.toastTone.set('success');
    this.toast.set('Profil mis à jour avec succès.');
  }

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const root = this.host.nativeElement;
    gsap.fromTo(
      root.querySelectorAll<HTMLElement>('[data-reveal]'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', clearProps: 'transform' },
    );
  }
}
