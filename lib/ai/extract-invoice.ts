import { generateObject } from "ai";
import { invoiceExtractionSchema, type InvoiceExtraction } from "./invoice-schema";

const MODELO_VISION = "anthropic/claude-sonnet-4.6";

export async function extractInvoiceData(
  fileBuffer: Buffer,
  mediaType: string
): Promise<InvoiceExtraction> {
  const esPdf = mediaType === "application/pdf";

  const { object } = await generateObject({
    model: MODELO_VISION,
    schema: invoiceExtractionSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Esta es una factura de compra de Costa Rica. Extraé exactamente estos 3 datos: el número de control (o número de factura/consecutivo), el nombre del cliente o razón social, y el monto total con su moneda (dólares USD o colones CRC). Si algún dato no se puede leer con certeza, devolvé null en ese campo en vez de adivinar.",
          },
          esPdf
            ? {
                type: "file",
                data: fileBuffer,
                mediaType: "application/pdf",
              }
            : {
                type: "image",
                image: fileBuffer,
                mediaType,
              },
        ],
      },
    ],
  });

  return object;
}
