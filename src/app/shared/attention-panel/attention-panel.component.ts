import { NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AttentionItem } from '../../features/dashboard/dashboard.models';

@Component({
  imports: [NgFor, RouterLink],
  selector: 'app-attention-panel',
  styleUrl: './attention-panel.component.scss',
  templateUrl: './attention-panel.component.html',
})
export class AttentionPanelComponent {
  readonly items = input.required<readonly AttentionItem[]>();
}
