import { Component, computed, inject } from '@angular/core';
import { LucideMousePointerClick, LucideType } from '@lucide/angular';
import {
  SettingsService,
  type TextSize,
} from './services/settings.service';
import { SettingsToggle } from './settings-toggle';
import { SettingsOption } from './settings-option';

const TEXT_SIZES: { value: TextSize; label: string; description: string }[] = [
  { value: 'normal', label: 'Normal', description: 'Taille standard' },
  { value: 'large', label: 'Grande', description: 'Confort de lecture' },
  { value: 'xlarge', label: 'Très grande', description: 'Lecture facilitée' },
];

@Component({
  selector: 'app-settings-accessibility',
  imports: [
    SettingsToggle,
    SettingsOption,
  ],
  template: `
    <div class="space-y-5">
      <header>
        <h2 class="font-display text-xl font-semibold tracking-tight text-primary">
          Accessibilité
        </h2>
        <p class="mt-1 text-sm leading-relaxed text-ink-muted">
          Adaptez l'expérience à vos besoins.
        </p>
      </header>

      <section class="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <div class="space-y-0 divide-y divide-line">
          <div class="py-4">
            <app-settings-toggle
              id="st-a11y-motion"
              label="Réduire les animations"
              description="Désactive les transitions et les animations pour un confort accru."
              [checked]="a11y().reduceMotion"
              (checkedChange)="service.toggleAccessibility('reduceMotion')"
            />
          </div>
          <div class="py-4">
            <app-settings-toggle
              id="st-a11y-contrast"
              label="Contraste renforcé"
              description="Renforce les contours et la visibilité des séparations."
              [checked]="a11y().highContrast"
              (checkedChange)="service.toggleAccessibility('highContrast')"
            />
          </div>
          <div class="py-4">
            <app-settings-toggle
              id="st-a11y-focus"
              label="Focus clavier"
              description="Affiche un repère visuel renforcé lors de la navigation au clavier."
              [checked]="a11y().focusKeyboard"
              (checkedChange)="service.toggleAccessibility('focusKeyboard')"
            />
          </div>
        </div>

        <div class="mt-5 border-t border-line pt-6">
          <h3 class="font-display text-base font-semibold tracking-tight text-primary">
            Taille du texte
          </h3>
          <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            @for (option of textSizes; track option.value) {
              <app-settings-option
                group="st-text-size"
                [value]="option.value"
                [label]="option.label"
                [description]="option.description"
                [selected]="a11y().textSize === option.value"
                (selectedChange)="onTextSizeChange($event)"
              />
            }
          </div>
        </div>

        <div class="mt-6 rounded-panel border border-accent/25 bg-teal-50/40 p-4">
          <p class="flex items-center gap-2 text-xs font-medium text-accent-dark">
            <svg lucideMousePointerClick class="h-4 w-4" aria-hidden="true"></svg>
            Ces réglages s'appliquent immédiatement à toute l'application.
          </p>
        </div>
      </section>
    </div>
  `,
})
export class SettingsAccessibility {
  protected readonly service = inject(SettingsService);
  protected readonly a11y = computed(() => this.service.state().accessibility);
  protected readonly textSizes = TEXT_SIZES;

  protected onTextSizeChange(value: string): void {
    this.service.setTextSize(value as TextSize);
  }
}
