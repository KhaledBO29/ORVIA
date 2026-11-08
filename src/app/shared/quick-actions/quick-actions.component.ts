import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface QuickAction {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

@Component({
  imports: [NgFor, RouterLink],
  selector: 'app-quick-actions',
  styleUrl: './quick-actions.component.scss',
  templateUrl: './quick-actions.component.html',
})
export class QuickActionsComponent {
  protected readonly actions: readonly QuickAction[] = [
    { label: 'Registrar operación', icon: '▤', route: '/registro-principal' },
    { label: 'Nueva venta', icon: '▰', route: '/ventas' },
    { label: 'Nuevo cliente', icon: '♧', route: '/clientes' },
    { label: 'Registrar gasto', icon: '＄', route: '/finanzas' },
    { label: 'Crear pedido', icon: '▣', route: '/ordenes-compra' },
  ];
}
