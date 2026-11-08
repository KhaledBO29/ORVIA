import { TestBed } from '@angular/core/testing';
import { BusinessRecordsService } from './business-records.service';

describe('BusinessRecordsService', () => {
  let service: BusinessRecordsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessRecordsService);
  });

  it('provides seeded finance and central operations records', () => {
    expect(service.recordsFor('finanzas').length).toBeGreaterThan(0);
    expect(service.recordsFor('registro-principal').length).toBeGreaterThan(0);
  });

  it('creates, completes, persists, and deletes an operation', () => {
    service.addRecord('registro-principal', {
      name: 'Venta de prueba',
      party: 'Cliente de prueba',
      amount: 125000,
      kind: 'Ingreso',
    });

    const newRecord = service.recordsFor('registro-principal')[0];
    expect(newRecord?.reference).toBe('OP-00129');
    expect(newRecord?.status).toBe('Pendiente');
    if (!newRecord) {
      throw new Error('The saved operation should be the first record.');
    }

    service.toggleStatus('registro-principal', newRecord.id);
    expect(service.recordsFor('registro-principal')[0]?.status).toBe('Completado');

    service.updateRecord('registro-principal', newRecord.id, {
      name: 'Venta actualizada',
      party: 'Cliente de prueba',
      amount: 150000,
      kind: 'Ingreso',
    });
    expect(service.recordsFor('registro-principal')[0]?.name).toBe('Venta actualizada');

    const persistedRecords = JSON.parse(
      localStorage.getItem('orvia-records:registro-principal') ?? '[]',
    ) as { id: string; status: string }[];
    expect(persistedRecords[0]?.status).toBe('Completado');

    service.deleteRecord('registro-principal', newRecord.id);
    expect(service.recordsFor('registro-principal')).toHaveLength(5);
  });

  it('does not reuse a visible reference after deleting a record', () => {
    const initialRecord = service.recordsFor('registro-principal')[1]!;
    service.deleteRecord('registro-principal', initialRecord.id);
    service.addRecord('registro-principal', {
      name: 'Nueva operación',
      party: 'Cliente',
      amount: 100,
      kind: 'Ingreso',
    });

    expect(service.recordsFor('registro-principal')[0]?.reference).toBe('OP-00129');
  });
});
