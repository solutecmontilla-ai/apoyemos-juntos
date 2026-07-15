import Link from "next/link";
import { auth } from "@/auth";
import { cerrarSesion } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await auth();
  const usuario = session?.user;

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Sorteos Fundación
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {!usuario && (
            <>
              <Link href="/login" className="text-muted-foreground hover:text-foreground">
                Iniciar sesión
              </Link>
              <Button render={<Link href="/registro" />} size="sm">
                Registrarme
              </Button>
            </>
          )}
          {usuario && usuario.rol === "participante" && (
            <>
              <Link href="/cuenta" className="text-muted-foreground hover:text-foreground">
                Mi cuenta
              </Link>
              <form action={cerrarSesion}>
                <Button type="submit" variant="outline" size="sm">
                  Cerrar sesión
                </Button>
              </form>
            </>
          )}
          {usuario && usuario.rol === "admin" && (
            <>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                Panel admin
              </Link>
              <form action={cerrarSesion}>
                <Button type="submit" variant="outline" size="sm">
                  Cerrar sesión
                </Button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
