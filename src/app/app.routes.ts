import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/dashboard.page';
import { BusinessModulePageComponent } from './features/modules/business-module.page';

const businessModules = [
  'registro-principal',
  'finanzas',
  'ventas',
  'inventario',
  'compras',
  'clientes',
  'operacion',
  'proveedores',
  'solicitudes',
  'ordenes-compra',
  'recepciones',
  'cuentas-por-pagar',
  'pagos',
  'reportes',
  'configuracion',
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: DashboardPageComponent },
  ...businessModules.map((module) => ({
    path: module,
    component: BusinessModulePageComponent,
    data: { module },
  })),
  { path: '**', redirectTo: 'inicio' },
];
