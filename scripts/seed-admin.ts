import { getDb } from "../lib/db";
import { usuarios, sorteos, patrocinadores, premios } from "../lib/db/schema";
import { hashPassword } from "../lib/auth/password";
import { normalizeCedula } from "../lib/auth/cedula";
import { eq } from "drizzle-orm";

async function main() {
  const db = getDb();

  const adminCedula = process.env.SEED_ADMIN_CEDULA ?? "1-0000-0000";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "cambiar-esta-clave";
  const cedulaNormalizada = normalizeCedula(adminCedula);

  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.cedula, cedulaNormalizada))
    .limit(1);

  if (!existente) {
    await db.insert(usuarios).values({
      cedula: cedulaNormalizada,
      nombreCompleto: "Administrador Fundación",
      telefono: "00000000",
      passwordHash: await hashPassword(adminPassword),
      rol: "admin",
    });
    console.log(`Admin creado: cédula ${cedulaNormalizada} / clave ${adminPassword}`);
  } else {
    console.log("El admin ya existe, no se crea de nuevo.");
  }

  const sorteosExistentes = await db.select({ id: sorteos.id }).from(sorteos).limit(1);
  if (sorteosExistentes.length === 0) {
    const [clinica] = await db
      .insert(patrocinadores)
      .values({ nombre: "Clínica Dental Sonrisas" })
      .returning();
    const [salon] = await db
      .insert(patrocinadores)
      .values({ nombre: "Salón de Belleza Glamour" })
      .returning();

    const [sorteoCarro] = await db
      .insert(sorteos)
      .values({
        nombre: "Sorteo de fin de año",
        descripcion: "Participá comprando en los negocios afiliados y ganá un carro 0km.",
        fechaSorteo: "2026-12-15",
        estado: "activo",
        accionesTotales: 1000,
      })
      .returning();

    await db.insert(premios).values([
      { sorteoId: sorteoCarro.id, patrocinadorId: clinica.id, descripcion: "Un carro 0km" },
      { sorteoId: sorteoCarro.id, patrocinadorId: salon.id, descripcion: "Un día de spa" },
    ]);

    console.log("Sorteo y patrocinadores de prueba creados.");
  } else {
    console.log("Ya existen sorteos, no se crean datos de prueba.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
