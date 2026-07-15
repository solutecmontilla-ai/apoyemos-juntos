import { listUsuariosConAcciones } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const usuarios = await listUsuariosConAcciones();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuarios</h1>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones por sorteo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nombreCompleto}</TableCell>
                <TableCell>{u.cedula}</TableCell>
                <TableCell>{u.telefono}</TableCell>
                <TableCell>
                  <Badge variant={u.rol === "admin" ? "default" : "secondary"}>
                    {u.rol}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.acciones.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <ul className="space-y-0.5 text-sm">
                      {u.acciones.map((a, i) => (
                        <li key={i}>
                          {a.sorteoNombre}: {a.acciones}
                        </li>
                      ))}
                    </ul>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
