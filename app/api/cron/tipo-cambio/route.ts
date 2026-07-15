import { NextResponse } from "next/server";
import { obtenerTipoCambio } from "@/lib/bccr/cache";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const tipoCambio = await obtenerTipoCambio();
    return NextResponse.json({ ok: true, tipoCambio });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
