import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/sorteos", label: "Sorteos" },
  { href: "/admin/patrocinadores", label: "Patrocinadores" },
  { href: "/admin/facturas", label: "Facturas pendientes" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="w-48 shrink-0 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
