import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { sorteos, premios, patrocinadores, facturas } from "@/lib/db/schema";

export async function getSorteosActivos() {
  const db = getDb();

  const filas = await db
    .select({
      sorteo: sorteos,
      premio: premios,
      patrocinador: patrocinadores,
    })
    .from(sorteos)
    .leftJoin(premios, eq(premios.sorteoId, sorteos.id))
    .leftJoin(patrocinadores, eq(patrocinadores.id, premios.patrocinadorId))
    .where(eq(sorteos.estado, "activo"))
    .orderBy(sorteos.fechaSorteo);

  const accionesPorSorteo = await getAccionesAcreditadasPorSorteo();

  const sorteosMap = new Map<
    string,
    {
      sorteo: typeof sorteos.$inferSelect;
      premios: { descripcion: string; patrocinador: string }[];
    }
  >();

  for (const fila of filas) {
    if (!sorteosMap.has(fila.sorteo.id)) {
      sorteosMap.set(fila.sorteo.id, { sorteo: fila.sorteo, premios: [] });
    }
    if (fila.premio && fila.patrocinador) {
      sorteosMap.get(fila.sorteo.id)!.premios.push({
        descripcion: fila.premio.descripcion,
        patrocinador: fila.patrocinador.nombre,
      });
    }
  }

  return Array.from(sorteosMap.values()).map(({ sorteo, premios }) => ({
    ...sorteo,
    premios,
    accionesAcreditadas: accionesPorSorteo.get(sorteo.id) ?? 0,
  }));
}

export async function getSorteoDetalle(sorteoId: string) {
  const db = getDb();

  const [sorteo] = await db.select().from(sorteos).where(eq(sorteos.id, sorteoId)).limit(1);
  if (!sorteo) return null;

  const filas = await db
    .select({ premio: premios, patrocinador: patrocinadores })
    .from(premios)
    .innerJoin(patrocinadores, eq(patrocinadores.id, premios.patrocinadorId))
    .where(eq(premios.sorteoId, sorteoId));

  const accionesPorSorteo = await getAccionesAcreditadasPorSorteo();

  return {
    ...sorteo,
    premios: filas.map((f) => ({
      descripcion: f.premio.descripcion,
      patrocinador: f.patrocinador.nombre,
    })),
    accionesAcreditadas: accionesPorSorteo.get(sorteoId) ?? 0,
  };
}

async function getAccionesAcreditadasPorSorteo() {
  const db = getDb();
  const filas = await db
    .select({
      sorteoId: facturas.sorteoId,
      total: sql<number>`coalesce(sum(${facturas.accionesAcreditadas}), 0)`,
    })
    .from(facturas)
    .where(and(eq(facturas.estado, "aprobada")))
    .groupBy(facturas.sorteoId);

  return new Map(filas.map((f) => [f.sorteoId, Number(f.total)]));
}

export async function getSorteosParaSelector() {
  const db = getDb();
  return db
    .select({ id: sorteos.id, nombre: sorteos.nombre })
    .from(sorteos)
    .where(eq(sorteos.estado, "activo"))
    .orderBy(sorteos.nombre);
}
