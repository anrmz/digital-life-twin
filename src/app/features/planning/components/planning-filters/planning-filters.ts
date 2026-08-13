import { Component, computed, inject } from '@angular/core';
import { type PlanningFilter } from '../../models/planning.models';
import { PlanningService } from '../../services/planning.service';

const FILTERS: { value: PlanningFilter; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: 'tasks', label: 'Tâches' },
  { value: 'events', label: 'Événements' },
  { value: 'sport', label: 'Sport' },
  { value: 'personal', label: 'Personnel' },
  { value: 'work', label: 'Travail' },
  { value: 'free', label: 'Temps libre' },
];

@Component({
  selector: 'app-planning-filters',
  template: `
    <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer le planning">
      @for (filter of FILTERS; track filter.value) {
        <button
          type="button"
          class="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200"
          [class.border-primary]="active() === filter.value"
          [class.bg-primary]="active() === filter.value"
          [class.text-white]="active() === filter.value"
          [class.shadow-sm]="active() === filter.value"
          [class.border-line]="active() !== filter.value"
          [class.bg-surface]="active() !== filter.value"
          [class.text-ink-muted]="active() !== filter.value"
          [class.hover:border-navy-300]="active() !== filter.value"
          [class.hover:text-primary]="active() !== filter.value"
          [attr.aria-pressed]="active() === filter.value"
          (click)="service.setFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      }
    </div>
  `,
})
export class PlanningFilters {
  protected readonly service = inject(PlanningService);
  protected readonly active = computed(() => this.service.filter());
  protected readonly FILTERS = FILTERS;
}
