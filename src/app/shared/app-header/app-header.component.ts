import { Component, output } from '@angular/core';

@Component({
  selector: 'app-header',
  styleUrl: './app-header.component.scss',
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  readonly menuClicked = output<void>();
}
