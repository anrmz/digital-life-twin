import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-brand-logo',
  template: `
    <a
      routerLink="/"
      class="inline-flex items-center gap-3 rounded-panel focus-visible:ring-2 focus-visible:ring-accent/50"
      [attr.aria-label]="ariaLabel()"
    >
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-panel ring-1 ring-white/15"
        [class.bg-white/10]="tone() === 'light'"
        [class.bg-primary/10]="tone() === 'dark'"
      >
        <img src="brand/logo.png" alt="" class="h-7 w-7 object-contain" />
      </span>
      <span class="flex flex-col">
        <span
          class="font-display text-[15px] font-semibold leading-tight tracking-tight"
          [class.text-white]="tone() === 'light'"
          [class.text-primary]="tone() === 'dark'"
        >
          Digital Life Twin
        </span>
        <span
          class="text-[11px] font-medium uppercase tracking-[0.18em]"
          [class.text-teal-300/80]="tone() === 'light'"
          [class.text-accent-dark]="tone() === 'dark'"
        >
          {{ subtitle() }}
        </span>
      </span>
    </a>
  `,
  imports: [RouterLink],
})
export class BrandLogo {
  readonly tone = input<'light' | 'dark'>('dark');

  private readonly languageService = inject(LanguageService);

  protected readonly subtitle = this.languageService.translateSignal('sidebar.subtitle');

  protected readonly ariaLabel = computed(() =>
    `Digital Life Twin — ${this.languageService.translate<string>('public.nav.home')}`,
  );
}
