export interface DashboardMetric {
  readonly label: string;
  readonly value: string;
  readonly suffix?: string;
  readonly change: string;
  readonly direction: 'up' | 'down';
  readonly icon: string;
  readonly tone: 'violet' | 'green' | 'rose' | 'amber';
}

export interface DashboardTask {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
}

export interface ActivityItem {
  readonly icon: string;
  readonly person: string;
  readonly action: string;
  readonly detail: string;
  readonly amount: string;
  readonly tone: 'violet' | 'green' | 'rose' | 'amber';
}

export interface AttentionItem {
  readonly icon: string;
  readonly title: string;
  readonly detail: string;
  readonly tone: 'violet' | 'rose' | 'amber';
}
