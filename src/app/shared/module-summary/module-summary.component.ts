import { NgClass, NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ModuleMetric {
  readonly label: string;
  readonly value: string;
  readonly tone: 'violet' | 'green' | 'rose' | 'amber';
  readonly icon: string;
}

export interface FinancialSummary {
  readonly income: string;
  readonly expenses: string;
  readonly balance: string;
  readonly incomePercent: number;
  readonly expensePercent: number;
  readonly isPositive: boolean;
}

@Component({
  imports: [NgClass, NgFor, RouterLink],
  selector: 'app-module-summary',
  styleUrl: './module-summary.component.scss',
  templateUrl: './module-summary.component.html',
})
export class ModuleSummaryComponent {
  readonly metrics = input.required<readonly ModuleMetric[]>();
  readonly financialSummary = input<FinancialSummary | null>(null);
}
