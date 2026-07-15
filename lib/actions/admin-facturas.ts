"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { facturas } from "@/lib/db/schema";
import { obtenerTipoCambio } from "@/lib/bccr/cache";
import { calcularAcciones } from "@/lib/acciones";
import { requireAdmin } from "./admin-guard";

export type AprobarFacturaState = { error?: string };

export async function aprobarFactura(
  facturaId: string,
  datosCorregidos: { numeroControl: string; nombre: string; monto: number; moneda: "USD" | "CRC" }
): Promise<AprobarFacturaState> {
  const admin = await requireAdmin();
  const db = getDb();

  try {
    await db.transaction(async (tx) => {
      const [factura] = await tx
        .select()
        .from(facturas)
        .where(eq(facturas.id, facturaId))
        .for("update");

      if (!factura) {
        throw new Error("La factura ya no existe.");
      }
      if (factura.estado !== "pendiente") {
        throw new Error("Esta factura ya fue revisada.");
      }

      const [duplicada] = await tx
        .select({ id: facturas.id })
        .from(facturas)
        .where(
          and(
            eq(facturas.sorteoId, factura.sorteoId),
            eq(facturas.numeroControl, datosCorregidos.numeroControl),
            eq(facturas.estado, "aprobada"),
            ne(facturas.id, facturaId)
          )
        )
        .limit(1);

      if (duplicada) {
        throw new Error(
          "Ya existe otra factura aprobada con ese número de control en este sorteo."
        );
      }

      let montoUsd = datosCorregidos.monto;
      let tipoCambioUsado: number | null = null;
      if (datosCorregidos.moneda === "CRC") {
        const tipoCambio = await obtenerTipoCambio();
        tipoCambioUsado = tipoCambio.venta;
        montoUsd = datosCorregidos.monto / tipoCambio.venta;
      }

      const accionesAcreditadas = calcularAcciones(montoUsd);

      await tx
        .update(facturas)
        .set({
          numeroControl: datosCorregidos.numeroControl,
          monto: String(datosCorregidos.monto),
          moneda: datosCorregidos.moneda,
          tipoCambioUsado: tipoCambioUsado !== null ? String(tipoCambioUsado) : null,
          montoUsd: String(montoUsd),
          accionesAcreditadas,
          estado: "aprobada",
          revisadoPor: admin.id,
          revisadoEn: new Date(),
        })
        .where(eq(facturas.id, facturaId));
    });
  } catch (error) {
    return { error: (error as Error).message };
  }

  revalidatePath("/admin/facturas");
  revalidatePath("/admin/usuarios");
  return {};
}

export async function rechazarFactura(
  facturaId: string,
  motivo: string
): Promise<AprobarFacturaState> {
  const admin = await requireAdmin();
  if (!motivo.trim()) {
    return { error: "Ingresá el motivo del rechazo." };
  }

  const db = getDb();
  await db
    .update(facturas)
    .set({
      estado: "rechazada",
      motivoRechazo: motivo.trim(),
      revisadoPor: admin.id,
      revisadoEn: new Date(),
    })
    .where(and(eq(facturas.id, facturaId), eq(facturas.estado, "pendiente")));

  revalidatePath("/admin/facturas");
  return {};
}
