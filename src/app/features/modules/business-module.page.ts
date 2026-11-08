import { NgFor } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BusinessRecordsService } from '../../core/business-records.service';
import {
  BUSINESS_MODULES,
  BusinessRecord,
  isModuleSlug,
  ModuleSlug,
} from '../operations/business-modules';
import { FinancialSummary, ModuleMetric, ModuleSummaryComponent } from '../../shared/module-summary/module-summary.component';
import { RecordRegisterComponent } from '../../shared/record-register/record-register.component';

interface Shortcut {
  readonly label: string;
  readonly route: string;
}

const SHORTCUTS: Partial<Record<ModuleSlug, readonly Shortcut[]>> = {
  finanzas: [
    { label: 'Cuentas por pagar', route: '/cuentas-por-pagar' },
    { label: 'Pagos', route: '/pagos' },
    { label: 'Registro principal', route: '/registro-principal' },
  ],
  compras: [
    { label: 'Órdenes de compra', route: '/ordenes-compra' },
    { label: 'Recepciones', route: '/recepciones' },
    { label: 'Proveedores', route: '/proveedores' },
  ],
  ventas: [
    { label: 'Clientes', route: '/clientes' },
    { label: 'Finanzas', route: '/finanzas' },
    { label: 'Registro principal', route: '/registro-principal' },
  ],
  inventario: [
    { label: 'Compras', route: '/compras' },
    { label: 'Proveedores', route: '/proveedores' },
    { label: 'Reportes', route: '/reportes' },
  ],
  'registro-principal': [
    { label: 'Finanzas', route: '/finanzas' },
    { label: 'Ventas', route: '/ventas' },
    { label: 'Compras', route: '/compras' },
  ],
};

@Component({
  imports: [NgFor, ModuleSummaryComponent, ReactiveFormsModule, RecordRegisterComponent, RouterLink],
  selector: 'app-business-module-page',
  styleUrl: './business-module.page.scss',
  templateUrl: './business-module.page.html',
})
export class BusinessModulePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private readonly recordsStore = inject(BusinessRecordsService);

  protected readonly activeSlug = computed<ModuleSlug>(() => {
    const slug = this.routeData()['module'];
    return isModuleSlug(slug) ? slug : 'registro-principal';
  });
  protected readonly dataSlug = computed<ModuleSlug>(() =>
    this.activeSlug() === 'finanzas' ? 'registro-principal' : this.activeSlug(),
  );
  protected readonly module = computed(() => BUSINESS_MODULES[this.activeSlug()]);
  protected readonly records = computed(() => this.recordsStore.records()[this.dataSlug()]);
  protected readonly formOpen = signal(false);
  protected readonly editingRecord = signal<BusinessRecord | null>(null);
  protected readonly notice = signal('');
  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    party: ['', [Validators.required, Validators.maxLength(100)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    kind: [''],
  });
  protected readonly completedCount = computed(() =>
    this.records().filter((record) => ['Completado', 'Pagado', 'Recibida', 'Aprobada', 'Activo'].includes(record.status)).length,
  );
  protected readonly pendingCount = computed(() => this.records().length - this.completedCount());
  protected readonly totalAmount = computed(() =>
    this.records().reduce((total, record) => total + record.amount, 0),
  );
  protected readonly incomeTotal = computed(() =>
    this.records()
      .filter((record) => ['ingreso', 'venta'].includes(record.kind.toLowerCase()))
      .reduce((total, record) => total + record.amount, 0),
  );
  protected readonly expenseTotal = computed(() =>
    this.records()
      .filter((record) => ['gasto', 'compra'].includes(record.kind.toLowerCase()))
      .reduce((total, record) => total + record.amount, 0),
  );
  protected readonly balance = computed(() => this.incomeTotal() - this.expenseTotal());
  protected readonly financialSummary = computed<FinancialSummary | null>(() => {
    if (this.activeSlug() !== 'finanzas' && this.activeSlug() !== 'registro-principal') {
      return null;
    }

    const total = this.incomeTotal() + this.expenseTotal();
    return {
      income: this.formatCurrency(this.incomeTotal()),
      expenses: this.formatCurrency(this.expenseTotal()),
      balance: this.formatCurrency(this.balance()),
      incomePercent: total > 0 ? (this.incomeTotal() / total) * 100 : 50,
      expensePercent: total > 0 ? (this.expenseTotal() / total) * 100 : 50,
      isPositive: this.balance() >= 0,
    };
  });
  protected readonly shortcuts = computed(() => SHORTCUTS[this.activeSlug()] ?? [
    { label: 'Registro principal', route: '/registro-principal' },
    { label: 'Inicio', route: '/inicio' },
  ]);
  protected readonly metrics = computed<readonly ModuleMetric[]>(() => {
    if (this.activeSlug() === 'finanzas' || this.activeSlug() === 'registro-principal') {
      return [
        { label: 'Ingresos registrados', value: this.formatCurrency(this.incomeTotal()), tone: 'green', icon: '↗' },
        { label: 'Gastos registrados', value: this.formatCurrency(this.expenseTotal()), tone: 'rose', icon: '↘' },
        { label: 'Balance neto', value: this.formatCurrency(this.balance()), tone: 'violet', icon: '⌁' },
        { label: 'Movimientos', value: String(this.records().length), tone: 'amber', icon: '▤' },
      ];
    }

    return [
      { label: 'Registros totales', value: String(this.records().length), tone: 'violet', icon: '▤' },
      { label: 'Pendientes', value: String(this.pendingCount()), tone: 'amber', icon: '◷' },
      { label: 'Completados', value: String(this.completedCount()), tone: 'green', icon: '✓' },
      { label: 'Valor registrado', value: this.formatCurrency(this.totalAmount()), tone: 'rose', icon: '＄' },
    ];
  });

  protected formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  protected openForm(): void {
    this.notice.set('');
    this.editingRecord.set(null);
    this.formOpen.set(true);
    this.form.reset({ name: '', party: '', amount: 0, kind: this.module().kinds[0] ?? 'Registro' });
  }

  protected closeForm(): void {
    this.formOpen.set(false);
    this.editingRecord.set(null);
  }

  protected editRecord(record: BusinessRecord): void {
    this.notice.set('');
    this.editingRecord.set(record);
    this.formOpen.set(true);
    this.form.reset({
      name: record.name,
      party: record.party,
      amount: record.amount,
      kind: record.kind,
    });
  }

  protected saveRecord(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const record = {
      name: value.name.trim(),
      party: value.party.trim(),
      amount: Number(value.amount),
      kind: value.kind || this.module().entityLabel,
    };
    const editingRecord = this.editingRecord();
    if (editingRecord) {
      this.recordsStore.updateRecord(this.dataSlug(), editingRecord.id, record);
      this.notice.set(`Se actualizó el registro ${editingRecord.reference}.`);
    } else {
      this.recordsStore.addRecord(this.dataSlug(), record);
      this.notice.set(`Registro agregado a ${this.module().title}.`);
    }
    this.closeForm();
  }

  protected toggleStatus(record: BusinessRecord): void {
    this.recordsStore.toggleStatus(this.dataSlug(), record.id);
  }

  protected deleteRecord(record: BusinessRecord): void {
    this.recordsStore.deleteRecord(this.dataSlug(), record.id);
    this.notice.set(`Se eliminó el registro ${record.reference}.`);
  }

}
