import { getDb } from "@/lib/db";
import { sorteos, facturas, usuarios } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const db = getDb();

  const [[sorteosActivos], [facturasPendientes], [totalUsuarios]] = await Promise.all([
    db.select({ total: count() }).from(sorteos).where(eq(sorteos.estado, "activo")),
    db.select({ total: count() }).from(facturas).where(eq(facturas.estado, "pendiente")),
    db.select({ total: count() }).from(usuarios),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Resumen</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Sorteos activos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {sorteosActivos.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Facturas pendientes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {facturasPendientes.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Usuarios registrados
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{totalUsuarios.total}</CardContent>
        </Card>
      </div>
    </div>
  );
}
