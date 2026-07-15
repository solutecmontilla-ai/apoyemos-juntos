import Link from "next/link";
import { auth } from "@/auth";
import { getResumenAccionesPorSorteo } from "@/lib/data/facturas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CuentaPage() {
  const session = await auth();
  const usuario = session!.user;
  const resumen = await getResumenAccionesPorSorteo(usuario.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hola, {usuario.name}</h1>
        <p className="text-muted-foreground">Cédula {usuario.cedula}</p>
      </div>

      <div className="flex gap-3">
        <Button render={<Link href="/cuenta/facturas/nueva" />}>Subir factura</Button>
        <Button render={<Link href="/cuenta/facturas" />} variant="outline">
          Ver mis facturas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus acciones por sorteo</CardTitle>
        </CardHeader>
        <CardContent>
          {resumen.length === 0 && (
            <p className="text-muted-foreground">
              Todavía no tenés acciones acreditadas. Subí una factura para empezar a
              participar.
            </p>
          )}
          <ul className="space-y-2">
            {resumen.map((r) => (
              <li key={r.sorteoId} className="flex justify-between text-sm">
                <span>{r.sorteoNombre}</span>
                <span className="font-medium">{r.acciones} acciones</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
