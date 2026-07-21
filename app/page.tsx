import Link from "next/link";
import { getSorteosActivos } from "@/lib/data/sorteos";

export const dynamic = "force-dynamic";
import { VALOR_ACCION_USD } from "@/lib/acciones";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage() {
  const sorteosActivos = await getSorteosActivos();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          Sorteos benéficos de <span className="text-primary">Apoyemos Juntos</span>
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Comprá en los negocios afiliados, subí tu factura y ganá premios donados por
          nuestros patrocinadores. Por cada ${VALOR_ACCION_USD} (o su equivalente en
          colones) de compra, recibís una acción en el sorteo.
        </p>
        <div className="flex justify-center gap-3">
          <Button render={<Link href="/registro" />} size="lg">
            Participar ahora
          </Button>
          <Button render={<Link href="#como-participar" />} variant="outline" size="lg">
            ¿Cómo participar?
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-bold">Sorteos activos</h2>
        {sorteosActivos.length === 0 && (
          <p className="text-muted-foreground">
            En este momento no hay sorteos activos. Volvé pronto.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {sorteosActivos.map((sorteo) => (
            <Card key={sorteo.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{sorteo.nombre}</CardTitle>
                  <Badge variant="secondary">
                    {new Date(sorteo.fechaSorteo).toLocaleDateString("es-CR", {
                      dateStyle: "medium",
                    })}
                  </Badge>
                </div>
                {sorteo.descripcion && (
                  <CardDescription>{sorteo.descripcion}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">Premios y patrocinadores</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {sorteo.premios.length === 0 && <li>Premios por anunciar</li>}
                  {sorteo.premios.map((p, i) => (
                    <li key={i}>
                      {p.descripcion} — donado por {p.patrocinador}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  {sorteo.accionesAcreditadas} / {sorteo.accionesTotales} acciones
                  acreditadas
                </p>
              </CardContent>
              <CardFooter>
                <Button render={<Link href={`/sorteos/${sorteo.id}`} />} className="w-full">
                  Ver detalle
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section id="como-participar" className="space-y-4 scroll-mt-20">
        <h2 className="font-heading text-2xl font-bold">¿Cómo participar?</h2>
        <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
          <li>Registrate con tu nombre completo, teléfono y cédula de identidad.</li>
          <li>Elegí el sorteo en el que querés participar.</li>
          <li>Subí la foto o el PDF de tu factura de compra.</li>
          <li>
            Por cada ${VALOR_ACCION_USD} (o su equivalente en colones) del monto de la
            factura, se te acredita una acción una vez que el equipo la revise y
            apruebe.
          </li>
          <li>Podés participar en tantos sorteos distintos como quieras.</li>
        </ol>
      </section>
    </div>
  );
}
