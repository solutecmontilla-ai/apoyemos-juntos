import Image from "next/image";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--brand-teal-dark)] text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="space-y-2">
          <Logo variant="inverted" />
          <p className="max-w-sm text-sm text-white/70">
            Comprá, participá y ganá premios apoyando a negocios y causas de tu comunidad.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Un programa de
          </span>
          <Image
            src="/brand/nexorse-logo.png"
            alt="Programa NexoRSE"
            width={455}
            height={139}
            className="h-9 w-auto"
          />
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Apoyemos Juntos. Todos los derechos reservados.
      </div>
    </footer>
  );
}
