import { Component, output } from '@angular/core';
import {
  LucideCalendarClock,
  LucideCalendarPlus,
  LucideClock,
  LucidePlus,
} from '@lucide/angular';
import { Button } from '../../../../shared/ui/button/button';

export type QuickActionKind = 'task' | 'event' | 'block' | 'plan';

@Component({
  selector: 'app-planning-quick-actions',
  imports: [Button, LucidePlus, LucideCalendarPlus, LucideClock, LucideCalendarClock],
  template: `
    <div class="grid grid-cols-2 gap-2">
      <button appButton variant="secondary" size="md" (click)="create.emit('task')">
        <svg lucidePlus class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
        Nouvelle tâche
      </button>
      <button appButton variant="secondary" size="md" (click)="create.emit('event')">
        <svg lucideCalendarPlus class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
        Nouvel événement
      </button>
      <button appButton variant="secondary" size="md" (click)="create.emit('block')">
        <svg lucideClock class="h-4 w-4 text-accent-dark" aria-hidden="true"></svg>
        Bloc horaire
      </button>
      <button appButton variant="primary" size="md" (click)="create.emit('plan')">
        <svg lucideCalendarClock class="h-4 w-4" aria-hidden="true"></svg>
        Planifier ma journée
      </button>
    </div>
  `,
})
export class PlanningQuickActions {
  readonly create = output<QuickActionKind>();
}
