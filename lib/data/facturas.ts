import { and, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { facturas, sorteos } from "@/lib/db/schema";

export async function getFacturasDeUsuario(usuarioId: string) {
  const db = getDb();
  return db
    .select({
      id: facturas.id,
      numeroControl: facturas.numeroControl,
      monto: facturas.monto,
      moneda: facturas.moneda,
      montoUsd: facturas.montoUsd,
      accionesAcreditadas: facturas.accionesAcreditadas,
      estado: facturas.estado,
      motivoRechazo: facturas.motivoRechazo,
      creadoEn: facturas.creadoEn,
      sorteoNombre: sorteos.nombre,
      sorteoId: sorteos.id,
    })
    .from(facturas)
    .innerJoin(sorteos, eq(sorteos.id, facturas.sorteoId))
    .where(eq(facturas.usuarioId, usuarioId))
    .orderBy(desc(facturas.creadoEn));
}

export async function getResumenAccionesPorSorteo(usuarioId: string) {
  const db = getDb();
  return db
    .select({
      sorteoId: sorteos.id,
      sorteoNombre: sorteos.nombre,
      acciones: sql<number>`coalesce(sum(${facturas.accionesAcreditadas}), 0)`,
    })
    .from(facturas)
    .innerJoin(sorteos, eq(sorteos.id, facturas.sorteoId))
    .where(and(eq(facturas.usuarioId, usuarioId), eq(facturas.estado, "aprobada")))
    .groupBy(sorteos.id, sorteos.nombre);
}
