import { Routes } from '@angular/router';
import { SeoConfig } from './core/services/seo/seo.service';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export function seo(config: SeoConfig): { seo: SeoConfig } {
  return { seo: config };
}

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
    data: seo({
      title: 'Connexion — Digital Life Twin',
      description:
        'Connectez-vous à votre espace Digital Life Twin pour retrouver votre planning, votre bien-être et vos insights personnalisés.',
    }),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
    data: seo({
      title: 'Créer un compte — Digital Life Twin',
      description:
        'Créez votre compte gratuit et centralisez votre planning, vos habitudes et votre bien-être au même endroit.',
    }),
  },
  {
    path: '',
    loadComponent: () => import('./features/public/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/pages/home/home').then((m) => m.HomeComponent),
        data: seo({
          title: 'Digital Life Twin — Votre quotidien, enfin compris',
          description:
            'Digital Life Twin centralise votre planning, vos habitudes et votre bien-être pour vous aider à mieux organiser votre quotidien.',
        }),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/pages/about/about').then((m) => m.AboutComponent),
        data: seo({
          title: 'À propos — Digital Life Twin',
          description:
            'Découvrez la vision de Digital Life Twin : une plateforme au service de votre organisation et de votre bien-être.',
        }),
      },
      {
        path: 'features',
        loadComponent: () =>
          import('./features/public/pages/features/features').then((m) => m.FeaturesComponent),
        data: seo({
          title: 'Fonctionnalités — Digital Life Twin',
          description:
            'Planning, tâches, calendrier, bien-être, nutrition, sport, notifications et IA : découvrez toutes les fonctionnalités de Digital Life Twin.',
        }),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/pages/contact/contact').then((m) => m.ContactComponent),
        data: seo({
          title: 'Contact — Digital Life Twin',
          description:
            'Une question, une idée, un retour ? Contactez l’équipe Digital Life Twin. Temps de réponse moyen : moins de 24 h.',
        }),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/components/app-shell/app-shell').then((m) => m.AppShell),
    canActivate: [authGuard],
    data: seo({
      title: 'Digital Life Twin',
      robots: 'noindex, nofollow',
    }),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'planning',
        loadComponent: () =>
          import('./features/planning/planning').then((m) => m.PlanningComponent),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks').then((m) => m.TasksComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar').then((m) => m.CalendarComponent),
      },
      {
        path: 'wellness',
        loadComponent: () =>
          import('./features/wellness/wellness').then((m) => m.WellnessComponent),
      },
      {
        path: 'nutrition',
        loadComponent: () =>
          import('./features/nutrition/nutrition').then((m) => m.NutritionComponent),
      },
      {
        path: 'sport',
        loadComponent: () => import('./features/sport/sport').then((m) => m.SportComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications').then((m) => m.NotificationsComponent),
      },
      {
        path: 'ai',
        loadComponent: () => import('./features/ai/ai').then((m) => m.AiComponent),
      },
      {
        path: 'assistant',
        loadComponent: () =>
          import('./features/assistant/assistant').then((m) => m.AssistantComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings').then((m) => m.SettingsComponent),
        data: seo({
          title: 'Paramètres — Digital Life Twin',
          description:
            'Personnalisez votre compte, votre expérience et vos préférences sur Digital Life Twin.',
        }),
      },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin').then((m) => m.AdminComponent),
        canActivate: [adminGuard],
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];
