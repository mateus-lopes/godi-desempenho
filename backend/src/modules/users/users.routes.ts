import { Router } from "express";
import { requireAuth, requireAdmin } from "../../middlewares/auth";
import { asyncHandler } from "../../lib/asyncHandler";
import {
  createUserSchema,
  listarUsuarios,
  criarUsuario,
  deletarUsuario,
  alterarSenha,
} from "./users.service";

export const usersRouter = Router();
usersRouter.use(requireAuth, requireAdmin);

usersRouter.get("/", asyncHandler(async (_req, res) => {
  res.json(await listarUsuarios());
}));

usersRouter.post("/", asyncHandler(async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  try {
    const user = await criarUsuario(parsed.data);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
}));

usersRouter.delete("/:id", asyncHandler(async (req: any, res) => {
  try {
    const ok = await deletarUsuario(Number(req.params.id), req.userId);
    if (!ok) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}));

usersRouter.put("/:id/senha", asyncHandler(async (req, res) => {
  const { senha } = req.body as { senha?: string };
  if (!senha || senha.length < 6) {
    res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
    return;
  }
  const ok = await alterarSenha(Number(req.params.id), senha);
  if (!ok) { res.status(404).json({ error: "Usuário não encontrado" }); return; }
  res.json({ ok: true });
}));
