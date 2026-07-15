"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { subirArchivo, eliminarArchivo } from "@/lib/storage/s3";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { facturas, sorteos } from "@/lib/db/schema";
import { extractInvoiceData } from "@/lib/ai/extract-invoice";
import { obtenerTipoCambio } from "@/lib/bccr/cache";
import { calcularAcciones } from "@/lib/acciones";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const TAMANO_MAXIMO = 8 * 1024 * 1024; // 8MB

export type CrearFacturaState = {
  error?: string;
  ok?: boolean;
};

export async function crearFactura(
  _prevState: CrearFacturaState,
  formData: FormData
): Promise<CrearFacturaState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Debés iniciar sesión." };
  }

  const sorteoId = String(formData.get("sorteoId") ?? "");
  const file = formData.get("factura");

  if (!sorteoId) {
    return { error: "Elegí un sorteo." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Adjuntá la imagen o PDF de tu factura." };
  }
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    return { error: "Formato no soportado. Usá JPG, PNG, WEBP o PDF." };
  }
  if (file.size > TAMANO_MAXIMO) {
    return { error: "El archivo es demasiado grande (máximo 8MB)." };
  }

  const db = getDb();

  const [sorteo] = await db
    .select()
    .from(sorteos)
    .where(eq(sorteos.id, sorteoId))
    .limit(1);

  if (!sorteo || sorteo.estado !== "activo") {
    return { error: "Ese sorteo no está disponible para participar." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const key = `facturas/${session.user.id}/${crypto.randomUUID()}-${file.name}`;
  let subida = false;

  try {
    await subirArchivo(key, buffer, file.type);
    subida = true;

    const extraccion = await extractInvoiceData(buffer, file.type);

    const moneda = extraccion.moneda ?? "CRC";
    const monto = extraccion.monto ?? 0;

    let montoUsd = monto;
    let tipoCambioUsado: number | null = null;
    if (moneda === "CRC") {
      const tipoCambio = await obtenerTipoCambio();
      tipoCambioUsado = tipoCambio.venta;
      montoUsd = monto / tipoCambio.venta;
    }

    if (extraccion.numeroControl) {
      const [duplicada] = await db
        .select({ id: facturas.id })
        .from(facturas)
        .where(
          and(
            eq(facturas.sorteoId, sorteoId),
            eq(facturas.numeroControl, extraccion.numeroControl)
          )
        )
        .limit(1);

      if (duplicada) {
        await eliminarArchivo(key);
        return {
          error: "Esta factura ya fue cargada anteriormente para este sorteo.",
        };
      }
    }

    await db.insert(facturas).values({
      usuarioId: session.user.id,
      sorteoId,
      archivoKey: key,
      iaNumeroControl: extraccion.numeroControl,
      iaNombre: extraccion.nombre,
      iaMonto: extraccion.monto !== null ? String(extraccion.monto) : null,
      iaMoneda: extraccion.moneda,
      numeroControl: extraccion.numeroControl,
      monto: String(monto),
      moneda,
      tipoCambioUsado: tipoCambioUsado !== null ? String(tipoCambioUsado) : null,
      montoUsd: String(montoUsd),
      accionesAcreditadas: 0,
      estado: "pendiente",
    });
  } catch (error) {
    if (subida) {
      await eliminarArchivo(key).catch(() => {});
    }
    console.error("Error procesando factura", error);
    return {
      error:
        "No pudimos procesar la factura. Verificá el archivo e intentá de nuevo.",
    };
  }

  revalidatePath("/cuenta/facturas");
  revalidatePath("/cuenta");
  return { ok: true };
}

export async function calcularAccionesEstimadas(montoUsd: number) {
  return calcularAcciones(montoUsd);
}
