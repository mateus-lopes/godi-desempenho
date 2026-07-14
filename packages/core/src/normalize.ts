export function normalizarNomeMotorista(nomeBruto: string): string {
  return nomeBruto.trim().toUpperCase().replace(/\s+/g, " ");
}
