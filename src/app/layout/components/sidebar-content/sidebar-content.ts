import { Component, computed, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACCOUNT_ITEMS, NAV_SECTIONS } from '../../../core/models/navigation';
import { SidebarNavItem } from '../sidebar-nav-item/sidebar-nav-item';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-sidebar-content',
  template: `
    <div class="flex h-full flex-col">
      <a
        routerLink="/dashboard"
        class="flex shrink-0 items-center gap-3 px-5 py-5 focus-visible:rounded-panel"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-panel bg-white/10 ring-1 ring-white/10"
        >
          <img src="brand/logo.png" alt="Logo Digital Life Twin" class="h-7 w-7 object-contain" />
        </span>
        <span class="flex flex-col">
          <span
            class="font-display text-[15px] font-semibold leading-tight tracking-tight text-white"
          >
            Digital Life Twin
          </span>
          <span class="text-[11px] font-medium uppercase tracking-[0.18em] text-teal-300">
            {{ subtitle() }}
          </span>
        </span>
      </a>

      <div class="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        @for (section of sections(); track $index) {
          <div class="mb-6">
            <p
              class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-300"
            >
              {{ section.label }}
            </p>
            <ul class="space-y-1">
              @for (item of section.items; track item.path) {
                <li>
                  <app-sidebar-nav-item [item]="item" (navigate)="onNavigate()" />
                </li>
              }
            </ul>
          </div>
        }
      </div>

      <div class="shrink-0 border-t border-white/5 px-3 py-3">
        <p
          class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-300"
        >
          {{ accountLabel() }}
        </p>
        <ul class="space-y-1">
          @for (item of accountItems; track item.path) {
            <li>
              <app-sidebar-nav-item [item]="item" (navigate)="onNavigate()" />
            </li>
          }
        </ul>
        <p class="mt-4 px-3 text-[11px] font-medium tracking-wide text-navy-300">
          Digital Life Twin · {{ version() }}
        </p>
      </div>
    </div>
  `,
  imports: [RouterLink, SidebarNavItem],
})
export class SidebarContent {
  readonly navigate = output<void>();

  private readonly languageService = inject(LanguageService);

  protected readonly subtitle = computed(() =>
    this.languageService.translate<string>('sidebar.subtitle'),
  );

  protected readonly accountLabel = computed(() =>
    this.languageService.translate<string>('sidebar.account.title'),
  );

  protected readonly version = computed(() =>
    this.languageService.translate<string>('footer.version'),
  );

  protected readonly sections = computed(() =>
    NAV_SECTIONS.map((section) => ({
      label: this.languageService.translate<string>(section.labelKey),
      items: section.items,
    })),
  );

  protected readonly accountItems = ACCOUNT_ITEMS;

  protected onNavigate(): void {
    this.navigate.emit();
  }
}
