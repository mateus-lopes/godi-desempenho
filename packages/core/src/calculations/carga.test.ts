import { describe, expect, it } from "vitest";
import Decimal from "decimal.js";
import {
  calcularCarga,
  calcularSeguro,
  calcularCO,
  calcularImposto,
  calcularBoletoPercent,
  calcularMova,
  calcularAdqTab,
  calcularTotalTaxasPercent,
  calcularValorImpostoTotal,
  calcularComissao,
  calcularLucro,
  calcularRentabilidade,
  BOLETO_DIARIO_FACTOR,
  ADQ_TAB_PERCENT,
  BOLETOS_VALOR_FIXO,
} from "./carga";
import type { CargaInput, CargaCalculada } from "../types/carga";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const BASE: CargaInput = {
  valorMotorista: 2000,
  valorEmpresa: 5000,
  valorNF: 5000,
  seguroPercent: 0.003,
  icmsPercent: 0.12,
  coPercent: 0.01,
  impostoPercent: 0.03,
  diasPagamento: 30,
  percentComissao: 0.05,
};

// ── Constantes ────────────────────────────────────────────────────────────────

describe("constantes exportadas", () => {
  it("BOLETO_DIARIO_FACTOR = 0.00133", () => {
    expect(BOLETO_DIARIO_FACTOR).toBe(0.00133);
  });
  it("ADQ_TAB_PERCENT = 0.0085", () => {
    expect(ADQ_TAB_PERCENT).toBe(0.0085);
  });
  it("BOLETOS_VALOR_FIXO = 17.5", () => {
    expect(BOLETOS_VALOR_FIXO).toBe(17.5);
  });
});

// ── Sub-funções ───────────────────────────────────────────────────────────────

describe("calcularSeguro", () => {
  it("seguro = valorNF * seguroPercent", () => {
    expect(calcularSeguro(BASE).toNumber()).toBeCloseTo(15, 6); // 5000 * 0.003
  });
  it("zero quando seguroPercent = 0", () => {
    expect(calcularSeguro({ ...BASE, seguroPercent: 0 }).toNumber()).toBe(0);
  });
  it("seguro escala com NF, não com valorEmpresa", () => {
    const r1 = calcularSeguro({ ...BASE, valorNF: 100000 }).toNumber();
    const r2 = calcularSeguro({ ...BASE, valorNF: 200000 }).toNumber();
    expect(r2).toBeCloseTo(r1 * 2, 6);
  });
});

describe("calcularCO", () => {
  it("co = coPercent * valorEmpresa", () => {
    expect(calcularCO(BASE).toNumber()).toBeCloseTo(50, 6); // 0.01 * 5000
  });
  it("zero quando coPercent = 0", () => {
    expect(calcularCO({ ...BASE, coPercent: 0 }).toNumber()).toBe(0);
  });
});

describe("calcularImposto", () => {
  it("imposto = impostoPercent * valorEmpresa", () => {
    expect(calcularImposto(BASE).toNumber()).toBeCloseTo(150, 6); // 0.03 * 5000
  });
});

describe("calcularBoletoPercent", () => {
  it("boletoPercent = diasPagamento * BOLETO_DIARIO_FACTOR", () => {
    expect(calcularBoletoPercent(BASE).toNumber()).toBeCloseTo(30 * 0.00133, 6);
  });
  it("zero quando diasPagamento = 0", () => {
    expect(calcularBoletoPercent({ ...BASE, diasPagamento: 0 }).toNumber()).toBe(0);
  });
  it("proporcional ao número de dias", () => {
    const r15 = calcularBoletoPercent({ ...BASE, diasPagamento: 15 }).toNumber();
    const r30 = calcularBoletoPercent({ ...BASE, diasPagamento: 30 }).toNumber();
    expect(r30).toBeCloseTo(r15 * 2, 6);
  });
});

describe("calcularMova", () => {
  it("mova = boletoPercent * valorEmpresa", () => {
    const bp = calcularBoletoPercent(BASE);
    expect(calcularMova(BASE, bp).toNumber()).toBeCloseTo(0.0399 * 5000, 6);
  });
  it("zero quando boletoPercent = 0 (diasPagamento = 0)", () => {
    expect(calcularMova(BASE, new Decimal(0)).toNumber()).toBe(0);
  });
});

describe("calcularAdqTab", () => {
  it("adqTab = ADQ_TAB_PERCENT * valorEmpresa", () => {
    expect(calcularAdqTab(BASE).toNumber()).toBeCloseTo(0.0085 * 5000, 6);
  });
  it("escala proporcionalmente com valorEmpresa", () => {
    const r = calcularAdqTab({ ...BASE, valorEmpresa: 10000 }).toNumber();
    expect(r).toBeCloseTo(0.0085 * 10000, 6);
  });
});

describe("calcularTotalTaxasPercent", () => {
  it("totalTaxas = icms + co + imposto + boletoPercent", () => {
    const bp = calcularBoletoPercent(BASE);
    const expected = 0.12 + 0.01 + 0.03 + bp.toNumber();
    expect(calcularTotalTaxasPercent(BASE, bp).toNumber()).toBeCloseTo(expected, 6);
  });
  it("zero quando todos percents = 0 e diasPagamento = 0", () => {
    const input: CargaInput = { ...BASE, icmsPercent: 0, coPercent: 0, impostoPercent: 0, diasPagamento: 0 };
    const bp = calcularBoletoPercent(input);
    expect(calcularTotalTaxasPercent(input, bp).toNumber()).toBe(0);
  });
});

describe("calcularValorImpostoTotal", () => {
  it("valorImpostoTotal = valorEmpresa * totalTaxas + adqTab", () => {
    const bp = calcularBoletoPercent(BASE);
    const totalTaxas = calcularTotalTaxasPercent(BASE, bp);
    const adqTab = calcularAdqTab(BASE);
    const result = calcularValorImpostoTotal(BASE, totalTaxas, adqTab).toNumber();
    const expected = 5000 * totalTaxas.toNumber() + adqTab.toNumber();
    expect(result).toBeCloseTo(expected, 6);
  });
});

describe("calcularComissao", () => {
  it("comissao = (valorEmpresa - valorMotorista) * percentComissao", () => {
    expect(calcularComissao(BASE).toNumber()).toBeCloseTo((5000 - 2000) * 0.05, 6); // 150
  });
  it("zero quando percentComissao = 0", () => {
    expect(calcularComissao({ ...BASE, percentComissao: 0 }).toNumber()).toBe(0);
  });
  it("100% da margem quando percentComissao = 1", () => {
    const r = calcularComissao({ ...BASE, percentComissao: 1 }).toNumber();
    expect(r).toBeCloseTo(5000 - 2000, 6);
  });
  it("negativo quando valorMotorista > valorEmpresa (comissão negativa)", () => {
    const r = calcularComissao({ ...BASE, valorMotorista: 6000 }).toNumber();
    expect(r).toBeLessThan(0);
  });
});

describe("calcularLucro", () => {
  it("lucro = empresa - motorista - seguro - impostoTotal - comissao - 17.5", () => {
    const seguro = new Decimal(15);
    const impostoTotal = new Decimal(1042);
    const comissao = new Decimal(150);
    const expected = 5000 - 2000 - 15 - 1042 - 150 - 17.5;
    expect(calcularLucro(BASE, seguro, impostoTotal, comissao).toNumber()).toBeCloseTo(expected, 6);
  });
  it("BOLETOS_VALOR_FIXO (17.5) sempre deduzido do lucro", () => {
    // input sem nenhum custo adicional
    const input: CargaInput = { ...BASE, seguroPercent: 0, icmsPercent: 0, coPercent: 0, impostoPercent: 0, diasPagamento: 0, percentComissao: 0 };
    const lucroSemCustos = calcularLucro(input, new Decimal(0), new Decimal(0), new Decimal(0)).toNumber();
    expect(lucroSemCustos).toBeCloseTo(5000 - 2000 - 17.5, 6);
  });
});

describe("calcularRentabilidade", () => {
  it("rentabilidade = lucro / valorEmpresa", () => {
    const lucro = new Decimal(1775.5);
    expect(calcularRentabilidade(BASE, lucro).toNumber()).toBeCloseTo(1775.5 / 5000, 6);
  });
  it("retorna 0 quando valorEmpresa = 0 (evita divisão por zero)", () => {
    const r = calcularRentabilidade({ ...BASE, valorEmpresa: 0 }, new Decimal(100));
    expect(r.toNumber()).toBe(0);
  });
  it("negativo quando lucro é negativo", () => {
    const r = calcularRentabilidade(BASE, new Decimal(-500)).toNumber();
    expect(r).toBeLessThan(0);
  });
});

// ── calcularCarga (função principal) ─────────────────────────────────────────

describe("calcularCarga — golden master (MAIO - 2026)", () => {
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
      // C.O = 0%, ICMS = 12%, comissão = 13%
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

  for (const caso of casos) {
    it(`bate com a linha ${caso.linha} do xlsx real`, () => {
      const resultado = calcularCarga(caso.input);
      for (const chave of Object.keys(caso.esperado) as Array<keyof CargaCalculada>) {
        expect(resultado[chave], chave).toBeCloseTo(caso.esperado[chave], 6);
      }
    });
  }
});

describe("calcularCarga — cenário T47 (API manual)", () => {
  it("bate com resultado retornado pela API no teste manual", () => {
    // valores usados no T47: lucro=1775.5, rentabilidade=0.3551 (verificado via API)
    const r = calcularCarga(BASE);
    expect(r.lucro).toBeCloseTo(1775.5, 1);
    expect(r.percentRentabilidade).toBeCloseTo(0.3551, 4);
    expect(r.seguroValor).toBeCloseTo(15, 6);
    expect(r.comissaoValor).toBeCloseTo(150, 6);
  });
});

describe("calcularCarga — casos extremos", () => {
  it("diasPagamento = 0 → boletoPercent = 0 e movaValor = 0", () => {
    const r = calcularCarga({ ...BASE, diasPagamento: 0 });
    expect(r.boletoPercent).toBe(0);
    expect(r.movaValor).toBe(0);
  });

  it("valorEmpresa = 0 → percentRentabilidade = 0 (sem divisão por zero)", () => {
    const r = calcularCarga({ ...BASE, valorEmpresa: 0 });
    expect(r.percentRentabilidade).toBe(0);
  });

  it("coPercent = 0 → coValor = 0", () => {
    const r = calcularCarga({ ...BASE, coPercent: 0 });
    expect(r.coValor).toBe(0);
  });

  it("percentComissao = 0 → comissaoValor = 0", () => {
    const r = calcularCarga({ ...BASE, percentComissao: 0 });
    expect(r.comissaoValor).toBe(0);
  });

  it("boletosValor é sempre BOLETOS_VALOR_FIXO (17.5)", () => {
    expect(calcularCarga(BASE).boletosValor).toBe(BOLETOS_VALOR_FIXO);
    expect(calcularCarga({ ...BASE, diasPagamento: 0 }).boletosValor).toBe(BOLETOS_VALOR_FIXO);
  });

  it("lucro negativo quando custos superam valorEmpresa", () => {
    const r = calcularCarga({ ...BASE, valorMotorista: 4800, percentComissao: 0.99 });
    expect(r.lucro).toBeLessThan(0);
    expect(r.percentRentabilidade).toBeLessThan(0);
  });

  it("retorna todos os campos esperados", () => {
    const r = calcularCarga(BASE);
    const campos: Array<keyof CargaCalculada> = [
      "seguroValor", "coValor", "impostoValor", "boletoPercent",
      "movaValor", "adqTabValor", "totalTaxasPercent", "valorImpostoTotal",
      "comissaoValor", "boletosValor", "lucro", "percentRentabilidade",
    ];
    for (const campo of campos) {
      expect(r[campo], campo).toBeDefined();
      expect(typeof r[campo], campo).toBe("number");
    }
  });
});
