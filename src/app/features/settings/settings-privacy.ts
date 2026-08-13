import { Component, inject, signal } from '@angular/core';
import {
  LucideDownload,
  LucideInfo,
  LucideRotateCcw,
} from '@lucide/angular';
import { Button } from '../../shared/ui/button/button';
import { Modal } from '../../shared/ui/modal/modal';
import { Toast, type ToastTone } from '../../shared/ui/toast/toast';
import { SettingsService } from './services/settings.service';
import { SettingsToggle } from './settings-toggle';

interface PrivacyRow {
  key: 'analytics' | 'personalization' | 'aiContext';
  label: string;
  description: string;
}

const PRIVACY_ROWS: PrivacyRow[] = [
  {
    key: 'analytics',
    label: 'Autoriser les statistiques d’utilisation',
    description: 'Nous aidons à comprendre comment la plateforme est utilisée.',
  },
  {
    key: 'personalization',
    label: 'Autoriser la personnalisation de l’expérience',
    description: 'Adapter les recommandations et la mise en page à vos habitudes.',
  },
  {
    key: 'aiContext',
    label: 'Autoriser l’utilisation des données de contexte pour les suggestions IA',
    description: 'L’assistant peut s’appuyer sur vos données pour suggérer des actions.',
  },
];

@Component({
  selector: 'app-settings-privacy',
  imports: [
    Button,
    Modal,
    Toast,
    SettingsToggle,
    LucideInfo,
    LucideDownload,
    LucideRotateCcw,
  ],
  template: `
    <div class="space-y-5">
      <header>
        <h2 class="font-display text-xl font-semibold tracking-tight text-primary">
          Confidentialité
        </h2>
        <p class="mt-1 text-sm leading-relaxed text-ink-muted">
          Contrôlez vos données et votre confidentialité.
        </p>
      </header>

      <section class="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
        <div class="flex items-start gap-3 rounded-panel border border-line bg-surface-muted/50 p-4">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-panel bg-primary/10 text-primary">
            <svg lucideInfo class="h-5 w-5" aria-hidden="true"></svg>
          </span>
          <div>
            <p class="text-sm font-semibold text-primary">Données personnelles</p>
            <p class="mt-0.5 text-xs leading-relaxed text-ink-muted">
              Vos préférences sont stockées localement dans cette version frontend.
            </p>
          </div>
        </div>

        <div class="mt-5 space-y-0 divide-y divide-line">
          @for (row of rows; track row.key) {
            <div class="py-4">
              <app-settings-toggle
                [id]="'st-privacy-' + row.key"
                [label]="row.label"
                [description]="row.description"
                [checked]="service.state().privacy[row.key]"
                (checkedChange)="service.togglePrivacy(row.key)"
              />
            </div>
          }
        </div>

        <div class="mt-5 flex flex-col gap-2 border-t border-line pt-5 sm:flex-row">
          <button appButton variant="outline" size="md" (click)="exportData()">
            <svg lucideDownload class="h-4 w-4" aria-hidden="true"></svg>
            Exporter mes données
          </button>
          <button appButton variant="ghost" size="md" (click)="resetOpen.set(true)">
            <svg lucideRotateCcw class="h-4 w-4" aria-hidden="true"></svg>
            Réinitialiser mes préférences
          </button>
        </div>
      </section>
    </div>

    @if (resetOpen()) {
      <app-modal
        title="Réinitialiser mes préférences"
        subtitle="Cette action ne supprime pas votre compte ni vos données de démonstration."
        (closed)="resetOpen.set(false)"
      >
        <p class="text-sm leading-relaxed text-ink">
          Vos paramètres de confidentialité seront rétablis par défaut. Voulez-vous continuer ?
        </p>
        <div class="mt-6 flex justify-end gap-2">
          <button appButton variant="ghost" size="md" type="button" (click)="resetOpen.set(false)">
            Annuler
          </button>
          <button appButton variant="primary" size="md" type="button" (click)="confirmReset()">
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
export class SettingsPrivacy {
  protected readonly service = inject(SettingsService);
  protected readonly rows = PRIVACY_ROWS;

  protected readonly resetOpen = signal(false);
  protected readonly toast = signal<string | null>(null);
  protected readonly toastTone = signal<ToastTone>('primary');

  protected exportData(): void {
    const json = this.service.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `digital-life-twin-preferences-${date}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    this.toastTone.set('success');
    this.toast.set('Vos données ont été exportées.');
  }

  protected confirmReset(): void {
    this.resetOpen.set(false);
    this.service.resetPreferences();
    this.toastTone.set('success');
    this.toast.set('Préférences réinitialisées.');
  }
}
