"use client";

import { useActionState } from "react";
import { crearSorteo, type SorteoFormState } from "@/lib/actions/admin-sorteos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: SorteoFormState = {};

export function SorteoForm() {
  const [state, formAction, pending] = useActionState(crearSorteo, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del sorteo</Label>
        <Input id="nombre" name="nombre" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" name="descripcion" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaSorteo">Fecha del sorteo</Label>
          <Input id="fechaSorteo" name="fechaSorteo" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accionesTotales">Acciones a rifar</Label>
          <Input
            id="accionesTotales"
            name="accionesTotales"
            type="number"
            min={1}
            required
          />
        </div>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Creando..." : "Crear sorteo"}
      </Button>
    </form>
  );
}
