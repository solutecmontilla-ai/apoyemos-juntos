"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrarUsuario, type RegistroState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: RegistroState = {};

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(registrarUsuario, initialState);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Creá tu cuenta</CardTitle>
          <CardDescription>
            Registrate para participar en los sorteos de Apoyemos Juntos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">Nombre completo</Label>
              <Input id="nombreCompleto" name="nombreCompleto" required />
              {state.fieldErrors?.nombreCompleto && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.nombreCompleto}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" type="tel" required />
              {state.fieldErrors?.telefono && (
                <p className="text-sm text-destructive">{state.fieldErrors.telefono}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula de identidad</Label>
              <Input id="cedula" name="cedula" placeholder="1-2345-6789" required />
              {state.fieldErrors?.cedula && (
                <p className="text-sm text-destructive">{state.fieldErrors.cedula}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
              {state.fieldErrors?.password && (
                <p className="text-sm text-destructive">{state.fieldErrors.password}</p>
              )}
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creando cuenta..." : "Registrarme"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Iniciá sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
