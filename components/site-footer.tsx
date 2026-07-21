import Image from "next/image";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/20">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Comprá, participá y ganá premios apoyando a negocios y causas de tu comunidad.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Un programa de</span>
          <Image
            src="/brand/nexorse-logo.jpg"
            alt="Programa NexoRSE"
            width={56}
            height={56}
            className="rounded-md"
          />
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Apoyemos Juntos. Todos los derechos reservados.
      </div>
    </footer>
  );
}
