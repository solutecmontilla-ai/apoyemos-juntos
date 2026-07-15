const BCCR_ENDPOINT =
  "http://indicadoreseconomicos.bccr.fi.cr/indicadoreseconomicos/WebServices/wsIndicadoresEconomicos.asmx/ObtenerIndicadoresEconomicosXML";

// Indicadores del BCCR: 317 = tipo de cambio de compra, 318 = tipo de cambio de venta.
const INDICADOR_COMPRA = "317";
const INDICADOR_VENTA = "318";

function formatearFechaBccr(fecha: Date) {
  const dd = String(fecha.getDate()).padStart(2, "0");
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const yyyy = fecha.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

async function consultarIndicador(indicador: string, fecha: Date, timeoutMs = 5000) {
  const email = process.env.BCCR_EMAIL;
  const token = process.env.BCCR_TOKEN;
  if (!email || !token) {
    throw new Error("BCCR_EMAIL / BCCR_TOKEN no configurados");
  }

  const fechaStr = formatearFechaBccr(fecha);
  const params = new URLSearchParams({
    Indicador: indicador,
    FechaInicio: fechaStr,
    FechaFinal: fechaStr,
    Nombre: "Fundacion Sorteos",
    SubNiveles: "N",
    CorreoElectronico: email,
    Token: token,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BCCR_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`BCCR respondió ${res.status}`);
    }
    const xml = await res.text();

    // El webservice del BCCR devuelve un XML con nodos <NUM_VALOR>valor</NUM_VALOR>.
    // Tomamos el último valor reportado en el rango consultado (el más reciente).
    const valores = [...xml.matchAll(/<NUM_VALOR>([\d.]+)<\/NUM_VALOR>/g)].map((m) =>
      Number(m[1])
    );

    const valor = valores.at(-1);
    if (valor === undefined || Number.isNaN(valor)) {
      throw new Error("BCCR no devolvió un valor para el indicador solicitado");
    }
    return valor;
  } finally {
    clearTimeout(timeout);
  }
}

export async function consultarTipoCambioBccr(fecha: Date) {
  const [compra, venta] = await Promise.all([
    consultarIndicador(INDICADOR_COMPRA, fecha),
    consultarIndicador(INDICADOR_VENTA, fecha),
  ]);
  return { compra, venta };
}
