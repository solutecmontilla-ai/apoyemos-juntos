import { listFacturasPendientes } from "@/lib/data/admin";
import { FacturaReviewCard } from "./factura-review-card";

export const dynamic = "force-dynamic";

export default async function AdminFacturasPage() {
  const pendientes = await listFacturasPendientes();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Facturas pendientes de revisión</h1>

      {pendientes.length === 0 && (
        <p className="text-muted-foreground">No hay facturas pendientes.</p>
      )}

      <div className="space-y-4">
        {pendientes.map(({ factura, usuarioNombre, usuarioCedula, sorteoNombre }) => (
          <FacturaReviewCard
            key={factura.id}
            factura={{
              id: factura.id,
              usuarioNombre,
              usuarioCedula,
              sorteoNombre,
              iaNumeroControl: factura.iaNumeroControl,
              iaNombre: factura.iaNombre,
              iaMonto: factura.iaMonto,
              iaMoneda: factura.iaMoneda,
              creadoEn: factura.creadoEn,
            }}
          />
        ))}
      </div>
    </div>
  );
}
