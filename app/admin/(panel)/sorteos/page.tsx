import Link from "next/link";
import { listSorteosAdmin } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SorteoForm } from "./sorteo-form";
import { EstadoSorteoButtons } from "./estado-sorteo-buttons";

export const dynamic = "force-dynamic";

export default async function AdminSorteosPage() {
  const sorteos = await listSorteosAdmin();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Sorteos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo sorteo</CardTitle>
        </CardHeader>
        <CardContent>
          <SorteoForm />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sorteos.map((s) => (
          <Card key={s.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/sorteos/${s.id}`} className="font-medium hover:underline">
                    {s.nombre}
                  </Link>
                  <Badge variant="secondary">{s.estado}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(s.fechaSorteo).toLocaleDateString("es-CR")} ·{" "}
                  {s.accionesTotales} acciones
                </p>
              </div>
              <EstadoSorteoButtons sorteoId={s.id} estadoActual={s.estado} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
