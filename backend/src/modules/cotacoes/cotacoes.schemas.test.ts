import { describe, it, expect, vi } from "vitest";

vi.mock("../../db/client", () => ({ db: {}, pool: {} }));
vi.mock("../../db/schema/cotacoes", () => ({ cotacoes: {} }));
vi.mock("../../db/schema/clientes", () => ({ clientes: {} }));
vi.mock("../../db/schema/cargas", () => ({ cargas: {} }));
vi.mock("../../db/schema/motoristas", () => ({ motoristas: {} }));
vi.mock("@thiago/core", () => ({ calcularCarga: vi.fn() }));

import {
  createCotacaoSchema,
  updateCotacaoSchema,
  patchSituacaoSchema,
  converterSchema,
} from "./cotacoes.service";

// ── createCotacaoSchema ───────────────────────────────────────────────────────

describe("createCotacaoSchema — válido (T35)", () => {
  it("aceita apenas a data (todos os outros campos têm default)", () => {
    const r = createCotacaoSchema.safeParse({ data: "2026-07-21" });
    expect(r.success).toBe(true);
  });

  it("aplica defaults corretos", () => {
    const r = createCotacaoSchema.safeParse({ data: "2026-07-21" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.situacao).toBe("pendente");
      expect(r.data.icmsPercent).toBe(4);
      expect(r.data.coPercent).toBe(3.5);
      expect(r.data.impostoPercent).toBe(6.5);
      expect(r.data.seguroPercent).toBe(0.03);
      expect(r.data.diasPagamento).toBe(15);
      expect(r.data.percentComissao).toBe(10);
      expect(r.data.clienteId).toBeNull();
    }
  });

  it("aceita cotação completa com todos os campos (T35)", () => {
    const r = createCotacaoSchema.safeParse({
      data: "2026-07-21",
      clienteId: 1,
      origem: "São Paulo - SP",
      destino: "Curitiba - PR",
      valorNf: 10000,
      valorFrete: 800,
    });
    expect(r.success).toBe(true);
  });
});

describe("createCotacaoSchema — campo data", () => {
  it("rejeita data em formato inválido", () => {
    expect(createCotacaoSchema.safeParse({ data: "21/07/2026" }).success).toBe(false);
    expect(createCotacaoSchema.safeParse({ data: "invalido" }).success).toBe(false);
    expect(createCotacaoSchema.safeParse({ data: "" }).success).toBe(false);
  });

  it("aceita formato yyyy-MM-dd", () => {
    expect(createCotacaoSchema.safeParse({ data: "2026-01-01" }).success).toBe(true);
    expect(createCotacaoSchema.safeParse({ data: "2026-12-31" }).success).toBe(true);
  });
});

describe("createCotacaoSchema — percents", () => {
  it("rejeita icmsPercent negativo", () => {
    expect(createCotacaoSchema.safeParse({ data: "2026-07-21", icmsPercent: -1 }).success).toBe(false);
  });

  it("rejeita coPercent negativo", () => {
    expect(createCotacaoSchema.safeParse({ data: "2026-07-21", coPercent: -0.5 }).success).toBe(false);
  });

  it("aceita percents zerados", () => {
    expect(createCotacaoSchema.safeParse({
      data: "2026-07-21",
      icmsPercent: 0, coPercent: 0, impostoPercent: 0, seguroPercent: 0,
    }).success).toBe(true);
  });
});

describe("createCotacaoSchema — situacao", () => {
  it("aceita 'pendente'", () => {
    const r = createCotacaoSchema.safeParse({ data: "2026-07-21", situacao: "pendente" });
    expect(r.success && r.data.situacao).toBe("pendente");
  });

  it("aceita 'batida'", () => {
    const r = createCotacaoSchema.safeParse({ data: "2026-07-21", situacao: "batida" });
    expect(r.success && r.data.situacao).toBe("batida");
  });

  it("rejeita situacao inválida", () => {
    expect(createCotacaoSchema.safeParse({ data: "2026-07-21", situacao: "cancelada" }).success).toBe(false);
    expect(createCotacaoSchema.safeParse({ data: "2026-07-21", situacao: "PENDENTE" }).success).toBe(false);
  });
});

// ── updateCotacaoSchema ───────────────────────────────────────────────────────

describe("updateCotacaoSchema", () => {
  it("aceita body vazio (todos os campos opcionais no update)", () => {
    expect(updateCotacaoSchema.safeParse({}).success).toBe(true);
  });

  it("aceita atualização parcial de um único campo", () => {
    expect(updateCotacaoSchema.safeParse({ origem: "Novo local" }).success).toBe(true);
  });
});

// ── patchSituacaoSchema ───────────────────────────────────────────────────────

describe("patchSituacaoSchema (T36)", () => {
  it("aceita 'pendente'", () => {
    expect(patchSituacaoSchema.safeParse({ situacao: "pendente" }).success).toBe(true);
  });

  it("aceita 'batida'", () => {
    expect(patchSituacaoSchema.safeParse({ situacao: "batida" }).success).toBe(true);
  });

  it("rejeita situacao inválida", () => {
    expect(patchSituacaoSchema.safeParse({ situacao: "invalida" }).success).toBe(false);
  });

  it("rejeita body vazio (situacao é obrigatória no patch)", () => {
    expect(patchSituacaoSchema.safeParse({}).success).toBe(false);
  });
});

// ── converterSchema ───────────────────────────────────────────────────────────

describe("converterSchema", () => {
  it("aceita motoristaId positivo", () => {
    expect(converterSchema.safeParse({ motoristaId: 1 }).success).toBe(true);
  });

  it("aceita motoristaId + cte opcional", () => {
    expect(converterSchema.safeParse({ motoristaId: 5, cte: "CTE-001" }).success).toBe(true);
  });

  it("aceita sem cte (campo opcional)", () => {
    expect(converterSchema.safeParse({ motoristaId: 1 }).success).toBe(true);
  });

  it("rejeita motoristaId negativo", () => {
    expect(converterSchema.safeParse({ motoristaId: -1 }).success).toBe(false);
  });

  it("rejeita motoristaId = 0", () => {
    expect(converterSchema.safeParse({ motoristaId: 0 }).success).toBe(false);
  });

  it("rejeita sem motoristaId", () => {
    expect(converterSchema.safeParse({}).success).toBe(false);
  });
});
