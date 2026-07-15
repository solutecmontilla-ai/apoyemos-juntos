"use client";

import { useActionState } from "react";
import { iniciarSesionAdmin, type AdminLoginState } from "@/lib/actions/auth";
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

const initialState: AdminLoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(iniciarSesionAdmin, initialState);

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Panel de administración</CardTitle>
          <CardDescription>Acceso exclusivo para administradores.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input id="cedula" name="cedula" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
