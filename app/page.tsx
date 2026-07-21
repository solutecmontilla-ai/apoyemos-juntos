import Link from "next/link";
import Image from "next/image";
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
    <div className="space-y-16 pb-16">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-negocios.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(8,61,66,0.95), rgba(8,61,66,0.8) 45%, rgba(8,61,66,0.4))",
            }}
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 py-24 text-center text-white sm:py-32">
          <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Sorteos benéficos de{" "}
            <span className="text-[var(--brand-cyan)]">Apoyemos Juntos</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/85">
            Comprá en los negocios afiliados, subí tu factura y ganá premios donados por
            nuestros patrocinadores. Por cada ${VALOR_ACCION_USD} (o su equivalente en
            colones) de compra, recibís una acción en el sorteo.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button render={<Link href="/registro" />} size="lg">
              Participar ahora
            </Button>
            <Button
              render={<Link href="#como-participar" />}
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              ¿Cómo participar?
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-4 px-4">
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

      <section id="como-participar" className="mx-auto max-w-5xl scroll-mt-20 px-4">
        <div className="grid gap-8 sm:grid-cols-2 sm:items-center">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">¿Cómo participar?</h2>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Registrate con tu nombre completo, teléfono y cédula de identidad.</li>
              <li>Elegí el sorteo en el que querés participar.</li>
              <li>Subí la foto o el PDF de tu factura de compra.</li>
              <li>
                Por cada ${VALOR_ACCION_USD} (o su equivalente en colones) del monto de
                la factura, se te acredita una acción una vez que el equipo la revise y
                apruebe.
              </li>
              <li>Podés participar en tantos sorteos distintos como quieras.</li>
            </ol>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/premios-cajas.jpg"
              alt="Premios donados por nuestros patrocinadores"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/impacto-comunidad.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(8,61,66,0.92), rgba(8,61,66,0.6) 60%, rgba(8,61,66,0.35))",
            }}
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 py-16 text-white">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--brand-cyan)]">
            Nuestro impacto
          </p>
          <h2 className="mt-2 max-w-lg font-heading text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
            Cada compra apoya a una causa real en tu comunidad
          </h2>
          <p className="mt-3 max-w-lg text-white/85">
            Los fondos recaudados junto a nuestros negocios afiliados y patrocinadores se
            destinan a programas sociales de Apoyemos Juntos y del Programa NexoRSE.
          </p>
          <Button render={<Link href="/registro" />} size="lg" className="mt-6">
            Quiero participar
          </Button>
        </div>
      </section>
    </div>
  );
}
