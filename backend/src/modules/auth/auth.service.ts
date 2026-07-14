import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users } from "../../db/schema/users";
import { env } from "../../config/env";

export async function login(email: string, senha: string): Promise<string> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) throw new Error("Credenciais inválidas");

  const senhaOk = await bcrypt.compare(senha, user.passwordHash);
  if (!senhaOk) throw new Error("Credenciais inválidas");

  return jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: "7d" });
}
