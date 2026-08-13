import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';
import {
  todayISO,
  type Task,
  type TaskCategory,
  type TaskPriority,
  type TaskStatus,
} from '../../models/task.models';
import { ACTIONS, ERROR_TEXT, FIELD, GRID_2, INPUT, LABEL, TEXTAREA } from './form-styles';

const CATEGORY_OPTIONS: { value: TaskCategory; label: string }[] = [
  { value: 'work', label: 'Travail' },
  { value: 'personal', label: 'Personnel' },
  { value: 'sport', label: 'Sport' },
  { value: 'studies', label: 'Études' },
];

@Component({
  selector: 'app-task-form',
  imports: [Modal, Button, FormsModule],
  template: `
    <app-modal
      [title]="task() ? 'Modifier la tâche' : 'Nouvelle tâche'"
      subtitle="Précisez la catégorie, la priorité et l'échéance de votre tâche."
      (closed)="closed.emit()"
    >
      <form (ngSubmit)="save()" novalidate>
        <div [class]="FIELD">
          <label [class]="LABEL" for="task-title">Titre</label>
          <input
            id="task-title"
            [class]="INPUT"
            type="text"
            placeholder="Réviser le chapitre 5 d'algorithmique"
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
        </div>

        <div [class]="GRID_2 + ' mt-3'">
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-category">Catégorie</label>
            <select
              id="task-category"
              [class]="INPUT"
              [ngModel]="category()"
              name="category"
              (ngModelChange)="category.set($event)"
            >
              @for (option of CATEGORY_OPTIONS; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-date">Échéance</label>
            <input
              id="task-date"
              [class]="INPUT"
              type="date"
              [ngModel]="dueDate()"
              name="dueDate"
              (ngModelChange)="dueDate.set($event)"
            />
          </div>
        </div>

        <div [class]="GRID_2 + ' mt-3'">
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-start">Heure de début</label>
            <input
              id="task-start"
              [class]="INPUT"
              type="time"
              [ngModel]="startTime()"
              name="startTime"
              (ngModelChange)="startTime.set($event)"
            />
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="task-duration">Durée (minutes)</label>
            <input
              id="task-duration"
              [class]="INPUT"
              type="number"
              min="5"
              step="5"
              [ngModel]="duration()"
              name="duration"
              (ngModelChange)="duration.set($event)"
            />
          </div>
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="task-progress">Progression (%)</label>
          <input
            id="task-progress"
            [class]="INPUT"
            type="number"
            min="0"
            max="100"
            [ngModel]="progress()"
            name="progress"
            (ngModelChange)="progress.set($event)"
          />
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="task-notes">Notes</label>
          <textarea
            id="task-notes"
            [class]="TEXTAREA"
            rows="2"
            placeholder="Notes, liens, ressources…"
            [ngModel]="notes()"
            name="notes"
            (ngModelChange)="notes.set($event)"
          ></textarea>
        </div>

        @if (submitted() && !title().trim()) {
          <p [class]="ERROR_TEXT + ' mt-3'">Le titre est obligatoire.</p>
        }

        <div [class]="ACTIONS">
          <button appButton variant="ghost" size="md" type="button" (click)="closed.emit()">
            Annuler
          </button>
          <button appButton variant="primary" size="md" type="submit">Enregistrer</button>
        </div>
      </form>
    </app-modal>
  `,
})
export class TaskForm {
  readonly task = input<Task | null>(null);
  readonly saved = output<Task>();
  readonly closed = output<void>();

  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly status = signal<TaskStatus>('todo');
  protected readonly priority = signal<TaskPriority>('medium');
  protected readonly category = signal<TaskCategory>('work');
  protected readonly dueDate = signal(todayISO());
  protected readonly startTime = signal('09:00');
  protected readonly duration = signal(30);
  protected readonly progress = signal(0);
  protected readonly notes = signal('');
  protected readonly submitted = signal(false);

  protected readonly FIELD = FIELD;
  protected readonly LABEL = LABEL;
  protected readonly INPUT = INPUT;
  protected readonly TEXTAREA = TEXTAREA;
  protected readonly GRID_2 = GRID_2;
  protected readonly ACTIONS = ACTIONS;
  protected readonly ERROR_TEXT = ERROR_TEXT;
  protected readonly CATEGORY_OPTIONS = CATEGORY_OPTIONS;

  constructor() {
    effect(() => {
      const existing = this.task();
      if (!existing) {
        return;
      }
      this.title.set(existing.title);
      this.description.set(existing.description);
      this.status.set(existing.status);
      this.priority.set(existing.priority);
      this.category.set(existing.category);
      this.dueDate.set(existing.dueDate);
      this.startTime.set(existing.startTime);
      this.duration.set(existing.duration);
      this.progress.set(existing.progress);
      this.notes.set(existing.notes);
    });
  }

  protected save(): void {
    this.submitted.set(true);
    if (!this.title().trim()) {
      return;
    }
    const existing = this.task();
    this.saved.emit({
      id: existing?.id ?? `t-${Date.now()}`,
      title: this.title().trim(),
      description: this.description().trim(),
      status: this.status(),
      priority: this.priority(),
      category: this.category(),
      dueDate: this.dueDate() || todayISO(),
      startTime: this.startTime(),
      duration: Math.max(5, Number(this.duration()) || 30),
      progress: Math.max(0, Math.min(100, Number(this.progress()) || 0)),
      notes: this.notes(),
      subtasks: existing?.subtasks ?? [],
      activity: existing?.activity ?? [],
      createdAt: existing?.createdAt ?? todayISO(),
    });
  }
}
