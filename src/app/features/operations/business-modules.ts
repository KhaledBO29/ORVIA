export type ModuleSlug =
  | 'registro-principal'
  | 'finanzas'
  | 'ventas'
  | 'inventario'
  | 'compras'
  | 'clientes'
  | 'operacion'
  | 'proveedores'
  | 'solicitudes'
  | 'ordenes-compra'
  | 'recepciones'
  | 'cuentas-por-pagar'
  | 'pagos'
  | 'reportes'
  | 'configuracion';

export interface BusinessRecord {
  readonly id: string;
  readonly reference: string;
  readonly name: string;
  readonly party: string;
  readonly amount: number;
  readonly status: string;
  readonly date: string;
  readonly kind: string;
}

export interface RecordColumn {
  readonly key: keyof BusinessRecord;
  readonly label: string;
}

export interface ModuleDefinition {
  readonly slug: ModuleSlug;
  readonly title: string;
  readonly icon: string;
  readonly description: string;
  readonly entityLabel: string;
  readonly nameLabel: string;
  readonly partyLabel: string;
  readonly amountLabel: string;
  readonly columns: readonly RecordColumn[];
  readonly records: readonly BusinessRecord[];
  readonly statuses: readonly string[];
  readonly kinds: readonly string[];
}

type SampleRow = readonly [string, string, string, number, string, string];

const COMMON_COLUMNS: readonly RecordColumn[] = [
  { key: 'reference', label: 'Referencia' },
  { key: 'name', label: 'Descripción' },
  { key: 'party', label: 'Cliente / proveedor' },
  { key: 'date', label: 'Fecha' },
  { key: 'amount', label: 'Valor' },
  { key: 'status', label: 'Estado' },
];

function createDefinition(
  slug: ModuleSlug,
  title: string,
  icon: string,
  description: string,
  entityLabel: string,
  nameLabel: string,
  partyLabel: string,
  amountLabel: string,
  rows: readonly SampleRow[],
  options: { statuses?: readonly string[]; kinds?: readonly string[]; columns?: readonly RecordColumn[] } = {},
): ModuleDefinition {
  return {
    slug,
    title,
    icon,
    description,
    entityLabel,
    nameLabel,
    partyLabel,
    amountLabel,
    columns: options.columns ?? COMMON_COLUMNS,
    statuses: options.statuses ?? ['Pendiente', 'Completado', 'En proceso'],
    kinds: options.kinds ?? [],
    records: rows.map(([reference, name, party, amount, status, kind], index) => ({
      id: `${slug}-${index + 1}`,
      reference,
      name,
      party,
      amount,
      status,
      date: `16/05/2025`,
      kind,
    })),
  };
}

export const BUSINESS_MODULES: Readonly<Record<ModuleSlug, ModuleDefinition>> = {
  'registro-principal': createDefinition(
    'registro-principal',
    'Registro principal',
    '▤',
    'Libro central de ingresos, gastos, ventas y compras de tu empresa.',
    'movimiento',
    'Descripción de la operación',
    'Cliente o proveedor',
    'Valor (COP)',
    [
      ['OP-000128', 'Venta de productos', 'Comercial Andina S.A.S.', 2800000, 'Completado', 'Venta'],
      ['OP-000127', 'Compra de insumos', 'Suministros del Valle', 1200000, 'Completado', 'Compra'],
      ['OP-000126', 'Pago de factura #4587', 'Servicios públicos', 450000, 'Pendiente', 'Gasto'],
      ['OP-000125', 'Pago de cliente', 'Distribuidora Central', 2500000, 'Completado', 'Ingreso'],
      ['OP-000124', 'Compra de inventario', 'Proveedora Nacional', 1200000, 'En proceso', 'Compra'],
    ],
    {
      kinds: ['Ingreso', 'Gasto', 'Venta', 'Compra'],
      columns: [
        { key: 'reference', label: 'N.º operación' },
        { key: 'kind', label: 'Tipo' },
        { key: 'name', label: 'Concepto' },
        { key: 'party', label: 'Tercero' },
        { key: 'date', label: 'Fecha' },
        { key: 'amount', label: 'Valor' },
        { key: 'status', label: 'Estado' },
      ],
    },
  ),
  finanzas: createDefinition(
    'finanzas',
    'Finanzas',
    '▥',
    'Consulta los ingresos, gastos, movimientos y saldos de tu negocio.',
    'movimiento',
    'Concepto',
    'Cliente o proveedor',
    'Valor (COP)',
    [
      ['ING-001254', 'Venta mostrador', 'Carlos Pérez', 850000, 'Completado', 'Ingreso'],
      ['EGR-000562', 'Pago a proveedores', 'María López', 2400000, 'Completado', 'Gasto'],
      ['ING-001253', 'Pago factura #001250', 'Ana Rodríguez', 1250000, 'Completado', 'Ingreso'],
      ['EGR-000561', 'Servicios públicos', 'Empresa de energía', 450000, 'Pendiente', 'Gasto'],
      ['ING-001252', 'Venta en línea', 'Tienda ORVIA', 3200000, 'Completado', 'Ingreso'],
    ],
    { kinds: ['Ingreso', 'Gasto', 'Transferencia'] },
  ),
  ventas: createDefinition(
    'ventas',
    'Ventas',
    '▧',
    'Pedidos, clientes y ventas registradas en todos tus canales.',
    'venta',
    'Producto o servicio',
    'Cliente',
    'Total (COP)',
    [
      ['VTA-001254', 'Venta de productos', 'Carlos Pérez', 1250000, 'Completado', 'Venta'],
      ['VTA-001253', 'Pedido en línea', 'María Rodríguez', 850000, 'En proceso', 'Venta'],
      ['VTA-001252', 'Venta mayorista', 'Distribuciones Andinas', 12450000, 'Pendiente', 'Venta'],
      ['VTA-001251', 'Venta mostrador', 'Laura Torres', 620000, 'Completado', 'Venta'],
    ],
  ),
  inventario: createDefinition(
    'inventario',
    'Inventario',
    '▤',
    'Controla productos, existencias y alertas de inventario.',
    'producto',
    'Nombre del producto',
    'Categoría / almacén',
    'Valor unitario (COP)',
    [
      ['SKU-001', 'Camiseta ORVIA', 'Almacén principal · Ropa', 280000, 'En proceso', 'Producto'],
      ['SKU-002', 'Cemento gris 50 kg', 'Almacén norte · Insumos', 38000, 'Pendiente', 'Producto'],
      ['SKU-003', 'Silla ergonómica', 'Almacén principal · Oficina', 625000, 'Completado', 'Producto'],
      ['SKU-004', 'Papel carta x 500', 'Almacén sur · Oficina', 24500, 'Completado', 'Producto'],
    ],
    {
      columns: [
        { key: 'reference', label: 'SKU' },
        { key: 'name', label: 'Producto' },
        { key: 'party', label: 'Almacén / categoría' },
        { key: 'amount', label: 'Valor unitario' },
        { key: 'status', label: 'Existencia' },
      ],
    },
  ),
  compras: createDefinition(
    'compras',
    'Compras',
    '▰',
    'Resumen y seguimiento de las compras de tu empresa.',
    'compra',
    'Descripción de la compra',
    'Proveedor',
    'Total (COP)',
    [
      ['COM-000156', 'Materia prima', 'Textiles del Valle S.A.S.', 28750000, 'Completado', 'Compra'],
      ['COM-000155', 'Insumos industriales', 'Insumos Industriales S.A.S.', 15680000, 'En proceso', 'Compra'],
      ['COM-000154', 'Empaques y embalaje', 'Empaques del Sur S.A.S.', 12950000, 'Pendiente', 'Compra'],
      ['COM-000153', 'Químicos y solventes', 'Químicos del Norte', 9850000, 'Pendiente', 'Compra'],
    ],
  ),
  clientes: createDefinition(
    'clientes',
    'Clientes',
    '♧',
    'Directorio de clientes, contacto y valor de compra acumulado.',
    'cliente',
    'Nombre del cliente',
    'Correo electrónico',
    'Compras acumuladas (COP)',
    [
      ['CLI-00081', 'Carlos Pérez', 'carlos@example.com', 5820000, 'Completado', 'Cliente'],
      ['CLI-00082', 'María Rodríguez', 'maria@example.com', 3840000, 'Completado', 'Cliente'],
      ['CLI-00083', 'Distribuciones Andinas', 'ventas@example.com', 24800000, 'Completado', 'Cliente'],
      ['CLI-00084', 'Laura Torres', 'laura@example.com', 620000, 'Pendiente', 'Cliente'],
    ],
  ),
  operacion: createDefinition(
    'operacion',
    'Operación',
    '⚒',
    'Seguimiento de las tareas y actividades operativas de tu empresa.',
    'actividad',
    'Actividad',
    'Responsable',
    'Costo estimado (COP)',
    [
      ['ACT-0024', 'Revisión de inventario', 'Pedro Gómez', 350000, 'En proceso', 'Operación'],
      ['ACT-0023', 'Preparar despacho', 'Ana Rodríguez', 180000, 'Pendiente', 'Operación'],
      ['ACT-0022', 'Mantenimiento de equipos', 'Luis Ramírez', 420000, 'Completado', 'Operación'],
      ['ACT-0021', 'Revisión de pedidos', 'Carlos Pérez', 0, 'Completado', 'Operación'],
    ],
  ),
  proveedores: createDefinition(
    'proveedores',
    'Proveedores',
    '♙',
    'Directorio y evaluación de proveedores.',
    'proveedor',
    'Razón social',
    'Correo de contacto',
    'Compras acumuladas (COP)',
    [
      ['PRO-001', 'Textiles del Valle S.A.S.', 'ventas@textiles.com', 48250000, 'Completado', 'Proveedor'],
      ['PRO-002', 'Empaques del Sur S.A.S.', 'ventas@empaques.com', 10950000, 'Completado', 'Proveedor'],
      ['PRO-003', 'Químicos y Solventes S.A.S.', 'info@quimicos.com', 8475000, 'Pendiente', 'Proveedor'],
      ['PRO-004', 'Accesorios Premium S.A.S.', 'contacto@accesorios.com', 6850000, 'Completado', 'Proveedor'],
    ],
  ),
  solicitudes: createDefinition(
    'solicitudes',
    'Solicitudes',
    '▣',
    'Solicitudes internas y su estado de aprobación.',
    'solicitud',
    'Motivo de solicitud',
    'Solicitante / área',
    'Valor estimado (COP)',
    [
      ['SOL-00126', 'Compra de insumos', 'Andrea López · Compras', 18750000, 'Pendiente', 'Solicitud'],
      ['SOL-00125', 'Equipo para bodega', 'Carlos Ramírez · Almacén', 7840000, 'Completado', 'Solicitud'],
      ['SOL-00124', 'Material de producción', 'María Gómez · Producción', 24360000, 'Pendiente', 'Solicitud'],
      ['SOL-00123', 'Mantenimiento', 'Juan López · Operación', 3950000, 'En proceso', 'Solicitud'],
    ],
  ),
  'ordenes-compra': createDefinition(
    'ordenes-compra',
    'Órdenes de compra',
    '▤',
    'Órdenes emitidas, entregas pendientes y valores comprados.',
    'orden de compra',
    'Material / concepto',
    'Proveedor',
    'Total (COP)',
    [
      ['OC-00028', 'Cemento gris', 'Concretos del Sur S.A.S.', 12450000, 'Pendiente', 'Compra'],
      ['OC-00027', 'Materia prima', 'Canteras Andinas S.A.S.', 28760000, 'En proceso', 'Compra'],
      ['OC-00026', 'Material industrial', 'Áridos del Valle', 18200000, 'Completado', 'Compra'],
      ['OC-00025', 'Transporte y maquinaria', 'Transportes S.A.S.', 7500000, 'Pendiente', 'Compra'],
    ],
  ),
  recepciones: createDefinition(
    'recepciones',
    'Recepciones',
    '▧',
    'Recepción de pedidos y seguimiento de cantidades entregadas.',
    'recepción',
    'Material recibido',
    'Proveedor / orden',
    'Valor recibido (COP)',
    [
      ['REC-00024', 'Cemento gris · 60 unidades', 'Canteras Andinas · OC-00027', 2876000, 'Pendiente', 'Recepción'],
      ['REC-00023', 'Materia prima · 35 unidades', 'Áridos del Valle · OC-00026', 4200000, 'En proceso', 'Recepción'],
      ['REC-00022', 'Repuestos · 120 unidades', 'Insumos Industriales', 1680000, 'Completado', 'Recepción'],
      ['REC-00021', 'Tubería PVC · 50 unidades', 'Ferretería Central', 925000, 'Completado', 'Recepción'],
    ],
  ),
  'cuentas-por-pagar': createDefinition(
    'cuentas-por-pagar',
    'Cuentas por pagar',
    '＄',
    'Administra vencimientos, saldos pendientes y pagos a proveedores.',
    'cuenta',
    'Factura / concepto',
    'Proveedor',
    'Saldo pendiente (COP)',
    [
      ['FAC-2025-00456', 'Triturado 3/4 · Factura', 'Áridos y Rocas del Valle', 18920000, 'Pendiente', 'Cuenta'],
      ['FAC-2025-00455', 'Triturado 1/2 · Factura', 'Canteras Andinas S.A.S.', 28760000, 'Pendiente', 'Cuenta'],
      ['FAC-2025-00454', 'Transporte de material', 'Transportes S.A.S.', 7500000, 'En proceso', 'Cuenta'],
      ['FAC-2025-00453', 'Arena triturada', 'Concretos del Sur S.A.S.', 6800000, 'Completado', 'Cuenta'],
    ],
  ),
  pagos: createDefinition(
    'pagos',
    'Pagos',
    '▣',
    'Consulta pagos realizados, programados y en proceso.',
    'pago',
    'Concepto / documento',
    'Beneficiario',
    'Monto (COP)',
    [
      ['PAG-2025-00456', 'Transferencia bancaria', 'Áridos y Rocas del Valle', 18920000, 'Completado', 'Pago'],
      ['PAG-2025-00455', 'Pago factura FAC-00453', 'Concretos del Sur S.A.S.', 6800000, 'En proceso', 'Pago'],
      ['PAG-2025-00454', 'Compra de material', 'Canteras Andinas S.A.S.', 28760000, 'Pendiente', 'Pago'],
      ['PAG-2025-00453', 'Pago de servicios', 'Servicios públicos', 450000, 'Completado', 'Pago'],
    ],
  ),
  reportes: createDefinition(
    'reportes',
    'Reportes',
    '▥',
    'Consulta y registra reportes operativos y financieros.',
    'reporte',
    'Nombre del reporte',
    'Responsable / área',
    'Valor reportado (COP)',
    [
      ['REP-00018', 'Resumen de ventas', 'Administración', 98450000, 'Completado', 'Reporte'],
      ['REP-00017', 'Movimientos de inventario', 'Almacén', 87630000, 'Completado', 'Reporte'],
      ['REP-00016', 'Estado de pagos', 'Finanzas', 36500000, 'En proceso', 'Reporte'],
      ['REP-00015', 'Recepciones del periodo', 'Compras', 27800000, 'Pendiente', 'Reporte'],
    ],
  ),
  configuracion: createDefinition(
    'configuracion',
    'Configuración',
    '⚙',
    'Administra parámetros y preferencias generales de ORVIA.',
    'parámetro',
    'Nombre del parámetro',
    'Categoría',
    'Valor numérico',
    [
      ['CFG-001', 'Capacidad estándar', 'Unidades y materiales', 12000000, 'Completado', 'Parámetro'],
      ['CFG-002', 'Tiempo máximo en planta', 'Operaciones', 45, 'Completado', 'Parámetro'],
      ['CFG-003', 'Numeración de facturas', 'Documentos', 20250001, 'Completado', 'Parámetro'],
      ['CFG-004', 'Alertas de inventario', 'Notificaciones', 5, 'En proceso', 'Parámetro'],
    ],
  ),
};

export function isModuleSlug(value: unknown): value is ModuleSlug {
  return typeof value === 'string' && Object.hasOwn(BUSINESS_MODULES, value);
}
