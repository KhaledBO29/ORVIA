import { Injectable, signal } from '@angular/core';
import { BUSINESS_MODULES, BusinessRecord, ModuleSlug } from '../features/operations/business-modules';

const STORAGE_PREFIX = 'orvia-records:';
const COMPLETE_STATUSES = new Set(['Completado', 'Pagado', 'Recibida', 'Aprobada', 'Activo']);

export interface NewBusinessRecord {
  readonly name: string;
  readonly party: string;
  readonly amount: number;
  readonly kind: string;
}

@Injectable({ providedIn: 'root' })
export class BusinessRecordsService {
  readonly records = signal<Readonly<Record<ModuleSlug, readonly BusinessRecord[]>>>(this.loadAllRecords());

  recordsFor(slug: ModuleSlug): readonly BusinessRecord[] {
    return this.records()[slug];
  }

  completedCount(slug: ModuleSlug): number {
    return this.recordsFor(slug).filter((record) => COMPLETE_STATUSES.has(record.status)).length;
  }

  totalAmount(slug: ModuleSlug): number {
    return this.recordsFor(slug).reduce((total, record) => total + record.amount, 0);
  }

  addRecord(slug: ModuleSlug, entry: NewBusinessRecord): void {
    const records = this.recordsFor(slug);
    const prefix = BUSINESS_MODULES[slug].slug === 'registro-principal' ? 'OP' : slug.slice(0, 3).toUpperCase();
    const nextReference = records.reduce((next, record) => {
      const sequence = Number(record.reference.match(/(\d+)$/)?.[1] ?? 0);
      return sequence >= next ? sequence + 1 : next;
    }, 1);
    const record: BusinessRecord = {
      id: `${slug}-${crypto.randomUUID()}`,
      reference: `${prefix}-${String(nextReference).padStart(5, '0')}`,
      name: entry.name,
      party: entry.party,
      amount: entry.amount,
      status: 'Pendiente',
      date: new Intl.DateTimeFormat('es-CO').format(new Date()),
      kind: entry.kind,
    };

    this.persist(slug, [record, ...records]);
  }

  updateRecord(slug: ModuleSlug, recordId: string, entry: NewBusinessRecord): void {
    const updatedRecords = this.recordsFor(slug).map((record) =>
      record.id === recordId
        ? { ...record, name: entry.name, party: entry.party, amount: entry.amount, kind: entry.kind }
        : record,
    );
    this.persist(slug, updatedRecords);
  }

  toggleStatus(slug: ModuleSlug, recordId: string): void {
    const updatedRecords = this.recordsFor(slug).map((record) =>
      record.id === recordId
        ? { ...record, status: COMPLETE_STATUSES.has(record.status) ? 'Pendiente' : 'Completado' }
        : record,
    );
    this.persist(slug, updatedRecords);
  }

  deleteRecord(slug: ModuleSlug, recordId: string): void {
    this.persist(slug, this.recordsFor(slug).filter((record) => record.id !== recordId));
  }

  private loadAllRecords(): Readonly<Record<ModuleSlug, readonly BusinessRecord[]>> {
    const records = {} as Record<ModuleSlug, readonly BusinessRecord[]>;

    for (const [slug, definition] of Object.entries(BUSINESS_MODULES) as [
      ModuleSlug,
      (typeof BUSINESS_MODULES)[ModuleSlug],
    ][]) {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
      if (saved === null) {
        records[slug] = definition.records;
        continue;
      }

      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed) || !parsed.every(isBusinessRecord)) {
        throw new Error(`Los datos guardados para "${definition.title}" no tienen un formato válido.`);
      }
      records[slug] = parsed;
    }

    return records;
  }

  private persist(slug: ModuleSlug, moduleRecords: readonly BusinessRecord[]): void {
    localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(moduleRecords));
    this.records.update((allRecords) => ({ ...allRecords, [slug]: moduleRecords }));
  }
}

function isBusinessRecord(value: unknown): value is BusinessRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record['id'] === 'string' &&
    typeof record['reference'] === 'string' &&
    typeof record['name'] === 'string' &&
    typeof record['party'] === 'string' &&
    typeof record['amount'] === 'number' &&
    Number.isFinite(record['amount']) &&
    typeof record['status'] === 'string' &&
    typeof record['date'] === 'string' &&
    typeof record['kind'] === 'string'
  );
}
