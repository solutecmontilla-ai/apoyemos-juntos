import { notFound } from "next/navigation";
import { getSorteoAdmin } from "@/lib/data/admin";
import { listPatrocinadores } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadoSorteoButtons } from "../estado-sorteo-buttons";
import { PremioForm } from "./premio-form";

export const dynamic = "force-dynamic";

export default async function AdminSorteoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [datos, patrocinadores] = await Promise.all([
    getSorteoAdmin(id),
    listPatrocinadores(),
  ]);

  if (!datos) notFound();
  const { sorteo, premios } = datos;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{sorteo.nombre}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(sorteo.fechaSorteo).toLocaleDateString("es-CR")} ·{" "}
            {sorteo.accionesTotales} acciones a rifar
          </p>
        </div>
        <Badge variant="secondary">{sorteo.estado}</Badge>
      </div>

      <EstadoSorteoButtons sorteoId={sorteo.id} estadoActual={sorteo.estado} />

      {sorteo.descripcion && <p className="text-muted-foreground">{sorteo.descripcion}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Premios y patrocinadores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {premios.length === 0 && (
              <li className="text-sm text-muted-foreground">Sin premios asignados aún.</li>
            )}
            {premios.map(({ premio, patrocinador }) => (
              <li key={premio.id} className="flex justify-between text-sm">
                <span>{premio.descripcion}</span>
                <span className="text-muted-foreground">{patrocinador.nombre}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4">
            <PremioForm sorteoId={sorteo.id} patrocinadores={patrocinadores} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
