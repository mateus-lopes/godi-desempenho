import { describe, it, expect, vi } from "vitest";

vi.mock("../../db/client", () => ({ db: {}, pool: {} }));
vi.mock("../../db/schema/cargas", () => ({ cargas: {} }));
vi.mock("../../db/schema/clientes", () => ({ clientes: {} }));
vi.mock("../../db/schema/motoristas", () => ({ motoristas: {} }));
vi.mock("@thiago/core", () => ({ calcularCarga: vi.fn(() => ({
  seguroValor: 0, coValor: 0, impostoValor: 0, boletoPercent: 0,
  movaValor: 0, adqTabValor: 0, totalTaxasPercent: 0, valorImpostoTotal: 0,
  comissaoValor: 0, boletosValor: 17.5, lucro: 0, percentRentabilidade: 0,
})) }));

import { createCargaSchema, patchStatusSchema } from "./cargas.service";

// ── Fixture base válido ───────────────────────────────────────────────────────

const VALIDO = {
  data: "2026-07-21",
  clienteId: 1,
  motoristaId: 1,
  valorMotorista: 2000,
  valorEmpresa: 5000,
  valorNf: 5000,
  seguroPercent: 0.003,
  icmsPercent: 0.12,
  coPercent: 0.01,
  impostoPercent: 0.03,
  diasPagamento: 30,
  percentComissao: 0.05,
};

// ── createCargaSchema ─────────────────────────────────────────────────────────

describe("createCargaSchema — payload válido", () => {
  it("aceita todos os campos obrigatórios preenchidos", () => {
    expect(createCargaSchema.safeParse(VALIDO).success).toBe(true);
  });

  it("status default é 'em_andamento'", () => {
    const r = createCargaSchema.safeParse(VALIDO);
    expect(r.success && r.data.status).toBe("em_andamento");
  });

  it("canhotoPago default é false", () => {
    const r = createCargaSchema.safeParse(VALIDO);
    expect(r.success && r.data.canhotoPago).toBe(false);
  });

  it("aceita status 'entregue' explícito", () => {
    const r = createCargaSchema.safeParse({ ...VALIDO, status: "entregue" });
    expect(r.success && r.data.status).toBe("entregue");
  });

  it("aceita campos opcionais nulos (cte, origem, destino, tipoEntrega, formaPagamento)", () => {
    const r = createCargaSchema.safeParse({ ...VALIDO, cte: null, origem: null, destino: null });
    expect(r.success).toBe(true);
  });
});

describe("createCargaSchema — campo data", () => {
  it("rejeita data em formato inválido (T38)", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, data: "21/07/2026" }).success).toBe(false);
    expect(createCargaSchema.safeParse({ ...VALIDO, data: "invalido" }).success).toBe(false);
    expect(createCargaSchema.safeParse({ ...VALIDO, data: "2026-7-1" }).success).toBe(false);
  });

  it("aceita data no formato correto yyyy-MM-dd", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, data: "2026-01-01" }).success).toBe(true);
    expect(createCargaSchema.safeParse({ ...VALIDO, data: "2026-12-31" }).success).toBe(true);
  });
});

describe("createCargaSchema — validações de valor (T25/T26)", () => {
  it("T25: rejeita percentComissao > 1", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, percentComissao: 1.01 }).success).toBe(false);
    expect(createCargaSchema.safeParse({ ...VALIDO, percentComissao: 2 }).success).toBe(false);
  });

  it("aceita percentComissao = 1 (100%)", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, percentComissao: 1 }).success).toBe(true);
  });

  it("T26: rejeita valorMotorista <= 0 (negativo)", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, valorMotorista: -500 }).success).toBe(false);
    expect(createCargaSchema.safeParse({ ...VALIDO, valorMotorista: 0 }).success).toBe(false);
  });

  it("rejeita valorEmpresa <= 0", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, valorEmpresa: 0 }).success).toBe(false);
    expect(createCargaSchema.safeParse({ ...VALIDO, valorEmpresa: -1 }).success).toBe(false);
  });

  it("rejeita valorNf <= 0", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, valorNf: 0 }).success).toBe(false);
  });

  it("rejeita seguroPercent negativo", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, seguroPercent: -0.001 }).success).toBe(false);
  });

  it("rejeita icmsPercent negativo", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, icmsPercent: -0.01 }).success).toBe(false);
  });

  it("rejeita diasPagamento negativo", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, diasPagamento: -1 }).success).toBe(false);
  });

  it("aceita diasPagamento = 0", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, diasPagamento: 0 }).success).toBe(true);
  });
});

describe("createCargaSchema — IDs", () => {
  it("rejeita clienteId negativo", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, clienteId: -1 }).success).toBe(false);
  });

  it("rejeita motoristaId = 0", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, motoristaId: 0 }).success).toBe(false);
  });

  it("rejeita clienteId não-inteiro", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, clienteId: 1.5 }).success).toBe(false);
  });
});

describe("createCargaSchema — status", () => {
  it("rejeita status inválido", () => {
    expect(createCargaSchema.safeParse({ ...VALIDO, status: "cancelado" }).success).toBe(false);
    expect(createCargaSchema.safeParse({ ...VALIDO, status: "ENTREGUE" }).success).toBe(false);
  });
});

// ── patchStatusSchema ─────────────────────────────────────────────────────────

describe("patchStatusSchema", () => {
  it("aceita só status", () => {
    expect(patchStatusSchema.safeParse({ status: "entregue" }).success).toBe(true);
    expect(patchStatusSchema.safeParse({ status: "em_andamento" }).success).toBe(true);
  });

  it("aceita só canhotoPago", () => {
    expect(patchStatusSchema.safeParse({ canhotoPago: true }).success).toBe(true);
    expect(patchStatusSchema.safeParse({ canhotoPago: false }).success).toBe(true);
  });

  it("aceita status + canhotoPago juntos", () => {
    expect(patchStatusSchema.safeParse({ status: "entregue", canhotoPago: true }).success).toBe(true);
  });

  it("aceita body vazio (patch parcial)", () => {
    expect(patchStatusSchema.safeParse({}).success).toBe(true);
  });

  it("rejeita status com valor inválido", () => {
    expect(patchStatusSchema.safeParse({ status: "cancelado" }).success).toBe(false);
  });
});
