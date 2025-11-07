# NightHub Mallorca (MVP)

Guía inteligente del ocio nocturno de Mallorca. PWA + base de datos (Supabase) lista para ampliarse a app móvil (Expo) más adelante.

## Estado

Este repo contiene el esqueleto del MVP: estructura, pantallas básicas, i18n y esquema SQL. Aún no se han instalado dependencias.

## Estructura

- `apps/web` — Next.js (App Router) con tema oscuro/neón e i18n (ES/EN/DE)
- `supabase/schema.sql` — Tablas núcleo, vistas y semillas mínimas
- `docs/PRODUCT.md` — Visión, alcance MVP y roadmap

## Requisitos

- Node.js LTS 20+
- pnpm o npm
- Cuenta de Supabase (o Postgres local con PostGIS)

## Puesta en marcha (local)

1) Web

```bash
cd apps/web
pnpm install   # o npm install
pnpm dev       # o npm run dev
```

2) Base de datos (Supabase)

- Crea un proyecto en Supabase.
- Ejecuta `supabase/schema.sql` en el SQL editor.
- Copia tus credenciales en `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3) Opcional: Datos reales en la web

- Instala `@supabase/supabase-js` (ya declarado en package.json) y usa `lib/supabase.ts`.
- Sustituye los mocks de `app/page.tsx` por lecturas de `events_public`.

4) Seguimiento de referidos

- El botón “Reservar” usa `/api/out?event=...` para registrar un click en `clicks` y redirigir a `url_referral` del evento.

5) Altas de clubs/eventos

- El formulario en `/promote` inserta en `submissions`. La política `submissions_insert_public` permite inserciones anónimas.

6) Autenticación y favoritos/seguidos

- La pantalla `/auth` usa Supabase Auth (email/contraseña).
- Al iniciar sesión se crea (si no existe) el registro en `public.users` con tu `auth.uid()`.
- Botones de “Guardar” en eventos y “Seguir” en clubs escriben en `favorites`/`follows` con RLS por usuario.

## Rutas (MVP)

- `/` Descubrir eventos + filtros
- `/event/[id]` Detalle de evento
- `/club/[id]` Ficha de club/DJ
- `/favorites` Favoritos y alertas
- `/auth` Login/registro (placeholder)
- `/promote` Formulario de alta de club
- `/admin` Back office (placeholder con RBAC a futuro)

## Scripts útiles (por definir tras instalar)

- `dev` — arranca el servidor de desarrollo
- `lint`, `build`, `start` — estándar Next.js

## Estilo de UI

- Modo oscuro, acentos neón (cian/magenta) y dorado premium
- Componentes básicos en `apps/web/components`

## Roadmap corto

1. Conectar datos reales desde Supabase (RLS + policies)
2. Autenticación y favoritos/seguidos
3. Tracking de referidos y clics de salida
4. Notificaciones (Expo/FCM) y recomendaciones básicas
