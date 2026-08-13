import { Component, inject, signal } from '@angular/core';
import { LucideAlertTriangle, LucideRotateCcw } from '@lucide/angular';
import { Button } from '../../shared/ui/button/button';
import { Modal } from '../../shared/ui/modal/modal';
import { Toast, type ToastTone } from '../../shared/ui/toast/toast';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-settings-danger-zone',
  imports: [Button, Modal, Toast, LucideAlertTriangle, LucideRotateCcw],
  template: `
    <section
      class="rounded-card border border-danger/25 bg-danger-light/30 p-5 shadow-card sm:p-6"
    >
      <div class="flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-panel bg-danger/10 text-danger">
          <svg lucideAlertTriangle class="h-5 w-5" aria-hidden="true"></svg>
        </span>
        <div>
          <h2 class="font-display text-base font-semibold tracking-tight text-primary">
            Zone sensible
          </h2>
          <p class="text-xs text-ink-muted">
            Actions irréversibles sur vos préférences locales.
          </p>
        </div>
      </div>

      <div
        class="mt-4 flex flex-col gap-4 rounded-panel border border-danger/20 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm leading-relaxed text-ink">
          Réinitialisez l'ensemble de vos préférences : thème, notifications,
          confidentialité et accessibilité.
        </p>
        <button
          appButton
          variant="danger"
          size="md"
          class="shrink-0"
          (click)="confirmOpen.set(true)"
        >
          <svg lucideRotateCcw class="h-4 w-4" aria-hidden="true"></svg>
          Réinitialiser toutes les préférences
        </button>
      </div>
    </section>

    @if (confirmOpen()) {
      <app-modal
        title="Réinitialiser toutes les préférences"
        subtitle="Zone sensible"
        (closed)="confirmOpen.set(false)"
      >
        <div class="flex items-start gap-3 rounded-panel border border-danger/20 bg-danger-light/40 p-4">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-panel bg-danger/10 text-danger">
            <svg lucideAlertTriangle class="h-5 w-5" aria-hidden="true"></svg>
          </span>
          <p class="text-sm leading-relaxed text-ink">
            Cette action réinitialisera vos préférences locales. Votre compte et
            vos données de démonstration ne seront pas supprimés.
          </p>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button
            appButton
            variant="ghost"
            size="md"
            type="button"
            (click)="confirmOpen.set(false)"
          >
            Annuler
          </button>
          <button
            appButton
            variant="danger"
            size="md"
            type="button"
            (click)="confirmReset()"
          >
            Réinitialiser
          </button>
        </div>
      </app-modal>
    }

    @if (toast(); as message) {
      <app-toast [message]="message" [tone]="toastTone()" (closed)="toast.set(null)" />
    }
  `,
})
export class SettingsDangerZone {
  private readonly service = inject(SettingsService);

  protected readonly confirmOpen = signal(false);
  protected readonly toast = signal<string | null>(null);
  protected readonly toastTone = signal<ToastTone>('primary');

  protected confirmReset(): void {
    this.confirmOpen.set(false);
    this.service.resetPreferences();
    this.toastTone.set('success');
    this.toast.set('Toutes les préférences ont été réinitialisées.');
  }
}
