import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideArrowRight,
  LucideCheck,
  LucideChevronDown,
  LucideGlobe,
  LucideMenu,
  LucideX,
} from '@lucide/angular';
import { BrandLogo } from '../../../../shared/components/brand-logo/brand-logo';
import { Button } from '../../../../shared/ui/button/button';
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from '../../../../shared/ui/dropdown/dropdown';
import { LanguageService } from '../../../../core/services/language.service';

interface PublicLink {
  labelKey: string;
  path: string;
}

const LINKS: PublicLink[] = [
  { labelKey: 'public.nav.home', path: '/' },
  { labelKey: 'public.nav.features', path: '/features' },
  { labelKey: 'public.nav.about', path: '/about' },
  { labelKey: 'public.nav.contact', path: '/contact' },
];

@Component({
  selector: 'app-public-nav',
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 border-b transition-all duration-300"
      [class.border-white/10]="scrolled()"
      [class.bg-primary-darker/85]="scrolled()"
      [class.shadow-soft]="scrolled()"
      [class.border-transparent]="!scrolled()"
      [class.bg-transparent]="!scrolled()"
    >
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <app-brand-logo tone="light" />

        <nav class="hidden items-center gap-1 md:flex" [attr.aria-label]="primaryNavLabel()">
          @for (link of links(); track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="bg-white/10 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="rounded-panel px-3.5 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              {{ link.label }}
            </a>
          }
        </nav>

        <div class="hidden items-center gap-2.5 md:flex">
          <app-dropdown #publicLangDropdown="dropdown">
            <button
              appDropdownTrigger
              type="button"
              class="relative inline-flex h-10 items-center gap-1.5 rounded-panel border border-white/15 bg-white/5 px-2.5 text-sm font-medium text-white/80 backdrop-blur transition-colors duration-200 hover:bg-white/10 hover:text-white"
              [attr.aria-label]="languageLabel()"
            >
              <svg lucideGlobe class="h-4 w-4 text-teal-300" aria-hidden="true"></svg>
              <span class="text-xs font-bold uppercase tracking-wide">{{ languageCode() }}</span>
              <svg
                lucideChevronDown
                class="h-3.5 w-3.5 text-white/50 transition-transform duration-200"
                [class.rotate-180]="publicLangDropdown.open()"
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

          <a
            routerLink="/login"
            class="rounded-panel px-3.5 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
          >
            {{ loginLabel() }}
          </a>
          <a routerLink="/register" class="group inline-flex h-10 items-center gap-2 rounded-panel bg-accent-dark px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-darker active:scale-[0.98]">
            {{ registerLabel() }}
            <svg lucideArrowRight class="mirror-rtl h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true"></svg>
          </a>
        </div>

        <button
          class="flex h-10 w-10 items-center justify-center rounded-panel text-white transition-colors duration-200 hover:bg-white/10 md:hidden"
          (click)="menuOpen.set(!menuOpen())"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="menuOpen() ? closeMenuLabel() : openMenuLabel()"
        >
          @if (menuOpen()) {
            <svg lucideX class="h-5 w-5" aria-hidden="true"></svg>
          } @else {
            <svg lucideMenu class="h-5 w-5" aria-hidden="true"></svg>
          }
        </button>
      </div>

      @if (menuOpen()) {
        <nav
          class="border-t border-white/10 bg-primary-darker px-4 pb-5 pt-3 md:hidden"
          [attr.aria-label]="mobileNavLabel()"
        >
          <div class="flex flex-col gap-1">
            @for (link of links(); track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="bg-white/10 text-white"
                [routerLinkActiveOptions]="{ exact: true }"
                class="rounded-panel px-3.5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                (click)="menuOpen.set(false)"
              >
                {{ link.label }}
              </a>
            }
          </div>
          <div class="mt-4">
            <p class="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              {{ languageLabel() }}
            </p>
            <div class="grid grid-cols-3 gap-1 rounded-panel border border-white/10 bg-white/5 p-1">
              @for (lang of languageOptions; track lang.code) {
                <button
                  type="button"
                  class="flex items-center justify-center gap-1.5 rounded-panel px-2 py-2 text-xs font-semibold transition-colors duration-200"
                  [class.bg-accent]="isActive(lang.code)"
                  [class.text-white]="isActive(lang.code)"
                  [class.text-white/80]="!isActive(lang.code)"
                  [attr.aria-pressed]="isActive(lang.code)"
                  (click)="selectLanguage(lang.code)"
                >
                  <span class="text-sm leading-none" aria-hidden="true">{{ lang.flag }}</span>
                  <span class="uppercase tracking-wide">{{ lang.code }}</span>
                </button>
              }
            </div>
          </div>
          <div class="mt-4 flex flex-col gap-2.5">
            <button appButton variant="outline" class="w-full border-white/25 text-white hover:bg-white/10 hover:text-white" routerLink="/login">
              {{ loginLabel() }}
            </button>
            <button appButton variant="accent" class="w-full" routerLink="/register">
              {{ registerLabel() }}
            </button>
          </div>
        </nav>
      }
    </header>
  `,
  imports: [
    RouterLink,
    RouterLinkActive,
    BrandLogo,
    Button,
    Dropdown,
    DropdownMenu,
    DropdownTrigger,
    DropdownItem,
    LucideMenu,
    LucideX,
    LucideArrowRight,
    LucideCheck,
    LucideChevronDown,
    LucideGlobe,
  ],
})
export class PublicNav {
  private readonly languageService = inject(LanguageService);

  protected readonly links = computed(() =>
    LINKS.map((link) => ({
      path: link.path,
      label: this.languageService.translate<string>(link.labelKey),
    })),
  );

  protected readonly loginLabel = this.languageService.translateSignal('public.nav.login');
  protected readonly registerLabel = this.languageService.translateSignal('public.nav.register');
  protected readonly openMenuLabel = this.languageService.translateSignal('public.nav.openMenu');
  protected readonly closeMenuLabel = this.languageService.translateSignal('public.nav.closeMenu');
  protected readonly primaryNavLabel = this.languageService.translateSignal('public.nav.primary');
  protected readonly mobileNavLabel = this.languageService.translateSignal('public.nav.mobile');
  protected readonly languageLabel = this.languageService.translateSignal('header.language');
  protected readonly languageOptions = this.languageService.languageOptions;

  protected readonly languageCode = computed(() =>
    this.languageService.activeLanguage().toUpperCase(),
  );

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  protected isActive(lang: 'fr' | 'en' | 'ar'): boolean {
    return this.languageService.activeLanguage() === lang;
  }

  protected setLanguage(lang: 'fr' | 'en' | 'ar'): void {
    this.languageService.setLanguage(lang);
  }

  protected selectLanguage(lang: 'fr' | 'en' | 'ar'): void {
    this.languageService.setLanguage(lang);
    this.menuOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}
