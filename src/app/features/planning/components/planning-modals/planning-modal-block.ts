import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';
import {
  todayISO,
  toMinutes,
  type PlanningCategory,
  type PlanningEntry,
  type PlanningEntryType,
} from '../../models/planning.models';
import { ACTIONS, ERROR_TEXT, FIELD, GRID_2, INPUT, LABEL, TEXTAREA } from './form-styles';

@Component({
  selector: 'app-planning-modal-block',
  imports: [Modal, Button, FormsModule],
  template: `
    <app-modal
      [title]="(entry() ? 'Modifier le bloc' : 'Nouveau bloc horaire')"
      subtitle="Réservé au sport, aux pauses ou aux moments de repos."
      (closed)="closed.emit()"
    >
      <form (ngSubmit)="save()" novalidate>
        <div [class]="GRID_2">
          <div [class]="FIELD">
            <label [class]="LABEL" for="block-type">Type</label>
            <select
              id="block-type"
              [class]="INPUT"
              [ngModel]="type()"
              name="type"
              (ngModelChange)="type.set($event)"
            >
              <option value="sport">Sport</option>
              <option value="break">Pause</option>
              <option value="free">Temps libre</option>
            </select>
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="block-date">Date</label>
            <input
              id="block-date"
              [class]="INPUT"
              type="date"
              [ngModel]="date()"
              name="date"
              (ngModelChange)="date.set($event)"
            />
          </div>
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="block-title">Titre</label>
          <input
            id="block-title"
            [class]="INPUT"
            type="text"
            placeholder="Séance cardio, déjeuner…"
            autocomplete="off"
            [ngModel]="title()"
            name="title"
            (ngModelChange)="title.set($event)"
          />
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="block-desc">Description</label>
          <textarea
            id="block-desc"
            [class]="TEXTAREA"
            rows="2"
            placeholder="Précisions optionnelles…"
            [ngModel]="description()"
            name="description"
            (ngModelChange)="description.set($event)"
          ></textarea>
        </div>

        <div [class]="GRID_2 + ' mt-3'">
          <div [class]="FIELD">
            <label [class]="LABEL" for="block-start">Début</label>
            <input
              id="block-start"
              [class]="INPUT"
              type="time"
              [ngModel]="start()"
              name="start"
              (ngModelChange)="start.set($event)"
            />
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="block-end">Fin</label>
            <input
              id="block-end"
              [class]="INPUT"
              type="time"
              [ngModel]="end()"
              name="end"
              (ngModelChange)="end.set($event)"
            />
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
export class PlanningModalBlock {
  readonly entry = input<PlanningEntry | null>(null);
  readonly saved = output<PlanningEntry>();
  readonly closed = output<void>();

  protected readonly type = signal<PlanningEntryType>('sport');
  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly date = signal(todayISO());
  protected readonly start = signal('18:00');
  protected readonly end = signal('19:00');
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
      this.type.set(entry.type);
      this.title.set(entry.title);
      this.description.set(entry.description ?? '');
      this.date.set(entry.date);
      this.start.set(entry.start);
      this.end.set(entry.end);
    });
  }

  protected save(): void {
    this.submitted.set(true);
    if (!this.title().trim()) {
      return;
    }
    const existing = this.entry();
    const type = this.type();
    const category: PlanningCategory = type === 'sport' ? 'sport' : type === 'break' ? 'meals' : 'free';
    const tone = type === 'sport' ? 'danger' : type === 'break' ? 'warning' : 'primary';
    this.saved.emit({
      id: existing?.id ?? crypto.randomUUID(),
      type,
      title: this.title().trim(),
      description: this.description().trim() || undefined,
      category,
      date: this.date(),
      start: this.start(),
      end: this.end(),
      duration: Math.max(5, toMinutes(this.end()) - toMinutes(this.start())),
      tone,
    });
  }
}
