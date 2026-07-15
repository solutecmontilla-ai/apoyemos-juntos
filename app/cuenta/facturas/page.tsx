import { auth } from "@/auth";
import { getFacturasDeUsuario } from "@/lib/data/facturas";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente de revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

const ESTADO_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  pendiente: "secondary",
  aprobada: "default",
  rechazada: "destructive",
};

export default async function MisFacturasPage() {
  const session = await auth();
  const facturas = await getFacturasDeUsuario(session!.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Mis facturas</h1>

      {facturas.length === 0 ? (
        <p className="text-muted-foreground">Todavía no subiste ninguna factura.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° factura</TableHead>
                <TableHead>Sorteo</TableHead>
                <TableHead>Fecha de carga</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Acciones</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{f.numeroControl ?? "—"}</TableCell>
                  <TableCell>{f.sorteoNombre}</TableCell>
                  <TableCell>
                    {new Date(f.creadoEn).toLocaleDateString("es-CR", {
                      dateStyle: "medium",
                    })}
                  </TableCell>
                  <TableCell>
                    {f.moneda === "USD" ? "$" : "₡"}
                    {Number(f.monto).toLocaleString("es-CR")}
                  </TableCell>
                  <TableCell>{f.accionesAcreditadas}</TableCell>
                  <TableCell>
                    <Badge variant={ESTADO_VARIANT[f.estado]}>
                      {ESTADO_LABEL[f.estado]}
                    </Badge>
                    {f.estado === "rechazada" && f.motivoRechazo && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.motivoRechazo}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
