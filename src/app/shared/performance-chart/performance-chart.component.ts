import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-performance-chart',
  styleUrl: './performance-chart.component.scss',
  templateUrl: './performance-chart.component.html',
})
export class PerformanceChartComponent {
  protected readonly activePeriod = signal('30 días');
  protected readonly periods = ['7 días', '30 días', '90 días'];

  protected selectPeriod(period: string): void {
    this.activePeriod.set(period);
  }
}
