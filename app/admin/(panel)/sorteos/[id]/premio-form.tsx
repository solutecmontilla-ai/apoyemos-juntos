"use client";

import { useActionState } from "react";
import { crearPremio, type PremioFormState } from "@/lib/actions/admin-patrocinadores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: PremioFormState = {};

export function PremioForm({
  sorteoId,
  patrocinadores,
}: {
  sorteoId: string;
  patrocinadores: { id: string; nombre: string }[];
}) {
  const [state, formAction, pending] = useActionState(crearPremio, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="sorteoId" value={sorteoId} />
      <div className="space-y-2">
        <Label htmlFor="patrocinadorId">Patrocinador</Label>
        <Select name="patrocinadorId" required>
          <SelectTrigger id="patrocinadorId" className="w-full">
            <SelectValue placeholder="Elegí un patrocinador" />
          </SelectTrigger>
          <SelectContent>
            {patrocinadores.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Premio</Label>
        <Input id="descripcion" name="descripcion" placeholder="Ej. Un carro 0km" required />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Agregando..." : "Agregar premio"}
      </Button>
    </form>
  );
}
