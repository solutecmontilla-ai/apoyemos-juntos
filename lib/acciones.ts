export const VALOR_ACCION_USD = 5;

export function calcularAcciones(montoUsd: number) {
  return Math.floor(montoUsd / VALOR_ACCION_USD);
}
