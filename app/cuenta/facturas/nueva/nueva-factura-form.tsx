"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { crearFactura, type CrearFacturaState } from "@/lib/actions/facturas";
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
import { Card, CardContent } from "@/components/ui/card";

const initialState: CrearFacturaState = {};

export function NuevaFacturaForm({
  sorteos,
  sorteoIdInicial,
}: {
  sorteos: { id: string; nombre: string }[];
  sorteoIdInicial?: string;
}) {
  const [state, formAction, pending] = useActionState(crearFactura, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      toast.success("Factura recibida. Quedará pendiente de revisión.");
      router.push("/cuenta/facturas");
    }
  }, [state.ok, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sorteoId">Sorteo</Label>
            <Select name="sorteoId" defaultValue={sorteoIdInicial} required>
              <SelectTrigger id="sorteoId" className="w-full">
                <SelectValue placeholder="Elegí un sorteo" />
              </SelectTrigger>
              <SelectContent>
                {sorteos.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="factura">Foto o PDF de la factura</Label>
            <Input
              id="factura"
              name="factura"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              required
            />
            <p className="text-xs text-muted-foreground">
              Formatos: JPG, PNG, WEBP o PDF. Máximo 8MB.
            </p>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Procesando factura..." : "Subir factura"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
