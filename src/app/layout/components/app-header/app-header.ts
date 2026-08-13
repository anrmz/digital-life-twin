import { Component, computed, inject, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LucideBell,
  LucideCheck,
  LucideChevronDown,
  LucideGlobe,
  LucideLogOut,
  LucideMenu,
  LucideSearch,
  LucideSettings,
  LucideUser,
} from '@lucide/angular';
import { Avatar } from '../../../shared/ui/avatar/avatar';
import { Button } from '../../../shared/ui/button/button';
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from '../../../shared/ui/dropdown/dropdown';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    Button,
    Avatar,
    Dropdown,
    DropdownMenu,
    DropdownTrigger,
    DropdownItem,
    LucideBell,
    LucideCheck,
    LucideChevronDown,
    LucideGlobe,
    LucideLogOut,
    LucideMenu,
    LucideSearch,
    LucideSettings,
    LucideUser,
  ],
  template: `
    <header
      class="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur-md"
    >
      <div
        class="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8"
      >
        <button
          appButton
          variant="secondary"
          size="icon"
          class="lg:hidden"
          (click)="menu.emit()"
          [attr.aria-label]="openMenuLabel()"
        >
          <svg lucideMenu class="h-5 w-5" aria-hidden="true"></svg>
        </button>

        <label class="relative hidden flex-1 md:block md:max-w-xs">
          <svg
            lucideSearch
            class="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          ></svg>
          <input
            type="search"
            [placeholder]="searchPlaceholder()"
            [attr.aria-label]="searchPlaceholder()"
            class="h-9 w-full rounded-panel border border-line bg-surface ps-9 pe-12 text-sm text-ink shadow-sm transition-all duration-200 placeholder:text-ink-faint focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <kbd
            class="pointer-events-none absolute end-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-surface-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-ink-faint lg:block"
          >
            ⌘K
          </kbd>
        </label>

        <div class="flex-1 md:hidden"></div>

        <div class="me-1 hidden flex-col items-end lg:flex">
          <span class="text-sm font-semibold capitalize leading-tight text-primary">
            {{ weekday() }}
          </span>
          <span class="text-xs leading-tight text-ink-muted">{{ fullDate() }}</span>
        </div>

        <a
          routerLink="/notifications"
          class="relative flex h-10 w-10 items-center justify-center rounded-panel text-ink-muted transition-colors duration-200 hover:bg-surface-muted hover:text-primary"
          [attr.aria-label]="notificationsLabel()"
        >
          <svg lucideBell class="h-5 w-5" aria-hidden="true"></svg>
          <span
            class="absolute end-2 top-2 flex h-2 w-2 rounded-full bg-accent ring-2 ring-background"
          ></span>
        </a>

        <div class="mx-1 hidden h-6 w-px bg-line sm:block"></div>

        <app-dropdown #langDropdown="dropdown">
          <button
            appDropdownTrigger
            type="button"
            class="relative inline-flex h-10 items-center gap-1.5 rounded-panel border border-line bg-surface px-2.5 text-sm font-medium text-ink shadow-sm transition-colors duration-200 hover:border-accent/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            [attr.aria-label]="languageLabel()"
          >
            <svg lucideGlobe class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
            <span class="text-xs font-bold uppercase tracking-wide text-primary">{{
              languageCode()
            }}</span>
            <svg
              lucideChevronDown
              class="h-3.5 w-3.5 text-ink-faint transition-transform duration-200"
              [class.rotate-180]="langDropdown.open()"
              aria-hidden="true"
            ></svg>
          </button>
          <app-dropdown-menu panelClass="w-60" ariaLabel="Language">
            <p
              class="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint"
            >
              {{ languageLabel() }}
            </p>
            <div class="h-px bg-line" aria-hidden="true"></div>
            @for (lang of languageOptions; track lang.code) {
              <button
                appDropdownItem
                type="button"
                class="mt-1 w-full items-center gap-3 rounded-panel px-3 py-2.5 text-sm transition-colors duration-200"
                [class.text-primary]="isActive(lang.code)"
                [class.text-ink-muted]="!isActive(lang.code)"
                [attr.aria-pressed]="isActive(lang.code)"
                (click)="setLanguage(lang.code)"
              >
                <span class="text-base leading-none" aria-hidden="true">{{ lang.flag }}</span>
                <span class="flex-1 text-start">{{ lang.name }}</span>
                @if (isActive(lang.code)) {
                  <svg lucideCheck class="h-4 w-4 text-accent" aria-hidden="true"></svg>
                }
              </button>
            }
          </app-dropdown-menu>
        </app-dropdown>

        <app-dropdown #profileDropdown="dropdown">
          <button
            appDropdownTrigger
            type="button"
            class="flex h-10 items-center gap-2 rounded-panel border border-line bg-surface pe-2 ps-1 text-ink shadow-sm transition-colors duration-200 hover:border-accent/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            [attr.aria-label]="profileMenuLabel()"
          >
            <app-avatar [name]="userName()" size="sm" [ring]="true" />
            <span class="hidden max-w-28 truncate text-sm font-medium text-primary lg:block">{{
              userName()
            }}</span>
            <svg
              lucideChevronDown
              class="h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform duration-200"
              [class.rotate-180]="profileDropdown.open()"
              aria-hidden="true"
            ></svg>
          </button>
          <app-dropdown-menu panelClass="w-64" [ariaLabel]="profileMenuLabel()">
            @if (user()) {
              <div class="px-3 pb-1.5 pt-2">
                <p class="truncate text-sm font-semibold text-primary">{{ userName() }}</p>
                <p class="truncate text-xs text-ink-muted">{{ user()!.email }}</p>
                <p
                  class="mt-1.5 inline-flex rounded-panel bg-surface-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-dark"
                >
                  {{ roleLabel() }}
                </p>
              </div>
              <div class="h-px bg-line" aria-hidden="true"></div>
            }
            <a routerLink="/profile" appDropdownItem class="mt-1 text-ink-muted">
              <svg lucideUser class="h-4 w-4 shrink-0" aria-hidden="true"></svg>
              <span>{{ profileLabel() }}</span>
            </a>
            <a routerLink="/settings" appDropdownItem class="text-ink-muted">
              <svg lucideSettings class="h-4 w-4 shrink-0" aria-hidden="true"></svg>
              <span>{{ settingsLabel() }}</span>
            </a>
            <div class="my-1 h-px bg-line" aria-hidden="true"></div>
            <button
              type="button"
              class="flex w-full cursor-pointer select-none items-center gap-2.5 rounded-panel px-3 py-2 text-start text-sm font-medium text-danger transition-colors duration-200 hover:bg-danger-light hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
              role="menuitem"
              (click)="onLogout()"
            >
              <svg lucideLogOut class="h-4 w-4 shrink-0" aria-hidden="true"></svg>
              <span>{{ logoutLabel() }}</span>
            </button>
          </app-dropdown-menu>
        </app-dropdown>
      </div>
    </header>
  `,
})
export class Header {
  @Output() menu = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly today = new Date();

  protected readonly languageService = inject(LanguageService);

  protected readonly languageOptions = this.languageService.languageOptions;

  protected readonly languageCode = computed(() =>
    this.languageService.activeLanguage().toUpperCase(),
  );

  protected readonly user = this.authService.currentUser;

  protected readonly userName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  protected readonly roleLabel = computed(() =>
    this.languageService.translate<string>(
      this.user()?.role === 'admin' ? 'header.roleAdmin' : 'header.roleUser',
    ),
  );

  protected readonly searchPlaceholder = this.languageService.translateSignal('header.search');
  protected readonly notificationsLabel = this.languageService.translateSignal('header.notifications');
  protected readonly languageLabel = this.languageService.translateSignal('header.language');
  protected readonly openMenuLabel = this.languageService.translateSignal('header.openMenu');
  protected readonly profileMenuLabel = this.languageService.translateSignal('header.profileMenu');
  protected readonly profileLabel = this.languageService.translateSignal('header.profile');
  protected readonly settingsLabel = this.languageService.translateSignal('header.settings');
  protected readonly logoutLabel = this.languageService.translateSignal('header.logout');

  protected isActive(lang: 'fr' | 'en' | 'ar'): boolean {
    return this.languageService.activeLanguage() === lang;
  }

  protected readonly locale = computed(() =>
    this.languageService.activeLanguage() === 'fr'
      ? 'fr-FR'
      : this.languageService.activeLanguage() === 'en'
        ? 'en-US'
        : 'ar-EG',
  );

  protected readonly weekday = computed(() =>
    this.today.toLocaleDateString(this.locale(), { weekday: 'long' }),
  );

  protected readonly fullDate = computed(() =>
    new Intl.DateTimeFormat(this.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(this.today),
  );

  protected setLanguage(lang: 'fr' | 'en' | 'ar'): void {
    this.languageService.setLanguage(lang);
  }

  protected onLogout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
