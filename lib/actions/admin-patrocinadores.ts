"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { patrocinadores, premios } from "@/lib/db/schema";
import { requireAdmin } from "./admin-guard";

export type PatrocinadorFormState = { error?: string };

export async function crearPatrocinador(
  _prevState: PatrocinadorFormState,
  formData: FormData
): Promise<PatrocinadorFormState> {
  await requireAdmin();

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (nombre.length < 2) {
    return { error: "Ingresá el nombre del patrocinador." };
  }

  const db = getDb();
  await db.insert(patrocinadores).values({ nombre });

  revalidatePath("/admin/patrocinadores");
  return {};
}

const premioSchema = z.object({
  sorteoId: z.string().uuid(),
  patrocinadorId: z.string().uuid(),
  descripcion: z.string().trim().min(2),
});

export type PremioFormState = { error?: string };

export async function crearPremio(
  _prevState: PremioFormState,
  formData: FormData
): Promise<PremioFormState> {
  await requireAdmin();

  const parsed = premioSchema.safeParse({
    sorteoId: formData.get("sorteoId"),
    patrocinadorId: formData.get("patrocinadorId"),
    descripcion: formData.get("descripcion"),
  });

  if (!parsed.success) {
    return { error: "Revisá los datos del premio." };
  }

  const db = getDb();
  await db.insert(premios).values(parsed.data);

  revalidatePath(`/admin/sorteos/${parsed.data.sorteoId}`);
  return {};
}
