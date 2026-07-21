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

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-base font-extrabold uppercase tracking-tight text-foreground">
          Apoyemos
        </span>
        <span className="-mt-0.5 font-heading text-base font-extrabold uppercase tracking-tight text-primary">
          Juntos
        </span>
      </span>
    </span>
  );
}
