# Guia de aprendizaje: dashboard ORVIA

El proyecto reproduce la pantalla **Inicio** y las demás pestañas de las referencias con registros de demostración funcionales.

## 1. Arranque y estructura

```powershell
npm start
```

Abre `http://localhost:4200`. El proyecto usa componentes standalone: cada componente importa las directivas y componentes que usa directamente, sin un `AppModule`.

```text
src/app/
  app.ts                         # componente raiz
  app.routes.ts                  # rutas
  core/task-store.service.ts     # estado de tareas y persistencia
  core/business-records.service.ts # datos y operaciones CRUD de módulos
  shared/                        # piezas reutilizables
  shared/record-register/        # búsqueda, tabla, filtros y acciones
  shared/module-summary/         # tarjetas y resumen financiero
  features/dashboard/            # composicion de Inicio
  features/operations/           # datos semilla y modelos de módulos
  features/modules/              # registro, finanzas y módulos relacionados
```

`RouterOutlet` en `app.html` es el espacio donde Angular muestra la pagina correspondiente a la ruta. La barra lateral usa `RouterLink` para navegar.

## 2. Componentes y comunicacion

La pagina de dashboard combina barra lateral, encabezado, tarjetas KPI, grafico, actividad, alertas, accesos rapidos y flujo de tareas. El padre de las tareas conserva el estado; `TaskFlowComponent` recibe la lista con `input()` y avisa acciones con `output()`. Este flujo de datos hace explicita la comunicacion entre componentes.

Los componentes pequenos reciben sus datos por entradas. Por ejemplo, `MetricCardComponent` presenta una metrica y su tendencia; no necesita conocer de donde vienen los datos.

## 3. Signals y estado derivado

`TaskStoreService` mantiene la lista en un `signal`. Al marcar una casilla, actualiza la lista de forma inmutable y una `computed` vuelve a calcular cuantas tareas estan completas. Las señales notifican a la vista sin suscripciones manuales.

Las tareas se guardan bajo la clave `orvia-dashboard-tasks` en `localStorage`. Puedes marcar una tarea, recargar el navegador y comprobar que sigue marcada. No guardes contrasenas ni datos sensibles en `localStorage`.

Los registros de cada módulo se guardan por separado con la clave `orvia-records:<modulo>`. También se guardan solo en este navegador; no se sincronizan entre equipos y no reemplazan una API o base de datos.

## 4. ngFor, condicionales y ngClass

`TaskFlowComponent` recorre las tareas con `*ngFor` (importa `CommonModule` en el componente standalone). El template combina el control `@if` para mostrar el estado vacio y `[ngClass]` para aplicar un estilo diferente a las tareas completadas. La casilla llama un metodo del componente con `(change)`.

## 5. Formularios reactivos

El formulario para agregar una tarea usa `FormBuilder` y `Validators.required`. El formulario no se envia cuando el texto esta vacio; al enviarlo, el componente emite la nueva tarea al padre y limpia el campo.

## 7. Pestañas y registro principal

Las rutas de Finanzas, Ventas, Inventario, Compras, Clientes, Operación, Proveedores, Solicitudes, Órdenes de compra, Recepciones, Cuentas por pagar, Pagos, Reportes y Configuración usan un componente de módulo reutilizable. Su definición y datos de demostración están en `features/operations/business-modules.ts`.

El **Registro principal** (`/registro-principal`) reúne ingresos, gastos, ventas y compras. En cada pestaña puedes buscar, filtrar por estado, añadir y editar un registro con un formulario reactivo, marcarlo como completado y eliminarlo. Al cambiar los datos, el servicio actualiza el `signal` y los conserva en `localStorage`.

No se conecta un backend: los datos son ejemplos para aprender Angular. Borrar los datos del sitio en el navegador reinicia el almacenamiento; no compartas registros reales ni información sensible en esta demostración.

Finanzas usa el registro principal como fuente de movimientos: las nuevas operaciones, los estados y las eliminaciones aparecen en el resumen y en la tabla de Finanzas. Los demás módulos mantienen su propia lista de ejemplo.

### Probar la demostración

1. Abre **Registro principal** y agrega un ingreso o un gasto.
2. Busca el registro, márcalo como completado y comprueba que las métricas se actualicen.
3. Abre **Finanzas** para ver el balance de ingresos y gastos.
4. Prueba los filtros, el botón de eliminar y los accesos a módulos relacionados.
5. Recarga la página: los cambios permanecen en el mismo navegador.

La pestaña **Finanzas** y todas las opciones del menú incluyen datos de ejemplo y una tabla registrable. La pantalla comparte componentes de presentación para que el código del CRUD no se duplique, pero cada ruta tiene su propia definición, columnas, formulario y conjunto de datos.

## 6. Ramas, commits y PR

Se trabaja **un componente por rama**. El historial inicial está dividido por contenido y se publica en ramas `feature/...`:

| Componente | Rama | Commit |
|---|---|---|
| Aplicación Angular, navegación, dashboard y tareas | `feature/dashboard` | `Feat: Crear dashboard empresarial y estructura Angular` |
| Registro principal, datos y almacenamiento | `feature/registro-principal` | `Feat: Crear registro principal de operaciones` |
| Finanzas y CRUD de módulos empresariales | `feature/gestion-modulos` | `Feat: Habilitar registros CRUD para módulos empresariales` |
| Documentación de componentes y plantilla PR | `feature/documentacion-angular` | `Feat: Documentar arquitectura y flujo de aprendizaje` |

Cada rama feature posterior parte de la anterior, por lo que las solicitudes de cambios se deben revisar y fusionar en ese orden:

```powershell
git switch develop
git pull origin develop
git switch -c feature/nuevo-componente
# Implementa y comprueba el componente.
git add ruta/al/componente
git commit -m "Feat: Agregar el nuevo componente"
git push -u origin feature/nuevo-componente
```

En GitHub, crea un PR de cada rama de la tabla hacia `develop` y completa `.github/PULL_REQUEST_TEMPLATE.md`. Fusiona los PR en el mismo orden para que los cambios apilados queden integrados correctamente.

### Estado de esta entrega

El repositorio remoto tiene `main` y `develop`; ya se publicaron `feature/dashboard`, `feature/registro-principal` y `feature/gestion-modulos`. **No se han creado PR**. Al completar la guía, publica la rama `feature/documentacion-angular` y crea los PR en el orden de la tabla.

Los commits se atribuyen al usuario Git configurado en el equipo. No se añadió ningún `Co-authored-by` ni colaborador adicional.
