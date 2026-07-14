import { Router } from "express";
import { login } from "./auth.service";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, senha } = req.body as { email?: string; senha?: string };

  if (!email || !senha) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  try {
    const token = await login(email, senha);
    res.json({ token });
  } catch {
    res.status(401).json({ error: "Email ou senha inválidos" });
  }
});
