import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { tipoCambioCache } from "@/lib/db/schema";
import { consultarTipoCambioBccr } from "./client";

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export type TipoCambio = {
  compra: number;
  venta: number;
  fuente: "bccr_live" | "fallback";
  fecha: string;
};

export async function obtenerTipoCambio(): Promise<TipoCambio> {
  const db = getDb();
  const fecha = hoyISO();

  const [existente] = await db
    .select()
    .from(tipoCambioCache)
    .where(eq(tipoCambioCache.fecha, fecha))
    .limit(1);

  if (existente) {
    return {
      compra: Number(existente.compra),
      venta: Number(existente.venta),
      fuente: existente.fuente,
      fecha: existente.fecha,
    };
  }

  try {
    const { compra, venta } = await consultarTipoCambioBccr(new Date());
    await db
      .insert(tipoCambioCache)
      .values({ fecha, compra: String(compra), venta: String(venta), fuente: "bccr_live" })
      .onConflictDoNothing();
    return { compra, venta, fuente: "bccr_live", fecha };
  } catch (error) {
    console.warn("BCCR no disponible, usando último tipo de cambio cacheado", error);
    const [ultimo] = await db
      .select()
      .from(tipoCambioCache)
      .orderBy(desc(tipoCambioCache.fecha))
      .limit(1);

    if (!ultimo) {
      throw new Error(
        "No hay tipo de cambio disponible: el BCCR falló y no existe ningún valor cacheado."
      );
    }

    return {
      compra: Number(ultimo.compra),
      venta: Number(ultimo.venta),
      fuente: "fallback",
      fecha: ultimo.fecha,
    };
  }
}
