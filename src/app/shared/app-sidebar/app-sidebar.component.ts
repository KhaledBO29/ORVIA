import { NgClass, NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

@Component({
  imports: [NgClass, NgFor, RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './app-sidebar.component.scss',
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent {
  readonly collapsed = input(false);

  protected readonly navigationItems: NavigationItem[] = [
    { label: 'Inicio', icon: '⌂', route: '/inicio' },
    { label: 'Registro principal', icon: '▤', route: '/registro-principal' },
    { label: 'Finanzas', icon: '▥', route: '/finanzas' },
    { label: 'Ventas', icon: '▧', route: '/ventas' },
    { label: 'Inventario', icon: '▤', route: '/inventario' },
    { label: 'Compras', icon: '▰', route: '/compras' },
    { label: 'Clientes', icon: '♧', route: '/clientes' },
    { label: 'Operación', icon: '⚒', route: '/operacion' },
    { label: 'Proveedores', icon: '♙', route: '/proveedores' },
    { label: 'Solicitudes', icon: '▣', route: '/solicitudes' },
    { label: 'Órdenes de compra', icon: '▤', route: '/ordenes-compra' },
    { label: 'Recepciones', icon: '▧', route: '/recepciones' },
    { label: 'Cuentas por pagar', icon: '＄', route: '/cuentas-por-pagar' },
    { label: 'Pagos', icon: '▣', route: '/pagos' },
    { label: 'Reportes', icon: '▥', route: '/reportes' },
    { label: 'Configuración', icon: '⚙', route: '/configuracion' },
  ];
}
