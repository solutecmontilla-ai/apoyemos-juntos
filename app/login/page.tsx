"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { iniciarSesion, type LoginState } from "@/lib/actions/auth";
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

const initialState: LoginState = {};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [state, formAction, pending] = useActionState(iniciarSesion, initialState);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/cuenta";

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Ingresá con tu cédula y contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula de identidad</Label>
              <Input id="cedula" name="cedula" placeholder="1-2345-6789" required />
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
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/registro" className="underline underline-offset-4">
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
