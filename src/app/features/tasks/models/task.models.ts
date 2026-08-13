import type { LucideIcon } from '@lucide/angular';
import {
  LucideBriefcase,
  LucideDumbbell,
  LucideGraduationCap,
  LucideHome,
} from '@lucide/angular';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'personal' | 'sport' | 'studies';

export type TaskStatusFilter = 'all' | TaskStatus | 'overdue';
export type TaskPriorityFilter = 'all' | TaskPriority;
export type TaskCategoryFilter = 'all' | TaskCategory;
export type TaskSort = 'newest' | 'oldest' | 'priority' | 'due' | 'duration';

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskActivity {
  id: string;
  label: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; // ISO (yyyy-MM-dd)
  startTime: string; // HH:mm
  duration: number; // minutes
  progress: number; // 0..100
  notes: string;
  subtasks: Subtask[];
  activity: TaskActivity[];
  createdAt: string; // ISO
}

export const CATEGORY_KEYS: Record<TaskCategory, string> = {
  work: 'categories.work',
  personal: 'categories.personal',
  sport: 'categories.sport',
  studies: 'categories.studies',
};

export const PRIORITY_KEYS: Record<TaskPriority, string> = {
  low: 'priorities.low',
  medium: 'priorities.medium',
  high: 'priorities.high',
};

export const STATUS_KEYS: Record<TaskStatus, string> = {
  todo: 'statuses.todo',
  'in-progress': 'statuses.inProgress',
  done: 'statuses.done',
};

export const CATEGORY_ICONS: Record<TaskCategory, LucideIcon> = {
  work: LucideBriefcase,
  personal: LucideHome,
  sport: LucideDumbbell,
  studies: LucideGraduationCap,
};

const PRIORITY_RANK: Record<TaskPriority, number> = { low: 0, medium: 1, high: 2 };

const pad2 = (value: number): string => String(value).padStart(2, '0');

export function toISO(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function todayISO(): string {
  return daysFromNow(0);
}

export function isOverdue(task: Task): boolean {
  return task.status !== 'done' && task.dueDate < todayISO();
}

const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function dueLabel(iso: string): string {
  if (iso === todayISO()) {
    return "Aujourd'hui";
  }
  if (iso === daysFromNow(1)) {
    return 'Demain';
  }
  if (iso === daysFromNow(-1)) {
    return 'Hier';
  }
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = WEEKDAYS[date.getDay()];
  return `${weekday[0].toUpperCase()}${weekday.slice(1)}`;
}

export function durationLabel(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

export function compareTasks(a: Task, b: Task, sort: TaskSort): number {
  switch (sort) {
    case 'newest':
      return a.createdAt < b.createdAt ? 1 : -1;
    case 'oldest':
      return a.createdAt > b.createdAt ? 1 : -1;
    case 'priority':
      return (
        PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] ||
        a.dueDate.localeCompare(b.dueDate)
      );
    case 'duration':
      return b.duration - a.duration;
    default:
      return a.dueDate.localeCompare(b.dueDate);
  }
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

export const MOCK_TASKS: Task[] = [
  {
    id: 't-01',
    title: 'Finaliser le dashboard Digital Life Twin',
    description:
      'Finaliser les composants principaux du dashboard et vérifier la responsive design.',
    status: 'in-progress',
    priority: 'high',
    category: 'work',
    dueDate: daysFromNow(0),
    startTime: '09:00',
    duration: 90,
    progress: 65,
    notes: 'Penser à aligner les couleurs sur la charte teal / navy.',
    subtasks: [
      { id: 's-01', title: 'Header', done: true },
      { id: 's-02', title: 'Sidebar', done: true },
      { id: 's-03', title: 'Routing', done: true },
      { id: 's-04', title: 'Dashboard cards', done: false },
      { id: 's-05', title: 'Responsive mobile', done: false },
    ],
    activity: [
      { id: 'a-01', label: 'Priorité modifiée' },
      { id: 'a-02', label: 'Tâche créée' },
    ],
    createdAt: daysFromNow(-1),
  },
  {
    id: 't-02',
    title: 'Réviser le chapitre 5 d’algorithmique',
    description: 'Graphes, parcours en profondeur et Dijkstra. Refaire les 3 exercices du TD.',
    status: 'in-progress',
    priority: 'high',
    category: 'studies',
    dueDate: daysFromNow(0),
    startTime: '10:30',
    duration: 120,
    progress: 40,
    notes: '',
    subtasks: [
      { id: 's-06', title: 'Relire le cours', done: true },
      { id: 's-07', title: 'Exercice 1 et 2', done: false },
    ],
    activity: [{ id: 'a-03', label: 'Tâche créée' }],
    createdAt: daysFromNow(-2),
  },
  {
    id: 't-03',
    title: 'Répondre aux emails',
    description: 'Traiter la boîte de réception : réponses, relances et classement.',
    status: 'todo',
    priority: 'medium',
    category: 'work',
    dueDate: daysFromNow(0),
    startTime: '14:00',
    duration: 30,
    progress: 0,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-04', label: 'Tâche créée' }],
    createdAt: daysFromNow(0),
  },
  {
    id: 't-04',
    title: 'Réunion de synchro hebdo',
    description: 'Point d’avancement hebdomadaire avec l’équipe.',
    status: 'done',
    priority: 'medium',
    category: 'work',
    dueDate: daysFromNow(0),
    startTime: '09:00',
    duration: 60,
    progress: 100,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-05', label: 'Tâche créée' }],
    createdAt: daysFromNow(-4),
  },
  {
    id: 't-05',
    title: 'Étirement matinal',
    description: '15 minutes d’étirements et de respiration.',
    status: 'done',
    priority: 'low',
    category: 'sport',
    dueDate: daysFromNow(0),
    startTime: '07:30',
    duration: 15,
    progress: 100,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-06', label: 'Tâche créée' }],
    createdAt: daysFromNow(-3),
  },
  {
    id: 't-06',
    title: 'Mettre à jour le calendrier',
    description: 'Ajouter les échéances de la semaine dans le planning.',
    status: 'done',
    priority: 'low',
    category: 'personal',
    dueDate: daysFromNow(0),
    startTime: '12:00',
    duration: 20,
    progress: 100,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-07', label: 'Tâche créée' }],
    createdAt: daysFromNow(-2),
  },
  {
    id: 't-07',
    title: 'Compte-rendu de réunion',
    description: 'Rédiger et partager le compte-rendu de la réunion de lundi.',
    status: 'done',
    priority: 'medium',
    category: 'work',
    dueDate: daysFromNow(0),
    startTime: '15:00',
    duration: 45,
    progress: 100,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-08', label: 'Tâche créée' }],
    createdAt: daysFromNow(-3),
  },
  {
    id: 't-08',
    title: 'Vérifier les notifications DLT',
    description: 'Vérifier les alertes et rappels de la plateforme.',
    status: 'done',
    priority: 'low',
    category: 'personal',
    dueDate: daysFromNow(0),
    startTime: '08:00',
    duration: 15,
    progress: 100,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-09', label: 'Tâche créée' }],
    createdAt: daysFromNow(-1),
  },
  {
    id: 't-09',
    title: 'Préparer la présentation PFA',
    description: 'Préparer le support de présentation du projet de fin d’année.',
    status: 'todo',
    priority: 'high',
    category: 'studies',
    dueDate: daysFromNow(1),
    startTime: '11:00',
    duration: 45,
    progress: 20,
    notes: 'Structurer : contexte, objectifs, démo, suite.',
    subtasks: [],
    activity: [{ id: 'a-10', label: 'Tâche créée' }],
    createdAt: daysFromNow(0),
  },
  {
    id: 't-10',
    title: '30 minutes de sport',
    description: 'Footing léger ou séance de musculation rapide.',
    status: 'todo',
    priority: 'medium',
    category: 'sport',
    dueDate: daysFromNow(1),
    startTime: '18:00',
    duration: 30,
    progress: 0,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-11', label: 'Tâche créée' }],
    createdAt: daysFromNow(-1),
  },
  {
    id: 't-11',
    title: 'Préparer rapport hebdomadaire',
    description: 'Rassembler les indicateurs de la semaine et rédiger la synthèse.',
    status: 'todo',
    priority: 'high',
    category: 'work',
    dueDate: daysFromNow(-1),
    startTime: '16:00',
    duration: 60,
    progress: 0,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-12', label: 'Tâche créée' }],
    createdAt: daysFromNow(-3),
  },
  {
    id: 't-12',
    title: 'Lire 20 pages',
    description: 'Lecture du livre en cours — chapitre sur les habitudes.',
    status: 'todo',
    priority: 'low',
    category: 'personal',
    dueDate: daysFromNow(3),
    startTime: '20:30',
    duration: 40,
    progress: 0,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-13', label: 'Tâche créée' }],
    createdAt: daysFromNow(-2),
  },
  {
    id: 't-13',
    title: 'Compléter le profil DLT',
    description: 'Renseigner les préférences et objectifs de la semaine.',
    status: 'todo',
    priority: 'low',
    category: 'personal',
    dueDate: daysFromNow(2),
    startTime: '17:00',
    duration: 30,
    progress: 0,
    notes: '',
    subtasks: [],
    activity: [{ id: 'a-14', label: 'Tâche créée' }],
    createdAt: daysFromNow(-1),
  },
];
