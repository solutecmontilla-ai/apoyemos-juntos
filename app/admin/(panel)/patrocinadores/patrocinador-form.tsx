"use client";

import { useActionState } from "react";
import {
  crearPatrocinador,
  type PatrocinadorFormState,
} from "@/lib/actions/admin-patrocinadores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: PatrocinadorFormState = {};

export function PatrocinadorForm() {
  const [state, formAction, pending] = useActionState(crearPatrocinador, initialState);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex-1 space-y-2">
        <Label htmlFor="nombre">Nombre del patrocinador</Label>
        <Input id="nombre" name="nombre" placeholder="Ej. Clínica Dental Sonrisas" required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Agregando..." : "Agregar"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
