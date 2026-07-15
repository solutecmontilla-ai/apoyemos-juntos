"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { sorteos } from "@/lib/db/schema";
import { requireAdmin } from "./admin-guard";

const sorteoSchema = z.object({
  nombre: z.string().trim().min(3),
  descripcion: z.string().trim().optional(),
  fechaSorteo: z.string().min(1),
  accionesTotales: z.coerce.number().int().positive(),
});

export type SorteoFormState = { error?: string };

export async function crearSorteo(
  _prevState: SorteoFormState,
  formData: FormData
): Promise<SorteoFormState> {
  await requireAdmin();

  const parsed = sorteoSchema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    fechaSorteo: formData.get("fechaSorteo"),
    accionesTotales: formData.get("accionesTotales"),
  });

  if (!parsed.success) {
    return { error: "Revisá los datos del sorteo." };
  }

  const db = getDb();
  await db.insert(sorteos).values({
    nombre: parsed.data.nombre,
    descripcion: parsed.data.descripcion || null,
    fechaSorteo: parsed.data.fechaSorteo,
    accionesTotales: parsed.data.accionesTotales,
    estado: "borrador",
  });

  revalidatePath("/admin/sorteos");
  return {};
}

export async function cambiarEstadoSorteo(sorteoId: string, estado: "borrador" | "activo" | "cerrado") {
  await requireAdmin();
  const db = getDb();
  await db.update(sorteos).set({ estado }).where(eq(sorteos.id, sorteoId));
  revalidatePath("/admin/sorteos");
  revalidatePath(`/admin/sorteos/${sorteoId}`);
  revalidatePath("/");
}
