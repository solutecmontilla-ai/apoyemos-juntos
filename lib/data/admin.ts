import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { sorteos, patrocinadores, premios, facturas, usuarios } from "@/lib/db/schema";

export async function listSorteosAdmin() {
  const db = getDb();
  return db.select().from(sorteos).orderBy(desc(sorteos.creadoEn));
}

export async function getSorteoAdmin(sorteoId: string) {
  const db = getDb();
  const [sorteo] = await db.select().from(sorteos).where(eq(sorteos.id, sorteoId)).limit(1);
  if (!sorteo) return null;

  const listaPremios = await db
    .select({ premio: premios, patrocinador: patrocinadores })
    .from(premios)
    .innerJoin(patrocinadores, eq(patrocinadores.id, premios.patrocinadorId))
    .where(eq(premios.sorteoId, sorteoId));

  return { sorteo, premios: listaPremios };
}

export async function listPatrocinadores() {
  const db = getDb();
  return db.select().from(patrocinadores).orderBy(patrocinadores.nombre);
}

export async function listFacturasPendientes() {
  const db = getDb();
  return db
    .select({
      factura: facturas,
      usuarioNombre: usuarios.nombreCompleto,
      usuarioCedula: usuarios.cedula,
      sorteoNombre: sorteos.nombre,
    })
    .from(facturas)
    .innerJoin(usuarios, eq(usuarios.id, facturas.usuarioId))
    .innerJoin(sorteos, eq(sorteos.id, facturas.sorteoId))
    .where(eq(facturas.estado, "pendiente"))
    .orderBy(facturas.creadoEn);
}

export async function listUsuariosConAcciones() {
  const db = getDb();

  const usuariosRows = await db
    .select({
      id: usuarios.id,
      nombreCompleto: usuarios.nombreCompleto,
      cedula: usuarios.cedula,
      telefono: usuarios.telefono,
      rol: usuarios.rol,
    })
    .from(usuarios)
    .orderBy(usuarios.nombreCompleto);

  const accionesRows = await db
    .select({
      usuarioId: facturas.usuarioId,
      sorteoNombre: sorteos.nombre,
      acciones: sql<number>`coalesce(sum(${facturas.accionesAcreditadas}), 0)`,
    })
    .from(facturas)
    .innerJoin(sorteos, eq(sorteos.id, facturas.sorteoId))
    .where(eq(facturas.estado, "aprobada"))
    .groupBy(facturas.usuarioId, sorteos.nombre);

  const accionesPorUsuario = new Map<string, { sorteoNombre: string; acciones: number }[]>();
  for (const row of accionesRows) {
    const lista = accionesPorUsuario.get(row.usuarioId) ?? [];
    lista.push({ sorteoNombre: row.sorteoNombre, acciones: Number(row.acciones) });
    accionesPorUsuario.set(row.usuarioId, lista);
  }

  return usuariosRows.map((u) => ({
    ...u,
    acciones: accionesPorUsuario.get(u.id) ?? [],
  }));
}
