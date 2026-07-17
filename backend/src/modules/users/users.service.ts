import bcrypt from "bcrypt";
import { eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db/client";
import { users } from "../../db/schema/users";

export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

function mapRow(r: typeof users.$inferSelect) {
  return {
    id: r.id,
    email: r.email,
    role: r.role,
    createdAt: r.createdAt,
  };
}

export async function listarUsuarios() {
  const rows = await db.select().from(users).orderBy(users.createdAt);
  return rows.map(mapRow);
}

export async function criarUsuario(data: z.infer<typeof createUserSchema>) {
  const existe = await db.select({ id: users.id }).from(users).where(eq(users.email, data.email)).limit(1);
  if (existe.length > 0) throw new Error("Email já está em uso");

  const passwordHash = await bcrypt.hash(data.senha, 12);
  const [row] = await db.insert(users).values({ email: data.email, passwordHash, role: 'user' }).returning();
  return mapRow(row);
}

export async function deletarUsuario(id: number, adminId: number) {
  if (id === adminId) throw new Error("Não é possível excluir a própria conta");

  const [row] = await db.delete(users).where(eq(users.id, id)).returning();
  return Boolean(row);
}

export async function alterarSenha(id: number, novaSenha: string) {
  const passwordHash = await bcrypt.hash(novaSenha, 12);
  const [row] = await db.update(users).set({ passwordHash }).where(eq(users.id, id)).returning();
  return Boolean(row);
}
