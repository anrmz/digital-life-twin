import { Component, computed, inject } from '@angular/core';
import { LucideBellRing } from '@lucide/angular';
import {
  SettingsService,
  type SummaryFrequency,
} from './services/settings.service';
import { SettingsToggle } from './settings-toggle';
import { SettingsOption } from './settings-option';

interface NotificationRow {
  key: 'taskReminders' | 'eventReminders' | 'wellnessReminders' | 'aiInsights' | 'dailySummary';
  label: string;
  description: string;
}

const NOTIFICATION_ROWS: NotificationRow[] = [
  {
    key: 'taskReminders',
    label: 'Rappels de tâches',
    description: 'Recevoir un rappel avant une échéance.',
  },
  {
    key: 'eventReminders',
    label: 'Événements du calendrier',
    description: 'Être informé avant un événement.',
  },
  {
    key: 'wellnessReminders',
    label: 'Rappels bien-être',
    description: 'Recevoir des rappels concernant mes objectifs quotidiens.',
  },
  {
    key: 'aiInsights',
    label: 'Insights IA',
    description: "Recevoir les recommandations générées par l'assistant.",
  },
  {
    key: 'dailySummary',
    label: 'Résumé quotidien',
    description: 'Recevoir un résumé de ma journée.',
  },
];

const FREQUENCIES: { value: SummaryFrequency; label: string; description: string }[] = [
  { value: 'never', label: 'Jamais', description: 'Aucun résumé' },
  { value: 'morning', label: 'Chaque matin', description: 'Vers 8h' },
  { value: 'evening', label: 'Chaque soir', description: 'Vers 19h' },
];

@Component({
  selector: 'app-settings-notifications',
  imports: [SettingsToggle, SettingsOption, LucideBellRing],
  template: `
    <div class="space-y-5">
      <header>
        <h2 class="font-display text-xl font-semibold tracking-tight text-primary">
          Notifications
        </h2>
        <p class="mt-1 text-sm leading-relaxed text-ink-muted">
          Choisissez les notifications que vous souhaitez recevoir.
        </p>
      </header>

      <section class="rounded-card border border-line bg-surface shadow-card">
        <header class="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
          <span class="flex h-9 w-9 items-center justify-center rounded-panel bg-teal-50 text-accent-dark">
            <svg lucideBellRing class="h-5 w-5" aria-hidden="true"></svg>
          </span>
          <div>
            <h3 class="font-display text-base font-semibold tracking-tight text-primary">
              Notifications et rappels
            </h3>
            <p class="text-xs text-ink-muted">Activez ou désactivez chaque canal.</p>
          </div>
        </header>

        <div class="divide-y divide-line px-5 sm:px-6">
          @for (row of rows; track row.key) {
            <div class="py-4">
              <app-settings-toggle
                [id]="'st-notif-' + row.key"
                [label]="row.label"
                [description]="row.description"
                [checked]="notifications()[row.key]"
                (checkedChange)="service.toggleNotification(row.key)"
              />
            </div>
          }
        </div>

        <div class="border-t border-line px-5 py-5 sm:px-6">
          <p class="text-sm font-medium text-ink">Fréquence du résumé</p>
          <p class="mt-0.5 text-xs text-ink-muted">Quand souhaitez-vous recevoir votre résumé ?</p>
          <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            @for (frequency of frequencies; track frequency.value) {
              <app-settings-option
                group="st-summary"
                [value]="frequency.value"
                [label]="frequency.label"
                [description]="frequency.description"
                [selected]="notifications().summaryFrequency === frequency.value"
                (selectedChange)="onFrequencyChange($event)"
              />
            }
          </div>
        </div>
      </section>
    </div>
  `,
})
export class SettingsNotifications {
  protected readonly service = inject(SettingsService);
  protected readonly rows = NOTIFICATION_ROWS;
  protected readonly frequencies = FREQUENCIES;

  protected readonly notifications = computed(() => this.service.state().notifications);

  protected onFrequencyChange(value: string): void {
    this.service.setSummaryFrequency(value as SummaryFrequency);
  }
}
