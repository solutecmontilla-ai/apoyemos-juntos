import Link from "next/link";
import { notFound } from "next/navigation";
import { getSorteoDetalle } from "@/lib/data/sorteos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SorteoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sorteo = await getSorteoDetalle(id);

  if (!sorteo) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Volver a sorteos
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{sorteo.nombre}</h1>
        <Badge variant={sorteo.estado === "activo" ? "default" : "secondary"}>
          {sorteo.estado}
        </Badge>
      </div>

      <p className="text-muted-foreground">
        Fecha del sorteo:{" "}
        {new Date(sorteo.fechaSorteo).toLocaleDateString("es-CR", { dateStyle: "long" })}
      </p>

      {sorteo.descripcion && <p>{sorteo.descripcion}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Premios y patrocinadores</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {sorteo.premios.length === 0 && (
              <li className="text-muted-foreground">Premios por anunciar</li>
            )}
            {sorteo.premios.map((p, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{p.descripcion}</span>
                <span className="text-muted-foreground">{p.patrocinador}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {sorteo.accionesAcreditadas} / {sorteo.accionesTotales} acciones acreditadas
      </p>

      {sorteo.estado === "activo" && (
        <Button render={<Link href={`/cuenta/facturas/nueva?sorteoId=${sorteo.id}`} />} size="lg">
          Subir factura y participar
        </Button>
      )}
    </div>
  );
}
