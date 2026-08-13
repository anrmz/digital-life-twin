import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';
import {
  todayISO,
  toMinutes,
  type PlanningCategory,
  type PlanningEntry,
} from '../../models/planning.models';
import { ACTIONS, ERROR_TEXT, FIELD, GRID_2, INPUT, LABEL, TEXTAREA } from './form-styles';

@Component({
  selector: 'app-planning-modal-event',
  imports: [Modal, Button, FormsModule],
  template: `
    <app-modal
      [title]="entry() ? 'Modifier l’événement' : 'Nouvel événement'"
      subtitle="Lieu, participants et horaires de votre rendez-vous."
      (closed)="closed.emit()"
    >
      <form (ngSubmit)="save()" novalidate>
        <div [class]="FIELD">
          <label [class]="LABEL" for="event-title">Titre</label>
          <input
            id="event-title"
            [class]="INPUT"
            type="text"
            placeholder="Cours, réunion, rendez-vous…"
            autocomplete="off"
            [ngModel]="title()"
            name="title"
            (ngModelChange)="title.set($event)"
          />
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="event-desc">Description</label>
          <textarea
            id="event-desc"
            [class]="TEXTAREA"
            rows="3"
            placeholder="Ordre du jour, informations pratiques…"
            [ngModel]="description()"
            name="description"
            (ngModelChange)="description.set($event)"
          ></textarea>
        </div>

        <div [class]="GRID_2 + ' mt-3'">
          <div [class]="FIELD">
            <label [class]="LABEL" for="event-date">Date</label>
            <input
              id="event-date"
              [class]="INPUT"
              type="date"
              [ngModel]="date()"
              name="date"
              (ngModelChange)="date.set($event)"
            />
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="event-cat">Catégorie</label>
            <select
              id="event-cat"
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
            <label [class]="LABEL" for="event-start">Début</label>
            <input
              id="event-start"
              [class]="INPUT"
              type="time"
              [ngModel]="start()"
              name="start"
              (ngModelChange)="start.set($event)"
            />
          </div>
          <div [class]="FIELD">
            <label [class]="LABEL" for="event-end">Fin</label>
            <input
              id="event-end"
              [class]="INPUT"
              type="time"
              [ngModel]="end()"
              name="end"
              (ngModelChange)="end.set($event)"
            />
          </div>
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="event-location">Lieu</label>
          <input
            id="event-location"
            [class]="INPUT"
            type="text"
            placeholder="Amphithéâtre A, Université"
            autocomplete="off"
            [ngModel]="location()"
            name="location"
            (ngModelChange)="location.set($event)"
          />
        </div>

        <div [class]="FIELD + ' mt-3'">
          <label [class]="LABEL" for="event-participants">Participants (séparés par des virgules)</label>
          <input
            id="event-participants"
            [class]="INPUT"
            type="text"
            placeholder="Groupe 3A, Dr. Benali"
            autocomplete="off"
            [ngModel]="participantsText()"
            name="participants"
            (ngModelChange)="participantsText.set($event)"
          />
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
export class PlanningModalEvent {
  readonly entry = input<PlanningEntry | null>(null);
  readonly saved = output<PlanningEntry>();
  readonly closed = output<void>();

  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly date = signal(todayISO());
  protected readonly start = signal('10:00');
  protected readonly end = signal('11:00');
  protected readonly category = signal<PlanningCategory>('work');
  protected readonly location = signal('');
  protected readonly participantsText = signal('');
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
      this.location.set(entry.location ?? '');
      this.participantsText.set((entry.participants ?? []).join(', '));
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
      type: 'event',
      title: this.title().trim(),
      description: this.description().trim() || undefined,
      category: this.category(),
      date: this.date(),
      start: this.start(),
      end: this.end(),
      duration: Math.max(5, toMinutes(this.end()) - toMinutes(this.start())),
      location: this.location().trim() || undefined,
      participants: this.participantsText()
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean),
      tone: 'accent',
    });
  }
}
