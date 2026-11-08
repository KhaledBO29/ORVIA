import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TaskStoreService } from '../../core/task-store.service';
import { ActivityItem, AttentionItem, DashboardMetric } from './dashboard.models';
import { ActivityFeedComponent } from '../../shared/activity-feed/activity-feed.component';
import { AttentionPanelComponent } from '../../shared/attention-panel/attention-panel.component';
import { MetricCardComponent } from '../../shared/metric-card/metric-card.component';
import { PerformanceChartComponent } from '../../shared/performance-chart/performance-chart.component';
import { QuickActionsComponent } from '../../shared/quick-actions/quick-actions.component';
import { TaskFlowComponent } from '../../shared/task-flow/task-flow.component';

@Component({
  imports: [
    NgFor,
    ActivityFeedComponent,
    AttentionPanelComponent,
    MetricCardComponent,
    PerformanceChartComponent,
    QuickActionsComponent,
    TaskFlowComponent,
  ],
  selector: 'app-dashboard-page',
  styleUrl: './dashboard.page.scss',
  templateUrl: './dashboard.page.html',
})
export class DashboardPageComponent {
  protected readonly taskStore: TaskStoreService;

  protected readonly metrics: readonly DashboardMetric[] = [
    { label: 'Ventas', value: '$185.400.000', suffix: 'COP', change: '18,4%', direction: 'up', icon: '↗', tone: 'violet' },
    { label: 'Utilidad', value: '$62.500.000', suffix: 'COP', change: '11,7%', direction: 'up', icon: '⌁', tone: 'green' },
    { label: 'Gastos', value: '$38.400.000', suffix: 'COP', change: '4,2%', direction: 'down', icon: '↘', tone: 'rose' },
    { label: 'Caja y bancos', value: '$72.500.000', suffix: 'COP', change: '8,2%', direction: 'up', icon: '▥', tone: 'amber' },
  ];

  protected readonly activities: readonly ActivityItem[] = [
    { icon: '▰', person: 'Carlos Pérez', action: 'Registró una venta', detail: 'Factura #001254 · hace 12 min', amount: '+$850.000 COP', tone: 'green' },
    { icon: '▤', person: 'María López', action: 'Registró una compra', detail: 'Compra #000845 · hace 38 min', amount: '−$2.400.000 COP', tone: 'rose' },
    { icon: '▧', person: 'Pedro Gómez', action: 'Modificó inventario', detail: 'Cemento 50 kg · hace 1 h', amount: '−30 unidades', tone: 'amber' },
    { icon: '＄', person: 'Administrador', action: 'Registró un gasto', detail: 'Gasto #000124 · hace 2 h', amount: '−$450.000 COP', tone: 'rose' },
    { icon: '▣', person: 'Ana Rodríguez', action: 'Registró un ingreso', detail: 'Pago #000789 · hace 3 h', amount: '+$1.250.000 COP', tone: 'green' },
  ];

  protected readonly attentionItems: readonly AttentionItem[] = [
    { icon: '!', title: '3 facturas vencidas', detail: 'Total: $2.450.000 COP', tone: 'rose' },
    { icon: '◇', title: '5 productos con stock bajo', detail: 'Requieren reposición', tone: 'amber' },
    { icon: '↔', title: '1 diferencia de caja', detail: 'Total: $350.000 COP', tone: 'violet' },
  ];

  constructor(taskStore: TaskStoreService) {
    this.taskStore = taskStore;
  }
}
