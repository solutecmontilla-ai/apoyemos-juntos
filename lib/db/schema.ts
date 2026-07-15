import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  date,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const rolEnum = pgEnum("rol", ["participante", "admin"]);
export const sorteoEstadoEnum = pgEnum("sorteo_estado", [
  "borrador",
  "activo",
  "cerrado",
]);
export const monedaEnum = pgEnum("moneda", ["USD", "CRC"]);
export const facturaEstadoEnum = pgEnum("factura_estado", [
  "pendiente",
  "aprobada",
  "rechazada",
]);
export const tipoCambioFuenteEnum = pgEnum("tipo_cambio_fuente", [
  "bccr_live",
  "fallback",
]);

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  cedula: varchar("cedula", { length: 20 }).notNull().unique(),
  nombreCompleto: varchar("nombre_completo", { length: 200 }).notNull(),
  telefono: varchar("telefono", { length: 20 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  rol: rolEnum("rol").notNull().default("participante"),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const sorteos = pgTable("sorteos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  fechaSorteo: date("fecha_sorteo").notNull(),
  estado: sorteoEstadoEnum("estado").notNull().default("borrador"),
  accionesTotales: integer("acciones_totales").notNull(),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const patrocinadores = pgTable("patrocinadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const premios = pgTable("premios", {
  id: uuid("id").primaryKey().defaultRandom(),
  sorteoId: uuid("sorteo_id")
    .notNull()
    .references(() => sorteos.id, { onDelete: "cascade" }),
  patrocinadorId: uuid("patrocinador_id")
    .notNull()
    .references(() => patrocinadores.id, { onDelete: "restrict" }),
  descripcion: varchar("descripcion", { length: 300 }).notNull(),
  creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const facturas = pgTable(
  "facturas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    sorteoId: uuid("sorteo_id")
      .notNull()
      .references(() => sorteos.id, { onDelete: "cascade" }),
    archivoKey: text("archivo_key").notNull(),

    // Datos crudos extraídos por IA (nunca se sobrescriben, sirven de auditoría)
    iaNumeroControl: text("ia_numero_control"),
    iaNombre: text("ia_nombre"),
    iaMonto: numeric("ia_monto", { precision: 14, scale: 2 }),
    iaMoneda: monedaEnum("ia_moneda"),

    // Datos finales, editables por el admin antes de aprobar
    numeroControl: text("numero_control"),
    monto: numeric("monto", { precision: 14, scale: 2 }).notNull(),
    moneda: monedaEnum("moneda").notNull(),
    tipoCambioUsado: numeric("tipo_cambio_usado", { precision: 10, scale: 4 }),
    montoUsd: numeric("monto_usd", { precision: 14, scale: 2 }).notNull(),
    accionesAcreditadas: integer("acciones_acreditadas").notNull().default(0),

    estado: facturaEstadoEnum("estado").notNull().default("pendiente"),
    motivoRechazo: text("motivo_rechazo"),
    revisadoPor: uuid("revisado_por").references(() => usuarios.id),
    revisadoEn: timestamp("revisado_en", { withTimezone: true }),

    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("facturas_sorteo_numero_control_unique")
      .on(table.sorteoId, table.numeroControl)
      .where(sql`numero_control IS NOT NULL`),
  ]
);

export const tipoCambioCache = pgTable("tipo_cambio_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  fecha: date("fecha").notNull().unique(),
  compra: numeric("compra", { precision: 10, scale: 4 }).notNull(),
  venta: numeric("venta", { precision: 10, scale: 4 }).notNull(),
  fuente: tipoCambioFuenteEnum("fuente").notNull(),
  consultadoEn: timestamp("consultado_en", { withTimezone: true }).notNull().defaultNow(),
});

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  facturas: many(facturas),
}));

export const sorteosRelations = relations(sorteos, ({ many }) => ({
  premios: many(premios),
  facturas: many(facturas),
}));

export const patrocinadoresRelations = relations(patrocinadores, ({ many }) => ({
  premios: many(premios),
}));

export const premiosRelations = relations(premios, ({ one }) => ({
  sorteo: one(sorteos, { fields: [premios.sorteoId], references: [sorteos.id] }),
  patrocinador: one(patrocinadores, {
    fields: [premios.patrocinadorId],
    references: [patrocinadores.id],
  }),
}));

export const facturasRelations = relations(facturas, ({ one }) => ({
  usuario: one(usuarios, { fields: [facturas.usuarioId], references: [usuarios.id] }),
  sorteo: one(sorteos, { fields: [facturas.sorteoId], references: [sorteos.id] }),
  revisor: one(usuarios, { fields: [facturas.revisadoPor], references: [usuarios.id] }),
}));

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;
export type Sorteo = typeof sorteos.$inferSelect;
export type NuevoSorteo = typeof sorteos.$inferInsert;
export type Patrocinador = typeof patrocinadores.$inferSelect;
export type Premio = typeof premios.$inferSelect;
export type Factura = typeof facturas.$inferSelect;
export type NuevaFactura = typeof facturas.$inferInsert;
export type TipoCambioCache = typeof tipoCambioCache.$inferSelect;
