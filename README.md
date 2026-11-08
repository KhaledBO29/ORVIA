# ORVIA | Dashboard

Proyecto de aprendizaje: reproducción en Angular del dashboard y los módulos de ORVIA de las referencias compartidas.

## Requisitos

- Node.js 24 LTS (o una version compatible con Angular CLI 22).
- npm.

## Ejecutar

```powershell
npm install
npm start
```

Abre `http://localhost:4200`. Para compilar y ejecutar las pruebas:

```powershell
npm run build
npm test -- --watch=false
```

## Aprender componente por componente

Lee [`docs/guia.md`](docs/guia.md). Explica la estructura, las rutas, los componentes standalone, las señales, los formularios reactivos, `*ngFor`, `ngClass`, las tareas y el registro principal.

Las pestañas incluyen formularios de demostración, búsqueda, filtros y acciones sobre registros. El registro principal alimenta el resumen de Finanzas. Los datos se guardan en `localStorage` del navegador y no se sincronizan con un servidor.

## Ramas y pull requests

Cada componente se trabaja en su rama `feat/...` desde `develop`, con un commit `Feat: ...`. La plantilla esta en `.github/PULL_REQUEST_TEMPLATE.md`.

El proyecto está conectado a `https://github.com/KhaledBO29/ORVIA`. La guía documenta las ramas, commits y PR sugeridos.
