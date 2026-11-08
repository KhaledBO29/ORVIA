import { NgClass, NgFor } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BusinessRecord,
  ModuleDefinition,
} from '../../features/operations/business-modules';

type StatusFilter = 'Todas' | 'Pendientes' | 'Completadas';

const COMPLETE_STATUSES = new Set(['Completado', 'Pagado', 'Recibida', 'Aprobada', 'Activo']);

@Component({
  imports: [NgClass, NgFor, RouterLink],
  selector: 'app-record-register',
  styleUrl: './record-register.component.scss',
  templateUrl: './record-register.component.html',
})
export class RecordRegisterComponent {
  readonly module = input.required<ModuleDefinition>();
  readonly records = input.required<readonly BusinessRecord[]>();
  readonly createRequested = output<void>();
  readonly recordEditRequested = output<BusinessRecord>();
  readonly recordStatusChanged = output<BusinessRecord>();
  readonly recordDeleted = output<BusinessRecord>();

  protected readonly query = signal('');
  protected readonly statusFilter = signal<StatusFilter>('Todas');
  protected readonly filters: readonly StatusFilter[] = ['Todas', 'Pendientes', 'Completadas'];
  protected readonly filteredRecords = computed(() => {
    const normalizedQuery = this.query().trim().toLocaleLowerCase('es');
    return this.records().filter((record) => {
      const matchesQuery =
        !normalizedQuery ||
        [record.reference, record.name, record.party, record.kind, record.status]
          .some((value) => value.toLocaleLowerCase('es').includes(normalizedQuery));
      const isComplete = COMPLETE_STATUSES.has(record.status);
      const matchesStatus =
        this.statusFilter() === 'Todas' ||
        (this.statusFilter() === 'Completadas' ? isComplete : !isComplete);
      return matchesQuery && matchesStatus;
    });
  });

  protected setQuery(value: string): void {
    this.query.set(value);
  }

  protected setStatusFilter(filter: StatusFilter): void {
    this.statusFilter.set(filter);
  }

  protected isCompleted(record: BusinessRecord): boolean {
    return COMPLETE_STATUSES.has(record.status);
  }

  protected statusClass(status: string): string {
    const normalizedStatus = status
      .toLocaleLowerCase('es')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
    return `record-status--${normalizedStatus}`;
  }

  protected formatValue(record: BusinessRecord, columnKey: keyof BusinessRecord): string {
    if (columnKey === 'amount') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(record.amount);
    }
    return String(record[columnKey]);
  }

  protected trackById(_index: number, record: BusinessRecord): string {
    return record.id;
  }
}
