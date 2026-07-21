# Apoyemos Juntos — Sorteos

Plataforma de sorteos benéficos: landing pública, registro de participantes (cédula +
contraseña), carga de facturas con lectura automática por IA, conversión de colones a
dólares vía BCCR, y panel de administración para gestionar sorteos, patrocinadores y
aprobar/rechazar facturas.

Se despliega en **Coolify** (self-hosted), vía Docker.

## Recursos que necesita el deploy en Coolify

1. **Postgres**: un recurso de base de datos Postgres dentro de Coolify (o cualquier
   Postgres accesible). Da un `DATABASE_URL`.
2. **MinIO**: un recurso MinIO dentro de Coolify (S3-compatible) para guardar las
   imágenes de factura. Da `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, y
   hay que crear un bucket (`S3_BUCKET`).
3. **Vercel AI Gateway**: `AI_GATEWAY_API_KEY` para la lectura automática de facturas
   (funciona igual fuera de Vercel, es solo una API).
4. **BCCR**: registrarse gratis en
   https://www.bccr.fi.cr/indicadores-economicos/servicio-web con un correo
   institucional para obtener `BCCR_TOKEN`.
5. **AUTH_SECRET**: cualquier string aleatorio largo (`openssl rand -base64 32`).
6. **CRON_SECRET**: string aleatorio para proteger `/api/cron/tipo-cambio` — configurar
   una tarea programada en Coolify (o cualquier cron) que le pegue una vez al día con
   `Authorization: Bearer <CRON_SECRET>`.

Copiá `.env.local.example` a `.env.local` y completá esos valores para desarrollo local;
en Coolify se cargan como variables de entorno del servicio.

## Primer arranque (local)

```bash
npm install
npm run db:push     # crea las tablas a partir de lib/db/schema.ts
npm run db:seed      # crea un usuario admin y un sorteo de prueba
npm run dev
```

El seed crea un admin con cédula `1-0000-0000` y clave `cambiar-esta-clave` (o los
valores de `SEED_ADMIN_CEDULA` / `SEED_ADMIN_PASSWORD` si los definís antes de correr
`db:seed`). Entrá a `/admin/login` con esas credenciales y cambiá la clave cuanto antes.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm run start` — build y servidor de producción
- `npm run db:generate` — genera migraciones SQL a partir de `lib/db/schema.ts`
- `npm run db:push` — aplica el schema directo a la base de datos (desarrollo)
- `npm run db:studio` — abre Drizzle Studio para inspeccionar la base de datos
- `npm run db:seed` — crea el admin y datos de prueba

## Estructura

- `lib/db/schema.ts` — modelo de datos (usuarios, sorteos, patrocinadores, premios,
  facturas, cache de tipo de cambio)
- `lib/actions/` — Server Actions (auth, facturas, admin)
- `lib/ai/extract-invoice.ts` — lectura automática de facturas con IA de visión
- `lib/bccr/` — integración con el tipo de cambio del BCCR (con cache y fallback)
- `lib/storage/s3.ts` — almacenamiento de facturas (S3-compatible, apunta a MinIO)
- `app/admin/` — panel de administración (protegido por `proxy.ts`)
- `app/cuenta/` — panel de usuario (protegido por `proxy.ts`)

## Verificación end-to-end sugerida

1. Registrate en `/registro`, iniciá sesión con tu cédula.
2. Como admin (`/admin/login`), creá un sorteo, un patrocinador y un premio.
3. Poné el sorteo en estado "Activo" desde `/admin/sorteos`.
4. Como participante, subí una foto o PDF de una factura de prueba en `/cuenta/facturas/nueva`.
5. Como admin, revisá la factura en `/admin/facturas`: verificá los datos que leyó la
   IA, corregilos si hace falta, y aprobala.
6. Confirmá que las acciones aparecen en `/cuenta` y en `/admin/usuarios`.
7. Probá subir la misma factura otra vez al mismo sorteo — debe rechazarse por
   duplicado.

## Deploy en Coolify

El repo incluye un `Dockerfile` (build multi-stage, salida `standalone` de Next.js).
En Coolify: crear una nueva aplicación apuntando a este repo, tipo de build "Dockerfile",
puerto `3000`, y cargar las variables de entorno de la sección anterior. Hay un webhook
de GitHub configurado (Settings → Webhooks del repo) que dispara un redeploy automático
en cada push a `main`; también se puede redeployar a mano desde el dashboard de Coolify.
