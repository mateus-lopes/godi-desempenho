import { describe, expect, it } from "vitest";
import { calcularCarga } from "./carga";
import type { CargaInput, CargaCalculada } from "../types/carga";

/**
 * Golden-master: linhas reais copiadas da aba "MAIO - 2026" do
 * DESEMPENHO PESSOAL - THIAGO.xlsx (extraídas do XML interno da planilha,
 * valores já resolvidos pelo Excel, não recalculados por nós).
 */
const casos: Array<{ linha: number; input: CargaInput; esperado: CargaCalculada }> = [
  {
    linha: 4,
    input: {
      valorMotorista: 5460,
      valorEmpresa: 8700,
      valorNF: 100000,
      seguroPercent: 0.0003,
      icmsPercent: 0.03,
      coPercent: 0.035,
      impostoPercent: 0.065,
      diasPagamento: 15,
      percentComissao: 0.1,
    },
    esperado: {
      seguroValor: 30,
      coValor: 304.5,
      impostoValor: 565.5,
      boletoPercent: 0.01995,
      movaValor: 173.565,
      adqTabValor: 73.95,
      totalTaxasPercent: 0.14995,
      valorImpostoTotal: 1378.515,
      comissaoValor: 324,
      boletosValor: 17.5,
      lucro: 1489.985,
      percentRentabilidade: 0.1712626437,
    },
  },
  {
    // C.O = 0%, ICMS = 12%, comissão = 13% — cobre a variação de percentuais observada na planilha
    linha: 8,
    input: {
      valorMotorista: 1260,
      valorEmpresa: 2500,
      valorNF: 100000,
      seguroPercent: 0.0003,
      icmsPercent: 0.12,
      coPercent: 0,
      impostoPercent: 0.065,
      diasPagamento: 15,
      percentComissao: 0.13,
    },
    esperado: {
      seguroValor: 30,
      coValor: 0,
      impostoValor: 162.5,
      boletoPercent: 0.01995,
      movaValor: 49.875,
      adqTabValor: 21.25,
      totalTaxasPercent: 0.20495,
      valorImpostoTotal: 533.625,
      comissaoValor: 161.2,
      boletosValor: 17.5,
      lucro: 497.675,
      percentRentabilidade: 0.19907,
    },
  },
];

describe("calcularCarga — golden master (MAIO - 2026)", () => {
  for (const caso of casos) {
    it(`bate com a linha ${caso.linha} do xlsx real`, () => {
      const resultado = calcularCarga(caso.input);
      for (const chave of Object.keys(caso.esperado) as Array<keyof CargaCalculada>) {
        expect(resultado[chave], chave).toBeCloseTo(caso.esperado[chave], 6);
      }
    });
  }
});
