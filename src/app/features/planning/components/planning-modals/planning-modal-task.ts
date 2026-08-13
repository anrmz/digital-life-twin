import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';
import {
  todayISO,
  toMinutes,
  type PlanningCategory,
  type PlanningEntry,
  type PlanningPriority,
  type TaskStatus,
} from '../../models/planning.models';
import { ACTIONS, ERROR_TEXT, FIELD, GRID_2, INPUT, LABEL, TEXTAREA } from './form-styles';

@Component({
  selector: 'app-planning-modal-task',
  imports: [Modal, Button, FormsModule],
  template: `
    <app-modal
      [title]="(entry() ? 'Modifier la tâche' : 'Nouvelle tâche')"
      subtitle="Précisez les horaires, la catégorie et la priorité de votre tâche."
      (closed)="closed.emit()"
    >
      <form (ngSubmit)="save()" novalidate>
        <div [class]="FIELD">
          <label [class]="LABEL" for="task-title">Titre</label>
          <input
            id="task-title"
            [class]="INPUT"
            type="text"
            placeholder="Réviser le chapitre 5"
            autocomplete="off"
            [ngModel]="title()"
            name="title"
            (ngModelChange)="title.set($event)"
          />
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="task-desc">Description</label>
          <textarea
            id="task-desc"
            [class]="TEXTAREA"
            rows="3"
            placeholder="Quelques précisions, objectifs ou ressources…"
            [ngModel]="description()"
            name="description"
            (ngModelChange)="description.set($event)"
          ></textarea>
        </div>

        <div [class]="GRID_2 + ' mt-3'">
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-date">Date</label>
            <input
              id="task-date"
              [class]="INPUT"
              type="date"
              [ngModel]="date()"
              name="date"
              (ngModelChange)="date.set($event)"
            />
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-cat">Catégorie</label>
            <select
              id="task-cat"
              [class]="INPUT"
              [ngModel]="category()"
              name="category"
              (ngModelChange)="category.set($event)"
            >
              <option value="work">Travail</option>
              <option value="personal">Personnel</option>
              <option value="sport">Sport</option>
              <option value="meals">Repas</option>
            </select>
          </div>
        </div>

        <div [class]="GRID_2 + ' mt-3'">
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-start">Début</label>
            <input
              id="task-start"
              [class]="INPUT"
              type="time"
              [ngModel]="start()"
              name="start"
              (ngModelChange)="start.set($event)"
            />
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-end">Fin</label>
            <input
              id="task-end"
              [class]="INPUT"
              type="time"
              [ngModel]="end()"
              name="end"
              (ngModelChange)="end.set($event)"
            />
          </div>
        </div>

        <div [class]="GRID_2 + ' mt-3'">
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-priority">Priorité</label>
            <select
              id="task-priority"
              [class]="INPUT"
              [ngModel]="priority()"
              name="priority"
              (ngModelChange)="priority.set($event)"
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-status">Statut</label>
            <select
              id="task-status"
              [class]="INPUT"
              [ngModel]="status()"
              name="status"
              (ngModelChange)="status.set($event)"
            >
              <option value="todo">À faire</option>
              <option value="in-progress">En cours</option>
              <option value="done">Terminée</option>
            </select>
          </div>
        </div>

        @if (submitted() && !title().trim()) {
          <p [class]="ERROR_TEXT + ' mt-3'">Le titre est obligatoire.</p>
        }

        <div [class]="ACTIONS">
          <button appButton variant="ghost" size="md" type="button" (click)="closed.emit()">Annuler</button>
          <button appButton variant="primary" size="md" type="submit">Enregistrer</button>
        </div>
      </form>
    </app-modal>
  `,
})
export class PlanningModalTask {
  readonly entry = input<PlanningEntry | null>(null);
  readonly saved = output<PlanningEntry>();
  readonly closed = output<void>();

  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly date = signal(todayISO());
  protected readonly start = signal('09:00');
  protected readonly end = signal('10:00');
  protected readonly category = signal<PlanningCategory>('work');
  protected readonly priority = signal<PlanningPriority>('medium');
  protected readonly status = signal<TaskStatus>('todo');
  protected readonly submitted = signal(false);

  protected readonly FIELD = FIELD;
  protected readonly LABEL = LABEL;
  protected readonly INPUT = INPUT;
  protected readonly TEXTAREA = TEXTAREA;
  protected readonly GRID_2 = GRID_2;
  protected readonly ACTIONS = ACTIONS;
  protected readonly ERROR_TEXT = ERROR_TEXT;

  constructor() {
    effect(() => {
      const entry = this.entry();
      if (!entry) {
        return;
      }
      this.title.set(entry.title);
      this.description.set(entry.description ?? '');
      this.date.set(entry.date);
      this.start.set(entry.start);
      this.end.set(entry.end);
      this.category.set(entry.category);
      this.priority.set(entry.priority ?? 'medium');
      this.status.set(entry.status ?? 'todo');
    });
  }

  protected save(): void {
    this.submitted.set(true);
    if (!this.title().trim()) {
      return;
    }
    const existing = this.entry();
    this.saved.emit({
      id: existing?.id ?? crypto.randomUUID(),
      type: 'task',
      title: this.title().trim(),
      description: this.description().trim() || undefined,
      category: this.category(),
      date: this.date(),
      start: this.start(),
      end: this.end(),
      duration: Math.max(5, toMinutes(this.end()) - toMinutes(this.start())),
      status: this.status(),
      priority: this.priority(),
      tone: 'primary',
    });
  }
}
