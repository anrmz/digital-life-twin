import type { LucideIcon } from '@lucide/angular';
import {
  LucideBriefcase,
  LucideDumbbell,
  LucideGraduationCap,
  LucideHeart,
  LucideHome,
  LucideLaptop,
  LucideShoppingBag,
  LucideUtensils,
} from '@lucide/angular';

export type PlanningFilter =
  | 'all'
  | 'tasks'
  | 'events'
  | 'sport'
  | 'personal'
  | 'work'
  | 'free';

export type PlanningView = 'week' | 'day';

export type PlanningCategory = 'work' | 'personal' | 'sport' | 'free' | 'meals';

export type PlanningEntryType = 'task' | 'event' | 'break' | 'sport' | 'free';

export type PlanningPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type PlanningTone = 'primary' | 'accent' | 'warning' | 'danger';

export interface PlanningTime {
  hour: number;
  minute: number;
}

export interface PlanningEntry {
  id: string;
  type: PlanningEntryType;
  title: string;
  description?: string;
  category: PlanningCategory;
  date: string; // ISO date (yyyy-MM-dd)
  start: string; // HH:mm
  end: string; // HH:mm
  duration: number; // minutes
  status?: TaskStatus;
  priority?: PlanningPriority;
  location?: string;
  participants?: string[];
  recurrence?: 'daily' | 'weekly';
  tone: PlanningTone;
}

export interface DaySummary {
  totalTasks: number;
  doneTasks: number;
  totalEvents: number;
  blocks: number;
  freeMinutes: number;
  loadPercent: number;
  tone: PlanningTone;
  categories: { category: PlanningCategory; minutes: number }[];
}

export interface PlanningData {
  entries: PlanningEntry[];
}

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

const pad2 = (value: number): string => String(value).padStart(2, '0');

export function toMinutes(time: string): number {
  const [hour = 0, minute = 0] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function toTime(minutes: number): PlanningTime {
  return { hour: Math.floor(minutes / 60) % 24, minute: minutes % 60 };
}

export function formatTime(time: string): string {
  return `${pad2(toMinutes(time) / 60 | 0)}h${pad2(toMinutes(time) % 60)}`;
}

export function formatTimeFR(time: PlanningTime): string {
  return `${time.hour}h${pad2(time.minute)}`;
}

export function durationOf(entry: PlanningEntry): number {
  return Math.max(1, Math.round((toMinutes(entry.end) - toMinutes(entry.start)) / 5) * 5);
}

export function minutesToLabel(minutes: number): string {
  if (minutes <= 0) {
    return '0 min';
  }
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

export function entryDurationLabel(entry: PlanningEntry): string {
  return minutesToLabel(entry.duration);
}

export function formatMinutesFR(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) {
    return `${m} min`;
  }
  if (m === 0) {
    return `${h} h`;
  }
  return `${h} h ${m}`;
}

export function nowMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function nowISOTime(): string {
  const now = new Date();
  return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
}

// ---------------------------------------------------------------------------
// Date helpers (all local-time based)
// ---------------------------------------------------------------------------

export function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

export function parseISO(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function nextDateISO(iso: string): string {
  const date = parseISO(iso);
  date.setDate(date.getDate() + 1);
  return toISO(date);
}

export function prevDateISO(iso: string): string {
  const date = parseISO(iso);
  date.setDate(date.getDate() - 1);
  return toISO(date);
}

export function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function weekDates(iso: string): string[] {
  const monday = parseISO(iso);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return toISO(date);
  });
}

export function weekdayLabel(iso: string): string {
  return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][parseISO(iso).getDay()];
}

export function dayNumber(iso: string): string {
  return String(parseISO(iso).getDate());
}

export function formatWeekRange(isos: string[]): string {
  const first = formatDayMonth(isos[0]);
  const last = formatDayMonth(isos[isos.length - 1]);
  return `${first} – ${last}`;
}

export function formatDayMonth(iso: string): string {
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];
  const date = parseISO(iso);
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export function formatLongDate(iso: string): string {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const date = parseISO(iso);
  const cap = days[date.getDay()];
  return `${cap[0].toUpperCase()}${cap.slice(1)} ${formatDayMonth(iso)}`;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export const CATEGORY_KEYS: Record<PlanningCategory, string> = {
  work: 'categories.work',
  personal: 'categories.personal',
  sport: 'categories.sport',
  free: 'categories.free',
  meals: 'categories.meals',
};

export const PRIORITY_KEYS: Record<PlanningPriority, string> = {
  low: 'priorities.low',
  medium: 'priorities.medium',
  high: 'priorities.high',
};

export const STATUS_KEYS: Record<TaskStatus, string> = {
  todo: 'statuses.todo',
  'in-progress': 'statuses.inProgress',
  done: 'statuses.done',
};

export const CATEGORY_ICONS: Record<PlanningCategory, LucideIcon> = {
  work: LucideBriefcase,
  personal: LucideHome,
  sport: LucideDumbbell,
  free: LucideLaptop,
  meals: LucideUtensils,
};

// ---------------------------------------------------------------------------
// Visual mapping
// ---------------------------------------------------------------------------

export interface EntryVisual {
  icon: LucideIcon;
  dot: string;
  chip: string;
  card: string;
  label: string;
}

export const ENTRY_VISUALS: Record<PlanningEntryType, EntryVisual> = {
  task: {
    icon: LucideLaptop,
    dot: 'bg-primary',
    chip: 'bg-primary/10 text-primary',
    card: 'bg-surface border-l-primary',
    label: 'Tâche',
  },
  event: {
    icon: LucideBriefcase,
    dot: 'bg-accent',
    chip: 'bg-accent/10 text-accent-dark',
    card: 'bg-surface border-l-accent',
    label: 'Événement',
  },
  break: {
    icon: LucideHeart,
    dot: 'bg-warning',
    chip: 'bg-warning/15 text-amber-700',
    card: 'bg-surface border-l-warning',
    label: 'Pause',
  },
  sport: {
    icon: LucideDumbbell,
    dot: 'bg-danger',
    chip: 'bg-danger/10 text-danger',
    card: 'bg-surface border-l-danger',
    label: 'Sport',
  },
  free: {
    icon: LucideHome,
    dot: 'bg-navy-300',
    chip: 'bg-surface-muted text-ink-muted',
    card: 'bg-surface-muted/60 border-l-navy-300 border-dashed',
    label: 'Temps libre',
  },
};

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

export const PLANNING_SAMPLE_ENTRIES: PlanningEntry[] = [
  {
    id: 'e-01',
    type: 'task',
    title: 'Révision algorithmique — graphes et Dijkstra',
    description: 'Revoir le chapitre 5, refaire les 3 exercices du TD et les annales de 2023.',
    category: 'work',
    date: '2026-08-12',
    start: '09:00',
    end: '10:30',
    duration: 90,
    status: 'in-progress',
    priority: 'high',
    tone: 'primary',
  },
  {
    id: 'e-02',
    type: 'event',
    title: 'Cours — Bases de données avancées',
    description: 'Amphithéâtre A, semestre de rattrapage. Apportez vos ordinateurs pour les TP.',
    category: 'work',
    date: '2026-08-12',
    start: '10:45',
    end: '12:15',
    duration: 90,
    location: 'Amphithéâtre A, Université',
    participants: ['Groupe 3A', 'Dr. Benali'],
    tone: 'accent',
  },
  {
    id: 'e-03',
    type: 'break',
    title: 'Déjeuner',
    category: 'meals',
    date: '2026-08-12',
    start: '12:30',
    end: '13:30',
    duration: 60,
    tone: 'warning',
  },
  {
    id: 'e-04',
    type: 'sport',
    title: 'Séance cardio + musculation',
    description: '30 min de course légère puis haut du corps.',
    category: 'sport',
    date: '2026-08-12',
    start: '18:00',
    end: '19:00',
    duration: 60,
    location: 'Salle de sport',
    tone: 'danger',
  },
  {
    id: 'e-05',
    type: 'free',
    title: 'Soirée libre',
    category: 'free',
    date: '2026-08-12',
    start: '19:30',
    end: '22:00',
    duration: 150,
    tone: 'primary',
  },
  {
    id: 'e-06',
    type: 'task',
    title: 'Préparer le rapport de stage',
    description: 'Rédiger la partie 3 et relire le rapport complet.',
    category: 'work',
    date: '2026-08-11',
    start: '14:00',
    end: '16:00',
    duration: 120,
    status: 'done',
    priority: 'medium',
    tone: 'primary',
  },
  {
    id: 'e-07',
    type: 'event',
    title: 'Dentiste',
    category: 'personal',
    date: '2026-08-11',
    start: '10:00',
    end: '10:45',
    duration: 45,
    location: 'Cabinet dentaire',
    tone: 'accent',
  },
  {
    id: 'e-08',
    type: 'free',
    title: 'Temps libre',
    category: 'free',
    date: '2026-08-11',
    start: '17:00',
    end: '20:00',
    duration: 180,
    tone: 'primary',
  },
  {
    id: 'e-09',
    type: 'task',
    title: 'Faire les courses',
    category: 'personal',
    date: '2026-08-13',
    start: '17:30',
    end: '18:15',
    duration: 45,
    status: 'todo',
    priority: 'low',
    tone: 'primary',
  },
  {
    id: 'e-10',
    type: 'event',
    title: 'Réunion de projet PFA',
    description: 'Point d\'avancement hebdomadaire avec le tuteur.',
    category: 'work',
    date: '2026-08-13',
    start: '11:00',
    end: '12:00',
    duration: 60,
    location: 'Salle 204',
    participants: ['Tuteur', 'Groupe PFA'],
    recurrence: 'weekly',
    tone: 'accent',
  },
  {
    id: 'e-11',
    type: 'sport',
    title: 'Foot en équipe',
    category: 'sport',
    date: '2026-08-13',
    start: '19:00',
    end: '20:30',
    duration: 90,
    location: 'Terrain municipal',
    participants: ['Équipe 2'],
    tone: 'danger',
  },
  {
    id: 'e-12',
    type: 'task',
    title: 'Lecture — chapitre 4 de réseaux',
    category: 'work',
    date: '2026-08-14',
    start: '09:00',
    end: '10:00',
    duration: 60,
    status: 'todo',
    priority: 'medium',
    tone: 'primary',
  },
  {
    id: 'e-13',
    type: 'event',
    title: 'Consultation médicale',
    category: 'personal',
    date: '2026-08-14',
    start: '15:00',
    end: '15:30',
    duration: 30,
    location: 'Centre de santé',
    tone: 'accent',
  },
  {
    id: 'e-14',
    type: 'break',
    title: 'Pause café',
    category: 'meals',
    date: '2026-08-15',
    start: '16:00',
    end: '16:15',
    duration: 15,
    tone: 'warning',
  },
];
