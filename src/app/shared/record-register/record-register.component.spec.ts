import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BUSINESS_MODULES } from '../../features/operations/business-modules';
import { RecordRegisterComponent } from './record-register.component';

describe('RecordRegisterComponent', () => {
  let fixture: ComponentFixture<RecordRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordRegisterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordRegisterComponent);
    fixture.componentRef.setInput('module', BUSINESS_MODULES.finanzas);
    fixture.componentRef.setInput('records', BUSINESS_MODULES.finanzas.records);
    fixture.detectChanges();
  });

  it('searches and filters the module records', () => {
    const search: HTMLInputElement = fixture.nativeElement.querySelector('[aria-label="Buscar registros"]');
    search.value = 'energía';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);

    search.value = '';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const completedFilter = [...fixture.nativeElement.querySelectorAll('button')]
      .find((button: HTMLButtonElement) => button.textContent.trim() === 'Completadas') as HTMLButtonElement;
    completedFilter.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(4);
  });

  it('emits record actions and new-record requests', () => {
    const statusChanged = vi.fn();
    const recordEditRequested = vi.fn();
    const recordDeleted = vi.fn();
    const createRequested = vi.fn();
    fixture.componentInstance.recordStatusChanged.subscribe(statusChanged);
    fixture.componentInstance.recordEditRequested.subscribe(recordEditRequested);
    fixture.componentInstance.recordDeleted.subscribe(recordDeleted);
    fixture.componentInstance.createRequested.subscribe(createRequested);

    fixture.nativeElement.querySelector('.record-action[title="Editar registro"]').click();
    fixture.nativeElement.querySelector('.record-action--complete').click();
    fixture.nativeElement.querySelector('.record-action--delete').click();
    fixture.nativeElement.querySelector('.register-panel__heading button').click();

    expect(statusChanged).toHaveBeenCalledWith(BUSINESS_MODULES.finanzas.records[0]);
    expect(recordEditRequested).toHaveBeenCalledWith(BUSINESS_MODULES.finanzas.records[0]);
    expect(recordDeleted).toHaveBeenCalledWith(BUSINESS_MODULES.finanzas.records[0]);
    expect(createRequested).toHaveBeenCalledOnce();
  });
});
