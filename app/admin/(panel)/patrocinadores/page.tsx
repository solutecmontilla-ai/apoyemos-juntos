import { listPatrocinadores } from "@/lib/data/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatrocinadorForm } from "./patrocinador-form";

export const dynamic = "force-dynamic";

export default async function AdminPatrocinadoresPage() {
  const patrocinadores = await listPatrocinadores();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Patrocinadores</h1>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo patrocinador</CardTitle>
        </CardHeader>
        <CardContent>
          <PatrocinadorForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ul className="space-y-2">
            {patrocinadores.map((p) => (
              <li key={p.id} className="text-sm">
                {p.nombre}
              </li>
            ))}
            {patrocinadores.length === 0 && (
              <li className="text-sm text-muted-foreground">
                Todavía no hay patrocinadores.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
