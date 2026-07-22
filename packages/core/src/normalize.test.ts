import { describe, expect, it } from "vitest";
import { normalizarNomeMotorista } from "./normalize";

describe("normalizarNomeMotorista", () => {
  it("remove espaços no início e no fim", () => {
    expect(normalizarNomeMotorista("  João Silva  ")).toBe("JOÃO SILVA");
  });

  it("converte para maiúsculas", () => {
    expect(normalizarNomeMotorista("pedro")).toBe("PEDRO");
    expect(normalizarNomeMotorista("maria santos")).toBe("MARIA SANTOS");
  });

  it("colapsa múltiplos espaços internos em um único", () => {
    expect(normalizarNomeMotorista("MARIA   SANTOS")).toBe("MARIA SANTOS");
    expect(normalizarNomeMotorista("joão   da   silva")).toBe("JOÃO DA SILVA");
  });

  it("colapsa tabs e quebras de linha em espaço simples", () => {
    expect(normalizarNomeMotorista("João\t\nSilva")).toBe("JOÃO SILVA");
  });

  it("string já normalizada não sofre alteração", () => {
    expect(normalizarNomeMotorista("PEDRO ALVES")).toBe("PEDRO ALVES");
  });

  it("string vazia retorna string vazia", () => {
    expect(normalizarNomeMotorista("")).toBe("");
  });

  it("string só com espaços retorna string vazia", () => {
    expect(normalizarNomeMotorista("   ")).toBe("");
  });

  it("nome com uma palavra", () => {
    expect(normalizarNomeMotorista("  Thiago  ")).toBe("THIAGO");
  });
});
