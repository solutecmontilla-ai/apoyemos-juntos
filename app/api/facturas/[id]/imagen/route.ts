import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { facturas } from "@/lib/db/schema";
import { obtenerArchivo } from "@/lib/storage/s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  const [factura] = await db
    .select({ usuarioId: facturas.usuarioId, archivoKey: facturas.archivoKey })
    .from(facturas)
    .where(eq(facturas.id, id))
    .limit(1);

  if (!factura) {
    return new NextResponse("No encontrada", { status: 404 });
  }

  const esDueno = factura.usuarioId === session.user.id;
  const esAdmin = session.user.rol === "admin";
  if (!esDueno && !esAdmin) {
    return new NextResponse("No autorizado", { status: 403 });
  }

  const result = await obtenerArchivo(factura.archivoKey);
  if (!result.stream) {
    return new NextResponse("No encontrada", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-cache",
    },
  });
}
