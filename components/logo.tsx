import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-heading text-base font-extrabold text-primary-foreground",
        className,
      )}
    >
      AJ
    </span>
  );
}

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "inverted";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-base font-extrabold uppercase tracking-tight",
            variant === "inverted" ? "text-white" : "text-foreground",
          )}
        >
          Apoyemos
        </span>
        <span
          className={cn(
            "-mt-0.5 font-heading text-base font-extrabold uppercase tracking-tight",
            variant === "inverted" ? "text-[var(--brand-cyan)]" : "text-primary",
          )}
        >
          Juntos
        </span>
      </span>
    </span>
  );
}
