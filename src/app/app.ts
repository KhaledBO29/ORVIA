import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './shared/app-header/app-header.component';
import { AppSidebarComponent } from './shared/app-sidebar/app-sidebar.component';

@Component({
  imports: [RouterOutlet, AppHeaderComponent, AppSidebarComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly sidebarCollapsed = signal(false);

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }
}
