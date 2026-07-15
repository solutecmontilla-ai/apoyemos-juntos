import { z } from "zod";

export const invoiceExtractionSchema = z.object({
  numeroControl: z
    .string()
    .nullable()
    .describe(
      "Número de control o número de factura/consecutivo impreso en el documento. Null si no se puede leer."
    ),
  nombre: z
    .string()
    .nullable()
    .describe("Nombre del cliente o razón social que aparece en la factura. Null si no se puede leer."),
  monto: z
    .number()
    .nullable()
    .describe("Monto total de la factura, como número (sin símbolo de moneda). Null si no se puede leer."),
  moneda: z
    .enum(["USD", "CRC"])
    .nullable()
    .describe(
      "Moneda del monto total: USD si son dólares, CRC si son colones costarricenses. Null si no se puede determinar."
    ),
});

export type InvoiceExtraction = z.infer<typeof invoiceExtractionSchema>;
