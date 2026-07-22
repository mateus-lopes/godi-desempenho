import { describe, it, expect, vi } from "vitest";

vi.mock("../../db/client", () => ({ db: {}, pool: {} }));
vi.mock("../../db/schema/users", () => ({ users: {} }));

import { createUserSchema } from "./users.service";

describe("createUserSchema — válido (T29)", () => {
  it("aceita email + senha com 6+ caracteres", () => {
    const r = createUserSchema.safeParse({ email: "user@teste.com", senha: "abc123" });
    expect(r.success).toBe(true);
  });

  it("aceita senha longa", () => {
    expect(createUserSchema.safeParse({ email: "x@x.com", senha: "senhamuito@segura#2026" }).success).toBe(true);
  });
});

describe("createUserSchema — email", () => {
  it("rejeita email sem @", () => {
    expect(createUserSchema.safeParse({ email: "invalido", senha: "abc123" }).success).toBe(false);
  });

  it("rejeita email sem domínio", () => {
    expect(createUserSchema.safeParse({ email: "user@", senha: "abc123" }).success).toBe(false);
  });

  it("rejeita email vazio", () => {
    expect(createUserSchema.safeParse({ email: "", senha: "abc123" }).success).toBe(false);
  });

  it("aceita email de admin real do sistema", () => {
    expect(createUserSchema.safeParse({ email: "suporte@goditransporte.com.br", senha: "godi!@#123" }).success).toBe(true);
  });
});

describe("createUserSchema — senha (T46)", () => {
  it("T46: rejeita senha com menos de 6 caracteres", () => {
    expect(createUserSchema.safeParse({ email: "a@b.com", senha: "12345" }).success).toBe(false);
    expect(createUserSchema.safeParse({ email: "a@b.com", senha: "abc" }).success).toBe(false);
    expect(createUserSchema.safeParse({ email: "a@b.com", senha: "" }).success).toBe(false);
  });

  it("aceita senha com exatamente 6 caracteres (limite inferior)", () => {
    expect(createUserSchema.safeParse({ email: "a@b.com", senha: "123456" }).success).toBe(true);
  });

  it("mensagem de erro contém descrição legível", () => {
    const r = createUserSchema.safeParse({ email: "a@b.com", senha: "123" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msgs = r.error.errors.map(e => e.message).join(" ");
      expect(msgs).toMatch(/6/);
    }
  });
});
