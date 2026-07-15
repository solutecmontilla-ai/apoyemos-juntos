CREATE TYPE "public"."factura_estado" AS ENUM('pendiente', 'aprobada', 'rechazada');--> statement-breakpoint
CREATE TYPE "public"."moneda" AS ENUM('USD', 'CRC');--> statement-breakpoint
CREATE TYPE "public"."rol" AS ENUM('participante', 'admin');--> statement-breakpoint
CREATE TYPE "public"."sorteo_estado" AS ENUM('borrador', 'activo', 'cerrado');--> statement-breakpoint
CREATE TYPE "public"."tipo_cambio_fuente" AS ENUM('bccr_live', 'fallback');--> statement-breakpoint
CREATE TABLE "facturas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"sorteo_id" uuid NOT NULL,
	"archivo_key" text NOT NULL,
	"ia_numero_control" text,
	"ia_nombre" text,
	"ia_monto" numeric(14, 2),
	"ia_moneda" "moneda",
	"numero_control" text,
	"monto" numeric(14, 2) NOT NULL,
	"moneda" "moneda" NOT NULL,
	"tipo_cambio_usado" numeric(10, 4),
	"monto_usd" numeric(14, 2) NOT NULL,
	"acciones_acreditadas" integer DEFAULT 0 NOT NULL,
	"estado" "factura_estado" DEFAULT 'pendiente' NOT NULL,
	"motivo_rechazo" text,
	"revisado_por" uuid,
	"revisado_en" timestamp with time zone,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patrocinadores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "premios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sorteo_id" uuid NOT NULL,
	"patrocinador_id" uuid NOT NULL,
	"descripcion" varchar(300) NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sorteos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"descripcion" text,
	"fecha_sorteo" date NOT NULL,
	"estado" "sorteo_estado" DEFAULT 'borrador' NOT NULL,
	"acciones_totales" integer NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tipo_cambio_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fecha" date NOT NULL,
	"compra" numeric(10, 4) NOT NULL,
	"venta" numeric(10, 4) NOT NULL,
	"fuente" "tipo_cambio_fuente" NOT NULL,
	"consultado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tipo_cambio_cache_fecha_unique" UNIQUE("fecha")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cedula" varchar(20) NOT NULL,
	"nombre_completo" varchar(200) NOT NULL,
	"telefono" varchar(20) NOT NULL,
	"password_hash" text NOT NULL,
	"rol" "rol" DEFAULT 'participante' NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_cedula_unique" UNIQUE("cedula")
);
--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_sorteo_id_sorteos_id_fk" FOREIGN KEY ("sorteo_id") REFERENCES "public"."sorteos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_revisado_por_usuarios_id_fk" FOREIGN KEY ("revisado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "premios" ADD CONSTRAINT "premios_sorteo_id_sorteos_id_fk" FOREIGN KEY ("sorteo_id") REFERENCES "public"."sorteos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "premios" ADD CONSTRAINT "premios_patrocinador_id_patrocinadores_id_fk" FOREIGN KEY ("patrocinador_id") REFERENCES "public"."patrocinadores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "facturas_sorteo_numero_control_unique" ON "facturas" USING btree ("sorteo_id","numero_control") WHERE numero_control IS NOT NULL;