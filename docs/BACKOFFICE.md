# Back Office y Roles

## Roles
- `admin`: acceso total a moderación y configuración
- `moderator`: puede ver/editar estado de reseñas y submissions
- `user`: por defecto

Asigna rol a tu usuario (SQL en Supabase):

```sql
update public.users set roles = array_append(roles,'moderator') where email = 'tu@email.com';
-- o admin
update public.users set roles = array_append(roles,'admin') where email = 'tu@email.com';
```

## Políticas RLS relevantes
- Funciones `is_admin(uid)` e `is_moderator(uid)`
- `reviews`: insertar (autor), seleccionar (públicas/propias/mod), actualizar (mod), borrar (autor/admin)
- `submissions`: seleccionar/actualizar (mod)

## Uso
- Accede a `/admin` con un usuario con rol `moderator` o `admin`.
- Secciones:
  - Reseñas pendientes: aprobar/rechazar
  - Altas pendientes (submissions): aprobar/rechazar

## Notas
- Las reseñas creadas por usuarios quedan en `pending` hasta aprobación.
- Aprobadas quedan visibles para todos en el detalle del evento.
- Este MVP no crea automáticamente clubs/eventos desde submissions aprobadas; puede añadirse en un siguiente paso.
