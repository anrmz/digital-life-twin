import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideSparkles } from '@lucide/angular';
import { LanguageService } from '../../../../core/services/language.service';
import { BrandLogo } from '../../../../shared/components/brand-logo/brand-logo';

@Component({
  selector: 'app-auth-shell',
  template: `
    <div class="flex min-h-dvh bg-background">
      <aside class="relative hidden w-1/2 overflow-hidden bg-primary-darker text-white lg:block">
        <div class="absolute inset-0 bg-grid-light opacity-50" aria-hidden="true"></div>
        <div
          class="animate-glow-pulse pointer-events-none absolute -left-40 top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-[120px]"
          aria-hidden="true"
        ></div>
        <div
          class="animate-glow-pulse pointer-events-none absolute -bottom-40 -right-32 h-[26rem] w-[26rem] rounded-full bg-primary-light/40 blur-[120px]"
          style="animation-delay: -3s"
          aria-hidden="true"
        ></div>

        <div class="relative flex h-full flex-col justify-between px-12 py-10 xl:px-16">
          <app-brand-logo tone="light" size="lg" />

          <div class="max-w-md">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-teal-200">
              <svg lucideSparkles class="h-3.5 w-3.5 text-accent-lighter" aria-hidden="true"></svg>
              Digital Life Twin
            </span>
            <h2 class="mt-6 font-display text-h1 tracking-tight text-white">{{ title() }}</h2>
            <p class="mt-3 text-body-lg leading-relaxed text-white/65">{{ subtitle() }}</p>
            <ul class="mt-8 space-y-3.5">
              @for (point of points(); track point) {
                <li class="flex items-start gap-3">
                  <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-lighter">
                    <svg lucideCheck class="h-3.5 w-3.5" stroke-width="3" aria-hidden="true"></svg>
                  </span>
                  <span class="text-sm leading-relaxed text-white/75">{{ point }}</span>
                </li>
              }
            </ul>
          </div>

          @if (quote()) {
            <blockquote class="border-l-2 border-accent/50 pl-5">
              <p class="text-sm leading-relaxed text-white/75 italic">{{ quote() }}</p>
            </blockquote>
          }
        </div>
      </aside>

      <div class="flex flex-1 flex-col">
        <div class="flex items-center justify-between px-5 py-5 sm:px-8 lg:justify-end">
          <span class="lg:hidden"><app-brand-logo tone="dark" /></span>
          <a routerLink="/" class="rounded-panel px-2 py-1 text-sm font-medium text-ink-muted transition-colors hover:text-primary">
            <span aria-hidden="true" class="mirror-rtl inline-block">←</span> {{ backHome() }}
          </a>
        </div>
        <main class="flex flex-1 items-center justify-center px-4 pb-16 pt-4 sm:px-8">
          <div class="w-full max-w-md">
            <ng-content />
          </div>
        </main>
      </div>
    </div>
  `,
  imports: [RouterLink, BrandLogo, LucideCheck, LucideSparkles],
})
export class AuthShell {
  private readonly languageService = inject(LanguageService);

  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly points = input<string[]>([]);
  readonly quote = input<string>('');

  protected readonly backHome = this.languageService.translateSignal('auth.shell.backHome');
}
