import type { LucideIcon } from '@lucide/angular';
import { LucideBike, LucideDumbbell, LucideFootprints, LucidePersonStanding, LucideZap } from '@lucide/angular';

export type WorkoutType = 'running' | 'walking' | 'cycling' | 'gym' | 'stretching';
export type WorkoutIntensity = 'low' | 'medium' | 'high';

export interface Workout {
  id: string;
  type: WorkoutType;
  title: string;
  date: string; // ISO yyyy-MM-dd
  startTime: string; // HH:mm
  duration: number; // minutes
  distance: number; // km
  calories: number;
  intensity: WorkoutIntensity;
  notes: string;
}

export interface WeeklyStat {
  day: string;
  activeMinutes: number;
  calories: number;
}

export const WORKOUT_TYPES: WorkoutType[] = ['running', 'walking', 'cycling', 'gym', 'stretching'];

export const WORKOUT_TYPE_ICONS: Record<WorkoutType, LucideIcon> = {
  running: LucideZap,
  walking: LucideFootprints,
  cycling: LucideBike,
  gym: LucideDumbbell,
  stretching: LucidePersonStanding,
};

export const WORKOUT_TYPE_CHIP: Record<WorkoutType, string> = {
  running: 'bg-teal-50 text-accent-dark',
  walking: 'bg-navy-50 text-primary',
  cycling: 'bg-success-light text-success',
  gym: 'bg-warning-light text-warning',
  stretching: 'bg-surface-muted text-ink',
};

export const WORKOUT_TYPE_BAR: Record<WorkoutType, string> = {
  running: 'bg-accent',
  walking: 'bg-primary',
  cycling: 'bg-success',
  gym: 'bg-warning',
  stretching: 'bg-navy-300',
};

export const WORKOUT_TYPE_TEXT: Record<WorkoutType, string> = {
  running: 'text-accent-dark',
  walking: 'text-primary',
  cycling: 'text-success',
  gym: 'text-warning',
  stretching: 'text-navy-600',
};

export const DAILY_STEPS_GOAL = 8000;
export const DAILY_ACTIVE_GOAL = 45;
export const DAILY_CALORIE_GOAL = 500;

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function offsetDays(days: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

export function formatDistance(km: number, locale = 'fr-FR'): string {
  return km === 0 ? '—' : `${km.toLocaleString(locale, { maximumFractionDigits: 1 })} km`;
}

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: 'w-01',
    type: 'running',
    title: 'Footing du matin',
    date: toISODate(offsetDays(0)),
    startTime: '07:30',
    duration: 30,
    distance: 4.5,
    calories: 320,
    intensity: 'medium',
    notes: 'Sensation bonne, rythme régulier.',
  },
  {
    id: 'w-02',
    type: 'walking',
    title: 'Marche de midi',
    date: toISODate(offsetDays(0)),
    startTime: '12:30',
    duration: 25,
    distance: 1.8,
    calories: 90,
    intensity: 'low',
    notes: '',
  },
  {
    id: 'w-03',
    type: 'gym',
    title: 'Musculation',
    date: toISODate(offsetDays(-1)),
    startTime: '18:00',
    duration: 60,
    distance: 0,
    calories: 280,
    intensity: 'high',
    notes: 'Haut du corps : épaules, dos, bras.',
  },
  {
    id: 'w-04',
    type: 'cycling',
    title: 'Sortie vélo',
    date: toISODate(offsetDays(-2)),
    startTime: '17:00',
    duration: 75,
    distance: 22,
    calories: 540,
    intensity: 'medium',
    notes: '',
  },
  {
    id: 'w-05',
    type: 'stretching',
    title: 'Étirements du soir',
    date: toISODate(offsetDays(-3)),
    startTime: '21:00',
    duration: 20,
    distance: 0,
    calories: 40,
    intensity: 'low',
    notes: 'Séance de récupération légère.',
  },
  {
    id: 'w-06',
    type: 'running',
    title: 'Course fractionnée',
    date: toISODate(offsetDays(-4)),
    startTime: '07:00',
    duration: 40,
    distance: 6,
    calories: 460,
    intensity: 'high',
    notes: '',
  },
  {
    id: 'w-07',
    type: 'walking',
    title: 'Balade en ville',
    date: toISODate(offsetDays(-5)),
    startTime: '19:00',
    duration: 45,
    distance: 3.2,
    calories: 160,
    intensity: 'low',
    notes: '',
  },
  {
    id: 'w-08',
    type: 'gym',
    title: 'Musculation',
    date: toISODate(offsetDays(-6)),
    startTime: '18:30',
    duration: 50,
    distance: 0,
    calories: 240,
    intensity: 'medium',
    notes: 'Bas du corps : jambes, abdos.',
  },
];
