import { Component, input } from '@angular/core';
import { DashboardMetric } from '../../features/dashboard/dashboard.models';

@Component({
  selector: 'app-metric-card',
  styleUrl: './metric-card.component.scss',
  templateUrl: './metric-card.component.html',
})
export class MetricCardComponent {
  readonly metric = input.required<DashboardMetric>();
}
