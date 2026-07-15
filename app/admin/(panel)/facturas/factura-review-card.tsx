"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { aprobarFactura, rechazarFactura } from "@/lib/actions/admin-facturas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  factura: {
    id: string;
    usuarioNombre: string;
    usuarioCedula: string;
    sorteoNombre: string;
    iaNumeroControl: string | null;
    iaNombre: string | null;
    iaMonto: string | null;
    iaMoneda: "USD" | "CRC" | null;
    creadoEn: string | Date;
  };
};

export function FacturaReviewCard({ factura }: Props) {
  const [numeroControl, setNumeroControl] = useState(factura.iaNumeroControl ?? "");
  const [nombre, setNombre] = useState(factura.iaNombre ?? "");
  const [monto, setMonto] = useState(factura.iaMonto ?? "");
  const [moneda, setMoneda] = useState<"USD" | "CRC">(factura.iaMoneda ?? "CRC");
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [imagenError, setImagenError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const imagenUrl = `/api/facturas/${factura.id}/imagen`;

  function onAprobar() {
    if (!numeroControl.trim() || !monto) {
      toast.error("Completá número de control y monto antes de aprobar.");
      return;
    }
    startTransition(async () => {
      const result = await aprobarFactura(factura.id, {
        numeroControl: numeroControl.trim(),
        nombre: nombre.trim(),
        monto: Number(monto),
        moneda,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Factura aprobada y acciones acreditadas.");
      }
    });
  }

  function onRechazar() {
    if (!motivoRechazo.trim()) {
      toast.error("Ingresá el motivo del rechazo.");
      return;
    }
    startTransition(async () => {
      const result = await rechazarFactura(factura.id, motivoRechazo);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Factura rechazada.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {factura.usuarioNombre} · {factura.usuarioCedula}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sorteo: {factura.sorteoNombre} · Subida el{" "}
          {new Date(factura.creadoEn).toLocaleDateString("es-CR")}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          {!imagenError ? (
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded border bg-muted">
              <Image
                src={imagenUrl}
                alt="Factura"
                fill
                unoptimized
                className="object-contain"
                onError={() => setImagenError(true)}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No se pudo previsualizar (puede ser un PDF).
            </p>
          )}
          <a
            href={imagenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline underline-offset-4"
          >
            Abrir factura en pestaña nueva
          </a>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor={`numeroControl-${factura.id}`}>Número de control</Label>
            <Input
              id={`numeroControl-${factura.id}`}
              value={numeroControl}
              onChange={(e) => setNumeroControl(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`nombre-${factura.id}`}>Nombre en la factura</Label>
            <Input
              id={`nombre-${factura.id}`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor={`monto-${factura.id}`}>Monto</Label>
              <Input
                id={`monto-${factura.id}`}
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Moneda</Label>
              <Select value={moneda} onValueChange={(v) => setMoneda(v as "USD" | "CRC")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="CRC">CRC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={onAprobar} disabled={isPending}>
              Aprobar
            </Button>
          </div>

          <div className="space-y-1 border-t pt-3">
            <Label htmlFor={`motivo-${factura.id}`}>Motivo de rechazo</Label>
            <Textarea
              id={`motivo-${factura.id}`}
              rows={2}
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
            />
            <Button
              variant="destructive"
              onClick={onRechazar}
              disabled={isPending}
              className="w-full"
            >
              Rechazar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
