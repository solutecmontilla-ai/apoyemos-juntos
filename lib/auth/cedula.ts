// Cédula de identidad de Costa Rica: 9 dígitos (formato 1-2345-6789),
// a veces escrita con guiones o espacios. Se acepta también DIMEX (11-12
// dígitos) por si algún participante se identifica con cédula de residencia.
export function normalizeCedula(input: string) {
  return input.replace(/[\s-]/g, "");
}

export function isValidCedula(input: string) {
  const normalized = normalizeCedula(input);
  return /^\d{9}$|^\d{11,12}$/.test(normalized);
}
