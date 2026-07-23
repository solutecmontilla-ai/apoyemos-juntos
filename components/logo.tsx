import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "inverted";
}) {
  return (
    <Image
      src={variant === "inverted" ? "/brand/w-icon-cyan.png" : "/brand/w-icon-black.png"}
      alt=""
      aria-hidden="true"
      width={585}
      height={434}
      className={cn("h-9 w-auto shrink-0 sm:h-11", className)}
    />
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
      <LogoMark variant={variant} />
      <Image
        src={
          variant === "inverted"
            ? "/brand/apoyemos-juntos-wordmark-white.png"
            : "/brand/apoyemos-juntos-wordmark-black.png"
        }
        alt="Apoyemos Juntos"
        width={806}
        height={302}
        className="h-7 w-auto sm:h-9"
      />
    </span>
  );
}
