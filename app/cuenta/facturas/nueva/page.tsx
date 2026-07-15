import { getSorteosParaSelector } from "@/lib/data/sorteos";
import { NuevaFacturaForm } from "./nueva-factura-form";

export default async function NuevaFacturaPage({
  searchParams,
}: {
  searchParams: Promise<{ sorteoId?: string }>;
}) {
  const [sorteosActivos, params] = await Promise.all([
    getSorteosParaSelector(),
    searchParams,
  ]);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Subir factura</h1>
      <NuevaFacturaForm sorteos={sorteosActivos} sorteoIdInicial={params.sorteoId} />
    </div>
  );
}
