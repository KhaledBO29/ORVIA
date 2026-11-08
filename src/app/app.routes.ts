import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: DashboardPageComponent },
  { path: '**', redirectTo: 'inicio' },
];
