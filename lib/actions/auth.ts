"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { isValidCedula, normalizeCedula } from "@/lib/auth/cedula";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const registroSchema = z.object({
  nombreCompleto: z.string().trim().min(3, "Ingresá tu nombre completo"),
  telefono: z.string().trim().min(8, "Ingresá un teléfono válido"),
  cedula: z.string().refine(isValidCedula, "Cédula inválida"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type RegistroState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function registrarUsuario(
  _prevState: RegistroState,
  formData: FormData
): Promise<RegistroState> {
  const parsed = registroSchema.safeParse({
    nombreCompleto: formData.get("nombreCompleto"),
    telefono: formData.get("telefono"),
    cedula: formData.get("cedula"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const { nombreCompleto, telefono, cedula, password } = parsed.data;
  const cedulaNormalizada = normalizeCedula(cedula);

  const db = getDb();
  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.cedula, cedulaNormalizada))
    .limit(1);

  if (existente) {
    return { error: "Ya existe una cuenta registrada con esa cédula." };
  }

  const passwordHash = await hashPassword(password);
  await db.insert(usuarios).values({
    nombreCompleto,
    telefono,
    cedula: cedulaNormalizada,
    passwordHash,
    rol: "participante",
  });

  await signIn("credentials", {
    cedula: cedulaNormalizada,
    password,
    redirectTo: "/cuenta",
  });

  return {};
}

export type LoginState = { error?: string };

export async function iniciarSesion(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const cedula = String(formData.get("cedula") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/cuenta");

  try {
    await signIn("credentials", {
      cedula: normalizeCedula(cedula),
      password,
      redirectTo: callbackUrl,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Cédula o contraseña incorrectos." };
    }
    throw error;
  }
}

export type AdminLoginState = { error?: string };

export async function iniciarSesionAdmin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const cedula = String(formData.get("cedula") ?? "");
  const password = String(formData.get("password") ?? "");

  const db = getDb();
  const cedulaNormalizada = normalizeCedula(cedula);
  const [usuario] = await db
    .select({ rol: usuarios.rol })
    .from(usuarios)
    .where(eq(usuarios.cedula, cedulaNormalizada))
    .limit(1);

  if (!usuario || usuario.rol !== "admin") {
    return { error: "Cédula o contraseña incorrectos." };
  }

  try {
    await signIn("credentials", {
      cedula: cedulaNormalizada,
      password,
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Cédula o contraseña incorrectos." };
    }
    throw error;
  }
}

export async function cerrarSesion() {
  await signOut({ redirectTo: "/" });
}
