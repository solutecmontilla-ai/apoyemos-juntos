import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.rol !== "admin") {
    throw new Error("No autorizado");
  }
  return session.user;
}
