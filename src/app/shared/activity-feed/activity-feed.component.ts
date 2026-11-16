import { NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityItem } from '../../features/dashboard/dashboard.models';

@Component({
  imports: [NgFor, RouterLink],
  selector: 'app-activity-feed',
  styleUrl: './activity-feed.component.scss',
  templateUrl: './activity-feed.component.html',
})
export class ActivityFeedComponent {
  readonly activities = input.required<readonly ActivityItem[]>();
}
