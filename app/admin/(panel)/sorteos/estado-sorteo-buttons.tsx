"use client";

import { useTransition } from "react";
import { cambiarEstadoSorteo } from "@/lib/actions/admin-sorteos";
import { Button } from "@/components/ui/button";

const ESTADOS: { value: "borrador" | "activo" | "cerrado"; label: string }[] = [
  { value: "borrador", label: "Borrador" },
  { value: "activo", label: "Activo" },
  { value: "cerrado", label: "Cerrado" },
];

export function EstadoSorteoButtons({
  sorteoId,
  estadoActual,
}: {
  sorteoId: string;
  estadoActual: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-1">
      {ESTADOS.map((e) => (
        <Button
          key={e.value}
          size="sm"
          variant={estadoActual === e.value ? "default" : "outline"}
          disabled={isPending || estadoActual === e.value}
          onClick={() => startTransition(() => cambiarEstadoSorteo(sorteoId, e.value))}
        >
          {e.label}
        </Button>
      ))}
    </div>
  );
}
